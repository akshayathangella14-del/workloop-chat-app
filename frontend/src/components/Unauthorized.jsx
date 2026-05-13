import { useLocation, useNavigate } from "react-router-dom";
import {
  authCard,
  authSubtitle,
  authTitle,
  ghostBtn,
  pageCenter,
  primaryBtn,
  toolbar,
  unauthorizedBox,
} from "../styles/common";

function Unauthorized() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from?.pathname;

  return (
    <div style={pageCenter}>
      <section style={{ ...authCard, ...unauthorizedBox }}>
        <h1 style={authTitle}>Access restricted</h1>
        <p style={authSubtitle}>
          Your account does not have permission to open this page.
          {fromPath ? ` Requested route: ${fromPath}` : ""}
        </p>

        <div style={{ ...toolbar, justifyContent: "center" }}>
          <button type="button" style={primaryBtn} onClick={() => navigate("/workspace")}>
            Go to workspaces
          </button>
          <button type="button" style={ghostBtn} onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </section>
    </div>
  );
}

export default Unauthorized;
