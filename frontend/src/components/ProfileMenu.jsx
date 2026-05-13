import { useState } from "react";
import {
  avatar,
  avatarImage,
  profileDivider,
  profileDropdown,
  profileDropdownDanger,
  profileDropdownItem,
  profileDropdownTop,
  profileMenuButton,
  profileMenuButtonLight,
  profileMenuEmail,
  profileMenuEmailLight,
  profileMenuName,
  profileMenuText,
  profileMenuWrap,
} from "../styles/common";

const getFullName = (user) => {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return name || user?.email || "User";
};

const getInitials = (user) => {
  const first = user?.firstName?.trim()?.[0] || "";
  const last = user?.lastName?.trim()?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U";
};

function ProfileMenu({ user, onLogout, align = "bottom", variant = "dark" }) {
  const [open, setOpen] = useState(false);
  const isLight = variant === "light";

  if (!user) {
    return null;
  }

  return (
    <div style={profileMenuWrap}>
      <button
        type="button"
        style={isLight ? profileMenuButtonLight : profileMenuButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div style={avatar}>
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={getFullName(user)} style={avatarImage} />
          ) : (
            getInitials(user)
          )}
        </div>

        <div style={profileMenuText}>
          <p style={profileMenuName}>{getFullName(user)}</p>
          <p style={isLight ? profileMenuEmailLight : profileMenuEmail}>
            {user.email || user.role || "Signed in"}
          </p>
        </div>
      </button>

      {open && (
        <div style={align === "top" ? profileDropdownTop : profileDropdown}>
          <button type="button" style={profileDropdownItem}>
            <span>{getFullName(user)}</span>
            <small>{user.email || user.role || "Account"}</small>
          </button>
          <div style={profileDivider} />
          <button type="button" style={profileDropdownDanger} onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
