import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  authCard,
  authSubtitle,
  authTitle,
  avatar,
  avatarImage,
  errorText,
  form,
  formGroup,
  formRow,
  fullWidth,
  input,
  label,
  linkText,
  loading as loadingStyle,
  mutedText,
  pageCenter,
  primaryBtn,
  successText,
} from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "USER",
  profileImageUrl: null,
};

const getErrorMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Registration failed";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timerId);
  }, [success]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setApiError("");
    setSuccess("");
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "profileImageUrl") {
      const file = files?.[0] || null;

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(file ? URL.createObjectURL(file) : "");
      setFormData((prev) => ({
        ...prev,
        profileImageUrl: file,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    // if (!["USER"].includes(formData.role)) {
    //   errors.role = "Please select a valid role";
    // }

    if (
      formData.profileImageUrl &&
      !["image/jpeg", "image/png", "image/webp"].includes(formData.profileImageUrl.type)
    ) {
      errors.profileImageUrl = "Profile image must be JPG, PNG, or WEBP";
    }

    if (formData.profileImageUrl && formData.profileImageUrl.size > 2 * 1024 * 1024) {
      errors.profileImageUrl = "Profile image must be under 2MB";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => {
    const payload = new FormData();

    payload.append("firstName", formData.firstName.trim());
    payload.append("lastName", formData.lastName.trim());
    payload.append("email", formData.email.trim().toLowerCase());
    payload.append("password", formData.password);
    payload.append("role", formData.role);

    if (formData.profileImageUrl) {
      payload.append("profileImageUrl", formData.profileImageUrl);
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setApiError("");
      setSuccess("");

      await axios.post(`${BASE_URL}/auth/users`, buildPayload(), {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 700);
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={pageCenter}>
        <div style={loadingStyle}>Creating your account...</div>
      </div>
    );
  }

  return (
    <div style={pageCenter}>
      <section style={authCard}>
        <h1 style={authTitle}>Create your account</h1>
        <p style={authSubtitle}>
          Join your team workspace and start collaborating in channels and direct messages.
        </p>

        {apiError && <p style={errorText}>{apiError}</p>}
        {success && <p style={successText}>{success}</p>}

        <form style={form} onSubmit={handleSubmit}>
          <div style={formRow}>
            <div style={formGroup}>
              <label style={label} htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                autoComplete="given-name"
                style={input}
              />
              {fieldErrors.firstName && (
                <span style={errorText}>{fieldErrors.firstName}</span>
              )}
            </div>

            <div style={formGroup}>
              <label style={label} htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                autoComplete="family-name"
                style={input}
              />
            </div>
          </div>

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
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              style={input}
            />
            {fieldErrors.password && (
              <span style={errorText}>{fieldErrors.password}</span>
            )}
          </div>

          <div style={formGroup}>
            <label style={label} htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              style={input}
            />
            {fieldErrors.confirmPassword && (
              <span style={errorText}>{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <div style={formGroup}>
            <label style={label} htmlFor="profileImageUrl">
              Profile image
            </label>
            <input
              id="profileImageUrl"
              name="profileImageUrl"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleChange}
              style={input}
            />
            {fieldErrors.profileImageUrl && (
              <span style={errorText}>{fieldErrors.profileImageUrl}</span>
            )}
            {previewUrl && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    ...avatar,
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    style={avatarImage}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{ ...primaryBtn, ...fullWidth }}
            disabled={loading}
          >
            Create account
          </button>
        </form>

        <p style={{ ...mutedText, textAlign: "center", marginTop: "18px" }}>
          Already have an account?{" "}
          <NavLink to="/login" style={linkText}>
            Sign in
          </NavLink>
        </p>
      </section>
    </div>
  );
}

export default Register;
