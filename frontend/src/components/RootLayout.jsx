import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../store/authStore";
import { appBase, mainContent, rootLayout } from "../styles/common";

function RootLayout() {
  const location = useLocation();
  const { checkAuth, authChecked } = useAuth();

  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked, checkAuth]);

  const hideHeader =
    location.pathname.startsWith("/workspace") ||
    location.pathname.startsWith("/channels") ||
    location.pathname.startsWith("/direct") ||
    location.pathname.startsWith("/admin");

  return (
    <div style={appBase}>
      <div style={rootLayout}>
        {!hideHeader && <Header />}
        <main style={mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
