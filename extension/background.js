import CONFIG from "./config.js";

const BACKEND_URL = CONFIG.BACKEND_URL;
const SCREENSHOT_ALARM_NAME = "visiontrace-screenshot";
const SCREENSHOT_INTERVAL_MINUTES = 0.5;

console.log("VisionTrace background started");

function getState() {
  return chrome.storage.local.get(["monitoring", "attemptId", "sessionCode"]);
}

// Chrome can't screenshot a tab that isn't currently active/visible — that's
// a hard platform limit, not something this extension can work around. What
// it CAN do is report which other tabs are open (title + URL) so the
// backend can flag known AI tools sitting in the background even when the
// candidate isn't actively looking at them right now.
async function getOpenTabsSummary() {
  try {
    const tabs = await chrome.tabs.query({});

    return tabs.map((tab) => ({
      title: tab.title || "Unknown",
      url: tab.url || "",
      active: Boolean(tab.active),
    }));
  } catch (error) {
    console.warn("VisionTrace: failed to list open tabs", error);
    return [];
  }
}

async function postJSON(path, body) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request to ${path} failed`);
  }

  return data;
}

async function logEvent(attemptId, type, metadata = {}) {
  try {
    console.log("[EVENT]", type, metadata);

    await postJSON("/api/events", {
      attemptId,
      type,
      metadata,
    });
  } catch (error) {
    console.error(`VisionTrace: failed to log event ${type}`, error);
  }
}

const MIN_CAPTURE_INTERVAL_MS = 1500;
let lastCaptureAt = 0;

async function captureAndSendScreenshot(
  attemptId,
  screenshotType = "PERIODIC",
  screenshotTrigger = "TIMER",
) {
  const state = await getState();

  if (!state.monitoring || state.attemptId !== attemptId) {
    console.log("[SCREENSHOT BLOCKED]", screenshotType, screenshotTrigger);
    return;
  }

  const now = Date.now();

  if (now - lastCaptureAt < MIN_CAPTURE_INTERVAL_MS) {
    console.warn(
      "[SCREENSHOT SKIPPED — rate limit]",
      screenshotType,
      screenshotTrigger,
      `(${now - lastCaptureAt}ms since last capture)`,
    );
    return;
  }

  lastCaptureAt = now;

  console.log("[SCREENSHOT]", screenshotType, screenshotTrigger);

  try {
    const image = await chrome.tabs.captureVisibleTab(null, {
      format: "jpeg",
      quality: 60,
    });

    // ===== FINAL SAFETY CHECK =====

    const latestState = await getState();

    if (!latestState.monitoring || latestState.attemptId !== attemptId) {
      console.log(
        "[SCREENSHOT DROPPED AFTER CAPTURE]",
        screenshotType,
        screenshotTrigger,
      );
      return;
    }

    // ==============================

    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const openTabs = await getOpenTabsSummary();

    const metadata = {
      title: tab?.title || "Unknown",
      url: tab?.url || "Unknown",
      timestamp: new Date().toISOString(),
      openTabs,
    };

    console.log(
      "[SCREENSHOT SENDING]",
      screenshotType,
      screenshotTrigger,
      metadata.title,
    );

    await postJSON("/api/screenshots", {
      attemptId,
      image,
      type: screenshotType,
      trigger: screenshotTrigger,
      metadata,
    });

    console.log("[SCREENSHOT SUCCESS]", screenshotType, screenshotTrigger);
  } catch (error) {
    console.warn(
      "[SCREENSHOT FAILED]",
      screenshotType,
      screenshotTrigger,
      error,
    );
  }
}

async function startMonitoring(attemptId, sessionCode) {
  await chrome.storage.local.set({
    monitoring: true,
    attemptId,
    sessionCode,
  });

  chrome.alarms.create(SCREENSHOT_ALARM_NAME, {
    periodInMinutes: SCREENSHOT_INTERVAL_MINUTES,
    delayInMinutes: SCREENSHOT_INTERVAL_MINUTES,
  });

  await logEvent(attemptId, "MONITORING_STARTED");

  await captureAndSendScreenshot(attemptId, "PERIODIC", "TIMER");
}

async function stopMonitoring() {
  const { attemptId } = await getState();

  await chrome.storage.local.set({
    monitoring: false,
    attemptId: null,
    sessionCode: null,
  });

  await chrome.alarms.clear(SCREENSHOT_ALARM_NAME);

  lastCaptureAt = 0;

  if (attemptId) {
    await logEvent(attemptId, "MONITORING_STOPPED");
  }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== SCREENSHOT_ALARM_NAME) {
    return;
  }

  const { monitoring, attemptId } = await getState();

  if (!monitoring || !attemptId) {
    return;
  }

  console.log("[ALARM FIRED]");

  await captureAndSendScreenshot(attemptId, "PERIODIC", "TIMER");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message?.type) {
      case "START_MONITORING": {
        console.log("[START_MONITORING]");

        await startMonitoring(message.attemptId, message.sessionCode);

        sendResponse({ success: true });
        break;
      }

      case "STOP_MONITORING": {
        console.log("[STOP_MONITORING]");

        await stopMonitoring();

        sendResponse({ success: true });
        break;
      }

      case "LOG_EVENT": {
        const { monitoring, attemptId } = await getState();

        console.log("[LOG_EVENT RECEIVED]", message.eventType);

        if (monitoring && attemptId) {
          await logEvent(attemptId, message.eventType, message.metadata);

          const screenshotTriggers = [
            "COPY",
            "PASTE",
            "TAB_SWITCH",
            "FULLSCREEN_EXIT",
          ];

          if (screenshotTriggers.includes(message.eventType)) {
            console.log(
              "🔥 Event screenshot:",
              message.eventType,
              "for attempt:",
              attemptId,
            );

            await captureAndSendScreenshot(
              attemptId,
              "EVENT_TRIGGERED",
              message.eventType,
            );

            console.log("✅ Finished event screenshot:", message.eventType);
          }
        }

        sendResponse({ success: true });
        break;
      }

      case "GET_STATE": {
        const state = await getState();

        sendResponse(state);
        break;
      }

      default: {
        sendResponse({
          success: false,
          message: "Unknown message type",
        });
      }
    }
  })();

  return true;
});

chrome.runtime.onSuspend.addListener(async () => {
  const { monitoring, attemptId } = await getState();

  if (monitoring && attemptId) {
    await logEvent(attemptId, "BROWSER_CLOSED");
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  const { monitoring, attemptId } = await getState();

  if (!monitoring || !attemptId) {
    return;
  }

  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await logEvent(attemptId, "TAB_SWITCH", {
      reason: "browser_focus_lost",
      visibility: "hidden",
    });
  } else {
    await logEvent(attemptId, "TAB_SWITCH", {
      reason: "browser_focus_gained",
      visibility: "visible",
    });

    const state = await getState();

    if (state.monitoring && state.attemptId === attemptId) {
      await captureAndSendScreenshot(
        attemptId,
        "EVENT_TRIGGERED",
        "TAB_SWITCH",
      );
    }
  }
});
