const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", // send/receive the httpOnly admin session cookie
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    const error = new Error(data.message || `Request failed: ${path}`);
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  demoInfo: () => request("/api/demo"),
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),
  assessments: () => request("/api/dashboard/assessments"),
  attempts: (assessmentId) => request(`/api/dashboard/assessments/${assessmentId}/attempts`),
  timeline: (attemptId) => request(`/api/dashboard/attempts/${attemptId}/timeline`),
};
