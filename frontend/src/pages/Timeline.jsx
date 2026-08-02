import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

function fmtTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const EVENT_LABELS = {
  FULLSCREEN_EXIT: "Exited fullscreen",
  COPY: "Copied text",
  PASTE: "Pasted text",
  MONITORING_STARTED: "Monitoring started",
  MONITORING_STOPPED: "Monitoring stopped",
  BROWSER_CLOSED: "Browser closed",
};

const EVENT_SEVERITY = {
  TAB_SWITCH: "warn",
  FULLSCREEN_EXIT: "warn",
  COPY: "warn",
  PASTE: "warn",
  MONITORING_STARTED: "ok",
  MONITORING_STOPPED: "ok",
  BROWSER_CLOSED: "warn",
};

// TAB_SWITCH covers two genuinely different signals — switching between
// browser tabs vs. switching away to a whole different app — so it needs a
// reason-aware label instead of one generic string.
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

function EventItem({ item }) {
  const severity = EVENT_SEVERITY[item.type] || "warn";
  const label = labelForEvent(item);

  const metaBits = [];
  if (typeof item.metadata?.characterCount === "number") {
    metaBits.push(`${item.metadata.characterCount} characters`);
  }
  if (item.metadata?.title) metaBits.push(item.metadata.title);

  return (
    <div className="tl-item">
      <span className={`tl-dot ${severity}`}></span>
      <div className="tl-time">{fmtTime(item.createdAt)}</div>
      <div className="tl-body">
        <div className="tl-head">
          <span className="tl-label">{label}</span>
          <span className="tl-kind">event</span>
        </div>
        {metaBits.length > 0 && <div className="tl-meta">{metaBits.join(" · ")}</div>}
      </div>
    </div>
  );
}

function ScreenshotItem({ item }) {
  const severity = item.flagged ? "flagged" : "ok";

  return (
    <div className="tl-item">
      <span className={`tl-dot ${severity}`}></span>
      <div className="tl-time">{fmtTime(item.createdAt)}</div>
      <div className={`tl-body ${item.flagged ? "flagged" : ""}`}>
        <div className="tl-head">
          <span className="tl-label">{item.label || "Screenshot"}</span>
          <span className="tl-kind">{item.flagged ? "flagged" : "screenshot"}</span>
        </div>
        {item.reason && <div className="tl-reason">{item.reason}</div>}
        {typeof item.confidence === "number" && (
          <div className="tl-confidence">confidence {(item.confidence * 100).toFixed(0)}%</div>
        )}
        <div className="tl-shot">
          <img src={item.imageUrl} loading="lazy" alt="Screenshot" />
        </div>
      </div>
    </div>
  );
}

export function Timeline() {
  const { assessmentId, attemptId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setError(null);

    api
      .timeline(attemptId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [attemptId]);

  useEffect(() => {
    setData(null);
    load();
  }, [load]);

  return (
    <div className="view">
      <nav className="crumbs">
        <Link to="/dashboard">assessments</Link>
        {data && (
          <>
            <span className="sep">/</span>
            <Link to={`/dashboard/assessments/${assessmentId}`}>{data.attempt.assessment.code}</Link>
            <span className="sep">/</span>
            <span className="current">{data.attempt.name}</span>
          </>
        )}
      </nav>

      {error && <div className="error-banner">Couldn't load data: {error}</div>}
      {!data && !error && <div className="loading">Loading timeline…</div>}

      {data && (
        <>
          <div className="attempt-header">
            <div>
              <div className="who">{data.attempt.name}</div>
              <div className="email">
                {data.attempt.email} · started {fmtTime(data.attempt.startedAt)}
              </div>
            </div>
            <button className="refresh-btn" onClick={load}>
              ↻ refresh
            </button>
          </div>

          {data.timeline.length === 0 && (
            <div className="empty">No activity recorded yet for this attempt.</div>
          )}

          {data.timeline.length > 0 && (
            <div className="timeline">
              {data.timeline.map((item, i) =>
                item.kind === "event" ? (
                  <EventItem key={i} item={item} />
                ) : (
                  <ScreenshotItem key={i} item={item} />
                ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
