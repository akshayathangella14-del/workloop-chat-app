import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import {
  authCard,
  authSubtitle,
  authTitle,
  errorText,
  form,
  formGroup,
  fullWidth,
  input,
  label,
  linkText,
  loading as loadingStyle,
  mutedText,
  pageCenter,
  primaryBtn,
} from "../styles/common";

const initialForm = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser, isAuthenticated, loading, error, clearError } =
    useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});

  const requestedPath = location.state?.from?.pathname;

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const nextPath =
        currentUser.role === "ADMIN"
          ? requestedPath?.startsWith("/admin")
            ? requestedPath
            : "/admin"
          : requestedPath || "/workspace";

      navigate(nextPath, { replace: true });
    }
  }, [currentUser, isAuthenticated, navigate, requestedPath]);

  useEffect(() => {
    return () => {
      clearError?.();
    };
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    clearError?.();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch {
      return;
    }
  };

  if (loading && !isAuthenticated) {
    return (
      <div style={pageCenter}>
        <div style={loadingStyle}>Signing you in...</div>
      </div>
    );
  }

  return (
    <div style={pageCenter}>
      <section style={authCard}>
        <h1 style={authTitle}>Sign in to your workspace</h1>
        <p style={authSubtitle}>
          Continue to your channels, direct messages, reminders, and team updates.
        </p>

        {error && <p style={errorText}>{error}</p>}

        <form style={form} onSubmit={handleSubmit}>
          <div style={formGroup}>
            <label style={label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              autoComplete="email"
              style={input}
            />
            {fieldErrors.email && <span style={errorText}>{fieldErrors.email}</span>}
          </div>

          <div style={formGroup}>
            <label style={label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              style={input}
            />
            {fieldErrors.password && (
              <span style={errorText}>{fieldErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            style={{ ...primaryBtn, ...fullWidth }}
            disabled={loading}
          >
            Sign in
          </button>
        </form>

        <p style={{ ...mutedText, textAlign: "center", marginTop: "18px" }}>
          New to Slack Clone?{" "}
          <NavLink to="/register" style={linkText}>
            Create an account
          </NavLink>
        </p>
      </section>
    </div>
  );
}

export default Login;
