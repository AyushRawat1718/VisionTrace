const view = document.getElementById("view");
const crumbs = document.getElementById("crumbs");

const state = {
  route: "assessments", // "assessments" | "attempts" | "timeline"
  assessment: null, // { id, title, code }
  attempt: null, // { id, name, email }
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

async function getJSON(path) {
  const res = await fetch(path);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Request failed: ${path}`);
  }
  return data;
}

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

const EVENT_LABELS = {
  FULLSCREEN_EXIT: "Exited fullscreen",
  COPY: "Copied text",
  PASTE: "Pasted text",
  MONITORING_STARTED: "Monitoring started",
  MONITORING_STOPPED: "Monitoring stopped",
  BROWSER_CLOSED: "Browser closed",
};

// TAB_SWITCH covers two genuinely different signals — switching between
// browser tabs vs. switching away to a whole different app — so it needs
// its own reason-aware label instead of one generic string.
function labelForEvent(item) {
  if (item.type === "TAB_SWITCH") {
    const reason = item.metadata?.reason;
    const visible = item.metadata?.visibility === "visible";

    if (reason === "browser_focus_lost") return "Left the browser";
    if (reason === "browser_focus_gained") return "Back in the browser";
    return visible ? "Returned to this tab" : "Switched away from this tab";
  }

  return EVENT_LABELS[item.type] || item.type;
}

const EVENT_SEVERITY = {
  TAB_SWITCH: "warn",
  FULLSCREEN_EXIT: "warn",
  COPY: "warn",
  PASTE: "warn",
  MONITORING_STARTED: "ok",
  MONITORING_STOPPED: "ok",
  BROWSER_CLOSED: "warn",
};

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------

function renderCrumbs() {
  crumbs.innerHTML = "";

  const home = el(`<button>assessments</button>`);
  home.onclick = () => goToAssessments();
  crumbs.appendChild(home);

  if (state.assessment) {
    crumbs.appendChild(el(`<span class="sep">/</span>`));
    if (state.route === "attempts") {
      crumbs.appendChild(
        el(`<span class="current">${state.assessment.code}</span>`),
      );
    } else {
      const btn = el(`<button>${state.assessment.code}</button>`);
      btn.onclick = () => goToAttempts(state.assessment);
      crumbs.appendChild(btn);
    }
  }

  if (state.attempt) {
    crumbs.appendChild(el(`<span class="sep">/</span>`));
    crumbs.appendChild(
      el(`<span class="current">${state.attempt.name}</span>`),
    );
  }
}

// ---------------------------------------------------------------------------
// Route: assessments list
// ---------------------------------------------------------------------------

async function goToAssessments() {
  state.route = "assessments";
  state.assessment = null;
  state.attempt = null;
  renderCrumbs();

  view.innerHTML = "";
  view.appendChild(el(`<h1>Assessments</h1>`));
  view.appendChild(
    el(`<p class="subhead">Every assessment VisionTrace has been attached to.</p>`),
  );
  view.appendChild(el(`<div class="loading">Loading…</div>`));

  try {
    const { assessments } = await getJSON("/api/dashboard/assessments");
    view.querySelector(".loading")?.remove();

    if (assessments.length === 0) {
      view.appendChild(
        el(`<div class="empty">No assessments yet. Create one via the API to get started.</div>`),
      );
      return;
    }

    const list = el(`<div class="card-list"></div>`);

    for (const a of assessments) {
      const row = el(`
        <div class="card-row">
          <div class="card-main">
            <div class="card-title">${a.title}</div>
            <div class="card-meta">
              <span class="code-pill">${a.code}</span>
              <span>${a.accessType.toLowerCase()}</span>
              <span>${fmtTime(a.createdAt)}</span>
            </div>
          </div>
          <div class="card-stats">
            <div class="stat">
              <div class="n">${a.attemptCount}</div>
              <div class="l">attempts</div>
            </div>
          </div>
        </div>
      `);
      row.onclick = () => goToAttempts(a);
      list.appendChild(row);
    }

    view.appendChild(list);
  } catch (err) {
    renderError(err);
  }
}

// ---------------------------------------------------------------------------
// Route: attempts for one assessment
// ---------------------------------------------------------------------------

async function goToAttempts(assessment) {
  state.route = "attempts";
  state.assessment = assessment;
  state.attempt = null;
  renderCrumbs();

  view.innerHTML = "";
  view.appendChild(el(`<h1>${assessment.title}</h1>`));
  view.appendChild(
    el(`<p class="subhead">Candidates who have joined with code <span class="code-pill">${assessment.code}</span></p>`),
  );
  view.appendChild(el(`<div class="loading">Loading…</div>`));

  try {
    const { attempts } = await getJSON(
      `/api/dashboard/assessments/${assessment.id}/attempts`,
    );
    view.querySelector(".loading")?.remove();

    if (attempts.length === 0) {
      view.appendChild(
        el(`<div class="empty">No one has joined this assessment yet.</div>`),
      );
      return;
    }

    const list = el(`<div class="card-list"></div>`);

    for (const attempt of attempts) {
      const row = el(`
        <div class="card-row">
          <div class="card-main">
            <div class="card-title">${attempt.name}</div>
            <div class="card-meta">
              <span>${attempt.email}</span>
              <span>started ${fmtTime(attempt.startedAt)}</span>
            </div>
          </div>
          <div class="card-stats">
            <div class="stat">
              <div class="n">${attempt.eventCount}</div>
              <div class="l">events</div>
            </div>
            <div class="stat">
              <div class="n">${attempt.screenshotCount}</div>
              <div class="l">shots</div>
            </div>
            <div class="stat flagged">
              <div class="n">${attempt.flaggedScreenshotCount}</div>
              <div class="l">flagged</div>
            </div>
          </div>
        </div>
      `);
      row.onclick = () => goToTimeline(attempt);
      list.appendChild(row);
    }

    view.appendChild(list);
  } catch (err) {
    renderError(err);
  }
}

// ---------------------------------------------------------------------------
// Route: timeline for one attempt
// ---------------------------------------------------------------------------

async function goToTimeline(attempt) {
  state.route = "timeline";
  state.attempt = attempt;
  renderCrumbs();

  view.innerHTML = "";
  view.appendChild(el(`<div class="loading">Loading timeline…</div>`));

  try {
    const { attempt: full, timeline } = await getJSON(
      `/api/dashboard/attempts/${attempt.id}/timeline`,
    );
    view.innerHTML = "";

    const header = el(`
      <div class="attempt-header">
        <div>
          <div class="who">${full.name}</div>
          <div class="email">${full.email} · started ${fmtTime(full.startedAt)}</div>
        </div>
        <button class="refresh-btn" id="refreshBtn">↻ refresh</button>
      </div>
    `);
    header.querySelector("#refreshBtn").onclick = () => goToTimeline(attempt);
    view.appendChild(header);

    if (timeline.length === 0) {
      view.appendChild(
        el(`<div class="empty">No activity recorded yet for this attempt.</div>`),
      );
      return;
    }

    const rail = el(`<div class="timeline"></div>`);

    for (const item of timeline) {
      rail.appendChild(renderTimelineItem(item));
    }

    view.appendChild(rail);
  } catch (err) {
    renderError(err);
  }
}

function renderTimelineItem(item) {
  if (item.kind === "event") {
    const severity = EVENT_SEVERITY[item.type] || "warn";
    const label = labelForEvent(item);

    const metaBits = [];
    if (typeof item.metadata?.characterCount === "number") {
      metaBits.push(`${item.metadata.characterCount} characters`);
    }
    if (item.metadata?.title) metaBits.push(item.metadata.title);

    return el(`
      <div class="tl-item">
        <span class="tl-dot ${severity}"></span>
        <div class="tl-time">${fmtTime(item.createdAt)}</div>
        <div class="tl-body">
          <div class="tl-head">
            <span class="tl-label">${label}</span>
            <span class="tl-kind">event</span>
          </div>
          ${metaBits.length ? `<div class="tl-meta">${metaBits.join(" · ")}</div>` : ""}
        </div>
      </div>
    `);
  }

  // screenshot
  const severity = item.flagged ? "flagged" : "ok";

  return el(`
    <div class="tl-item">
      <span class="tl-dot ${severity}"></span>
      <div class="tl-time">${fmtTime(item.createdAt)}</div>
      <div class="tl-body ${item.flagged ? "flagged" : ""}">
        <div class="tl-head">
          <span class="tl-label">${item.label || "Screenshot"}</span>
          <span class="tl-kind">${item.flagged ? "flagged" : "screenshot"}</span>
        </div>
        ${item.reason ? `<div class="tl-reason">${item.reason}</div>` : ""}
        ${
          typeof item.confidence === "number"
            ? `<div class="tl-confidence">confidence ${(item.confidence * 100).toFixed(0)}%</div>`
            : ""
        }
        <div class="tl-shot"><img src="${item.imageUrl}" loading="lazy" alt="Screenshot" /></div>
      </div>
    </div>
  `);
}

// ---------------------------------------------------------------------------

function renderError(err) {
  console.error(err);
  view.querySelector(".loading")?.remove();
  view.appendChild(
    el(`<div class="error-banner">Couldn't load data: ${err.message}</div>`),
  );
}

goToAssessments();
