
console.log("VisionTrace content script loaded");

let contextInvalidated = false;

function reportEvent(eventType, metadata = {}) {
  if (contextInvalidated) return;

  try {
    chrome.storage.local.get(["monitoring"], (result) => {
      try {
        if (chrome.runtime.lastError) {
          console.warn("VisionTrace: storage read failed", chrome.runtime.lastError);
          return;
        }

        if (!result.monitoring) return;

        chrome.runtime.sendMessage(
          {
            type: "LOG_EVENT",
            eventType,
            metadata: {
              url: location.href,
              title: document.title,
              ...metadata,
            },
          },
          () => {
            // Reading lastError here (even without using it) prevents Chrome
            // from logging an "Unchecked runtime.lastError" warning, and
            // lets us see exactly when/why delivery failed.
            if (chrome.runtime.lastError) {
              console.warn(
                `VisionTrace: ${eventType} did not reach background —`,
                chrome.runtime.lastError.message,
              );
            }
          },
        );
      } catch (error) {
        // This is the "Extension context invalidated" case: it happens when
        // the extension was reloaded from chrome://extensions after this tab
        // was already open. It's expected during development and only
        // fixable by refreshing this tab — so log it once and stop trying.
        contextInvalidated = true;
        console.warn(
          "VisionTrace: extension context invalidated on this page — refresh this tab to resume monitoring.",
          error,
        );
      }
    });
  } catch (error) {
    // Same failure mode, but thrown synchronously from the storage.local.get
    // call itself rather than from inside its callback.
    contextInvalidated = true;
    console.warn(
      "VisionTrace: extension context invalidated on this page — refresh this tab to resume monitoring.",
      error,
    );
  }
}

// "Left the browser entirely" is now detected in background.js via
// chrome.windows.onFocusChanged, which is reliable even on restricted pages
// content scripts can't run on (e.g. the New Tab page). This just needs to
// report ordinary in-browser tab switches.
document.addEventListener("visibilitychange", () => {
  reportEvent("TAB_SWITCH", {
    visibility: document.visibilityState,
    reason: "tab_visibility",
  });
});

document.addEventListener("copy", () => {
  const selection = window.getSelection()?.toString() ?? "";
  reportEvent("COPY", { characterCount: selection.length });
});

document.addEventListener("paste", (event) => {
  const pasted = event.clipboardData?.getData("text") ?? "";
  reportEvent("PASTE", { characterCount: pasted.length });
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    reportEvent("FULLSCREEN_EXIT");
  }
});
