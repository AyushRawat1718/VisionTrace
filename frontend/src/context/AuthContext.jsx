import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function checkSession() {
      return api
        .me()
        .then((data) => setAdmin(data.admin))
        .catch(() => setAdmin(null));
    }

    setLoading(true);
    checkSession().finally(() => setLoading(false));

    // Chrome (and other browsers) can restore a page instantly from the
    // back/forward cache when navigating via browser back/forward, without
    // re-running any network requests — including this auth check. Without
    // this, a page that was authenticated when it was cached could still
    // *look* authenticated after logging out, purely because the browser
    // restored a frozen snapshot instead of reloading. event.persisted is
    // true specifically when the page came from bfcache.
    function handlePageShow(event) {
      if (event.persisted) {
        setLoading(true);
        checkSession().finally(() => setLoading(false));
      }
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    setAdmin(data.admin);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
