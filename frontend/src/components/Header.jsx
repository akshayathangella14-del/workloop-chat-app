import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import ProfileMenu from "./ProfileMenu";
import Logo from "./Logo";
import {
  brand,
  headerBar,
  linkText,
  navActions,
  primaryBtn,
} from "../styles/common";

function Header() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="site-header" style={headerBar}>
      <NavLink className="site-brand" to="/" style={brand}>
        <Logo width={32} height={32} />
        WorkLoop
      </NavLink>

      <nav className="site-navigation" style={navActions}>
        <NavLink className="site-home-link" to="/" style={linkText}>
          Home
        </NavLink>
        {isAuthenticated && currentUser ? (
          <>


            <NavLink
              to={currentUser.role === "ADMIN" ? "/admin" : "/workspace"}
              style={linkText}
            >
              {currentUser.role === "ADMIN" ? "Admin" : "Workspaces"}
            </NavLink>

            <div style={{ width: "260px" }}>
              <ProfileMenu
                user={currentUser}
                onLogout={handleLogout}
                align="top"
                variant="light"
              />
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" style={linkText}>
              Login
            </NavLink>
            <NavLink to="/register" style={primaryBtn}>
              Create account
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
