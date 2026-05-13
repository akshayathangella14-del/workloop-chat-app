import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { loading as loadingStyle, pageCenter } from "../styles/common";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { currentUser, isAuthenticated, loading, authChecked } = useAuth();

  if (loading || !authChecked) {
    return (
      <div style={pageCenter}>
        <div style={loadingStyle}>Checking your session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
