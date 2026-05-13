import axios from "axios";
import { useEffect, useState } from "react";

import {
  card,
  errorText,
  form,
  formGroup,
  input,
  label,
  primaryBtn,
  sectionSubtitle,
  sectionTitle,
  select,
  successText,
  textarea,
} from "../styles/common";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const requestConfig = {
  withCredentials: true,
};

const initialForm = {
  channelName: "",
  description: "",
  channelType: "PUBLIC",
};

// Get id safely
const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || "";
};

// Extract readable error message
const getErrorMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Unable to create channel";

function ChannelCreate({
  workspace,
  workspaceId,
  onChannelCreated,
}) {
  const resolvedWorkspaceId =
    workspaceId || getId(workspace);

  const [formData, setFormData] =
    useState(initialForm);

  const [fieldErrors, setFieldErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // Clear success message automatically
  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setSuccess("");
    }, 3200);

    return () => clearTimeout(timerId);
  }, [success]);

  // Handle form field updates
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error on typing
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
    setSuccess("");
  };

  // Validate form before submit
  const validateForm = () => {
    const errors = {};

    if (!resolvedWorkspaceId) {
      errors.workspace =
        "Select a workspace first";
    }

    if (!formData.channelName.trim()) {
      errors.channelName =
        "Channel name is required";
    }

    if (
      !["PUBLIC", "PRIVATE"].includes(
        formData.channelType
      )
    ) {
      errors.channelType =
        "Select a valid channel type";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Create new channel
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
        `${BASE_URL}/channel-api/channels`,
        {
          workspace: resolvedWorkspaceId,
          channelName:
            formData.channelName.trim(),
          description:
            formData.description.trim(),
          channelType:
            formData.channelType,
        },
        requestConfig
      );

      // Reset form after success
      setFormData(initialForm);

      setSuccess(
        "Channel created successfully"
      );

      onChannelCreated?.(
        res.data?.payload
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={card}>
      <h2 style={sectionTitle}>
        Create channel
      </h2>

      <p style={sectionSubtitle}>
        Channels keep workspace conversations focused and searchable.
      </p>

      <form
        style={form}
        onSubmit={handleSubmit}
      >
        {/* Channel name */}
        <div style={formGroup}>
          <label
            style={label}
            htmlFor="channelName"
          >
            Channel name
          </label>

          <input
            id="channelName"
            name="channelName"
            value={formData.channelName}
            onChange={handleChange}
            placeholder="general"
            style={input}
          />

          {fieldErrors.channelName && (
            <span style={errorText}>
              {fieldErrors.channelName}
            </span>
          )}
        </div>

        {/* Channel type */}
        <div style={formGroup}>
          <label
            style={label}
            htmlFor="channelType"
          >
            Channel type
          </label>

          <select
            id="channelType"
            name="channelType"
            value={formData.channelType}
            onChange={handleChange}
            style={select}
          >
            <option value="PUBLIC">
              Public
            </option>

            <option value="PRIVATE">
              Private
            </option>
          </select>

          {fieldErrors.channelType && (
            <span style={errorText}>
              {fieldErrors.channelType}
            </span>
          )}
        </div>

        {/* Description */}
        <div style={formGroup}>
          <label
            style={label}
            htmlFor="channelDescription"
          >
            Description
          </label>

          <textarea
            id="channelDescription"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What should people discuss here?"
            style={textarea}
          />
        </div>

        {/* Errors and success */}
        {fieldErrors.workspace && (
          <p style={errorText}>
            {fieldErrors.workspace}
          </p>
        )}

        {error && (
          <p style={errorText}>
            {error}
          </p>
        )}

        {success && (
          <p style={successText}>
            {success}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          style={primaryBtn}
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create channel"}
        </button>
      </form>
    </section>
  );
}

export default ChannelCreate;