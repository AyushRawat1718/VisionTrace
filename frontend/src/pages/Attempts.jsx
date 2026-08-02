import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

function fmtTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Attempts() {
  const { assessmentId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);

    api
      .attempts(assessmentId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [assessmentId]);

  return (
    <div className="view">
      <nav className="crumbs">
        <Link to="/dashboard">assessments</Link>
        {data && (
          <>
            <span className="sep">/</span>
            <span className="current">{data.assessment.code}</span>
          </>
        )}
      </nav>

      <h1>{data ? data.assessment.title : "Attempts"}</h1>
      {data && (
        <p className="subhead">
          Candidates who have joined with code <span className="code-pill">{data.assessment.code}</span>
        </p>
      )}

      {error && <div className="error-banner">Couldn't load data: {error}</div>}
      {!data && !error && <div className="loading">Loading…</div>}

      {data && data.attempts.length === 0 && (
        <div className="empty">No one has joined this assessment yet.</div>
      )}

      {data && data.attempts.length > 0 && (
        <div className="card-list">
          {data.attempts.map((attempt) => (
            <Link
              key={attempt.id}
              to={`/dashboard/assessments/${assessmentId}/attempts/${attempt.id}`}
              className="card-row"
            >
              <div className="card-main">
                <div className="card-title">{attempt.name}</div>
                <div className="card-meta">
                  <span>{attempt.email}</span>
                  <span>started {fmtTime(attempt.startedAt)}</span>
                </div>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <div className="n">{attempt.eventCount}</div>
                  <div className="l">events</div>
                </div>
                <div className="stat">
                  <div className="n">{attempt.screenshotCount}</div>
                  <div className="l">shots</div>
                </div>
                <div className="stat flagged">
                  <div className="n">{attempt.flaggedScreenshotCount}</div>
                  <div className="l">flagged</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
