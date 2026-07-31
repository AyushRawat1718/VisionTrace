// ============================================================================
// VisionTrace — content script
//
// Runs inside every page the candidate visits. Watches for browser-level
// activity (tab switches, copy/paste, exiting fullscreen) and forwards each
// one to background.js, which decides whether monitoring is currently
// active and, if so, ships it to the backend.
// ============================================================================

console.log("VisionTrace content script loaded");

let monitoringActive = false;

// Read the current monitoring flag once on load...
chrome.storage.local.get(["monitoring"], (result) => {
  monitoringActive = Boolean(result.monitoring);
});

// ...and keep it in sync if the popup/background changes it later, so a
// page that's already open starts/stops logging without needing a reload.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && "monitoring" in changes) {
    monitoringActive = Boolean(changes.monitoring.newValue);
  }
});

function reportEvent(eventType, metadata = {}) {
  if (!monitoringActive) return;

  chrome.runtime.sendMessage({
    type: "LOG_EVENT",
    eventType,
    metadata: {
      url: location.href,
      title: document.title,
      ...metadata,
    },
  });
}

// --- Tab switch / visibility ------------------------------------------------
// Fires whenever this tab is hidden (switched away from, minimized, or the
// window loses focus) or becomes visible again.
document.addEventListener("visibilitychange", () => {
  reportEvent("TAB_SWITCH", {
    visibility: document.visibilityState, // "visible" | "hidden"
  });
});

// --- Copy / paste ------------------------------------------------------------
// We deliberately do NOT log the copied/pasted text itself — only the fact
// that it happened and how much text was involved — to avoid capturing
// sensitive content in the process of detecting suspicious behavior.
document.addEventListener("copy", () => {
  const selection = window.getSelection()?.toString() ?? "";
  reportEvent("COPY", { characterCount: selection.length });
});

document.addEventListener("paste", (event) => {
  const pasted = event.clipboardData?.getData("text") ?? "";
  reportEvent("PASTE", { characterCount: pasted.length });
});

// --- Fullscreen exit ----------------------------------------------------------
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    reportEvent("FULLSCREEN_EXIT");
  }
});
