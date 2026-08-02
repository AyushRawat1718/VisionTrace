import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

function fmtTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Assessments() {
  const [assessments, setAssessments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .assessments()
      .then((data) => setAssessments(data.assessments))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="view">
      <h1>Assessments</h1>
      <p className="subhead">Every assessment VisionTrace has been attached to.</p>

      {error && <div className="error-banner">Couldn't load data: {error}</div>}
      {!assessments && !error && <div className="loading">Loading…</div>}

      {assessments && assessments.length === 0 && (
        <div className="empty">No assessments yet. Create one via the API to get started.</div>
      )}

      {assessments && assessments.length > 0 && (
        <div className="card-list">
          {assessments.map((a) => (
            <Link key={a.id} to={`/dashboard/assessments/${a.id}`} className="card-row">
              <div className="card-main">
                <div className="card-title">{a.title}</div>
                <div className="card-meta">
                  <span className="code-pill">{a.code}</span>
                  <span>{a.accessType.toLowerCase()}</span>
                  <span>{fmtTime(a.createdAt)}</span>
                </div>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <div className="n">{a.attemptCount}</div>
                  <div className="l">attempts</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
