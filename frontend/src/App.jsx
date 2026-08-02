import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TopBar } from "./components/TopBar";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Assessments } from "./pages/Assessments";
import { Attempts } from "./pages/Attempts";
import { Timeline } from "./pages/Timeline";

function Shell() {
  return (
    <div className="app">
      <TopBar />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Shell />}>
            <Route path="/dashboard" element={<Assessments />} />
            <Route path="/dashboard/assessments/:assessmentId" element={<Attempts />} />
            <Route
              path="/dashboard/assessments/:assessmentId/attempts/:attemptId"
              element={<Timeline />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
