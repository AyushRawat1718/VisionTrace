// ============================================================================
// VisionTrace — popup UI
//
// The popup is only responsible for the candidate-facing UI: joining an
// assessment and showing status. It does NOT own any monitoring logic
// itself (that all lives in background.js) so that monitoring keeps
// running after the popup is closed.
// ============================================================================

const BACKEND_URL = "http://localhost:8000";

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const setupScreen = document.getElementById("setupScreen");
const monitoringScreen = document.getElementById("monitoringScreen");

const activeSession = document.getElementById("activeSession");
const statusMessage = document.getElementById("statusMessage");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const sessionIdInput = document.getElementById("sessionId");

function showMonitoringScreen(sessionCode) {
  activeSession.textContent = sessionCode;

  setupScreen.style.display = "none";
  monitoringScreen.style.display = "block";
}

function showSetupScreen() {
  setupScreen.style.display = "block";
  monitoringScreen.style.display = "none";
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "#c0392b" : "#555";
}

function setStartButtonLoading(isLoading) {
  startBtn.disabled = isLoading;
  startBtn.textContent = isLoading ? "Joining…" : "Start Monitoring";
}

// Restore UI state on popup open, in case monitoring is already running.
chrome.storage.local.get(["monitoring", "sessionCode"], (result) => {
  if (result.monitoring) {
    showMonitoringScreen(result.sessionCode);
  }
});

startBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const code = sessionIdInput.value.trim();

  if (!name || !email || !code) {
    setStatus("Please fill in your name, email, and the assessment code.", true);
    return;
  }

  setStatus("");
  setStartButtonLoading(true);

  try {
    // Verify the code with the backend and get back an attemptId, which is
    // what all subsequent events/screenshots are tagged with.
    const response = await fetch(`${BACKEND_URL}/api/assessments/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, code }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setStatus(data.message || "Could not join this assessment.", true);
      return;
    }

    // Hand off to the background service worker, which owns monitoring
    // from this point on.
    await chrome.runtime.sendMessage({
      type: "START_MONITORING",
      attemptId: data.attemptId,
      sessionCode: code,
    });

    showMonitoringScreen(code);
  } catch (error) {
    console.error(error);
    setStatus("Could not reach the VisionTrace server.", true);
  } finally {
    setStartButtonLoading(false);
  }
});

stopBtn.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "STOP_MONITORING" });
  showSetupScreen();
});
