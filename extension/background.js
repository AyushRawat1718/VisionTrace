// ============================================================================
// VisionTrace — background service worker
// ============================================================================

const BACKEND_URL = "http://localhost:8000";
const SCREENSHOT_ALARM_NAME = "visiontrace-screenshot";
const SCREENSHOT_INTERVAL_MINUTES = 0.5;

console.log("VisionTrace background started");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getState() {
  return chrome.storage.local.get(["monitoring", "attemptId", "sessionCode"]);
}

async function postJSON(path, body) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    await postJSON("/api/events", { attemptId, type, metadata });
  } catch (error) {
    console.error(`VisionTrace: failed to log event ${type}`, error);
  }
}

async function captureAndSendScreenshot(attemptId) {
  try {
    const image = await chrome.tabs.captureVisibleTab(null, {
      format: "jpeg",
      quality: 60,
    });

    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const metadata = {
      title: tab?.title || "Unknown",
      url: tab?.url || "Unknown",
      timestamp: new Date().toISOString(),
    };

    await postJSON("/api/screenshots", {
      attemptId,
      image,
      metadata,
    });
  } catch (error) {
    console.warn(
      "VisionTrace: screenshot capture/send skipped:",
      error.message,
    );
  }
}

// ---------------------------------------------------------------------------
// Monitoring lifecycle
// ---------------------------------------------------------------------------

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

  await captureAndSendScreenshot(attemptId);
}

async function stopMonitoring() {
  const { attemptId } = await getState();

  chrome.alarms.clear(SCREENSHOT_ALARM_NAME);

  if (attemptId) {
    await logEvent(attemptId, "MONITORING_STOPPED");
  }

  await chrome.storage.local.set({
    monitoring: false,
    attemptId: null,
    sessionCode: null,
  });
}

// ---------------------------------------------------------------------------
// Listeners
// ---------------------------------------------------------------------------

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== SCREENSHOT_ALARM_NAME) return;

  const { monitoring, attemptId } = await getState();

  if (!monitoring || !attemptId) return;

  await captureAndSendScreenshot(attemptId);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message?.type) {
      case "START_MONITORING": {
        await startMonitoring(message.attemptId, message.sessionCode);
        sendResponse({ success: true });
        break;
      }

      case "STOP_MONITORING": {
        await stopMonitoring();
        sendResponse({ success: true });
        break;
      }

      case "LOG_EVENT": {
        const { monitoring, attemptId } = await getState();

        if (monitoring && attemptId) {
          await logEvent(attemptId, message.eventType, message.metadata);
        }

        sendResponse({ success: true });
        break;
      }

      case "GET_STATE": {
        const state = await getState();
        sendResponse(state);
        break;
      }

      default:
        sendResponse({
          success: false,
          message: "Unknown message type",
        });
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
