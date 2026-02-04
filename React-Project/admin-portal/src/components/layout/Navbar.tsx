import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import "./navbar.css";
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user, updateUser } = useAuth();
  const [profileDraft, setProfileDraft] = useState({
    id: 0,
    name: "",
    email: "",
    role: "",
    status: "Active",
    joinedDate: "",
  });

  useEffect(() => {
    if (user) {
      setProfileDraft({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status ?? "Active",
        joinedDate: user.joinedDate ?? "",
      });
    }
  }, [user]);

  const handleProfileChange = (
    field: keyof typeof profileDraft,
    value: string
  ) => {
    if (
      profileDraft.role === "User" &&
      (field === "role" || field === "joinedDate")
    ) {
      return;
    }
    setProfileDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    if (!user) return;
    updateUser({
      id: profileDraft.id,
      name: profileDraft.name.trim() || user.name,
      email: profileDraft.email.trim() || user.email,
      role: profileDraft.role.trim() || user.role,
      status: profileDraft.status,
      joinedDate: profileDraft.joinedDate || user.joinedDate,
    });
  };

  return (
    <nav className="top-navbar">
      <div className="top-navbar-inner">
        {/* Left */}
        <div className="brand">
          <div className="brand-icon">
            <img src="/vite.svg" alt="Logo" />
          </div>
          <span className="brand-text">ADMIN PORTAL</span>
        </div>

        {/* Right */}
        <div className="top-actions">
          {/* THEME TOGGLE */}
          <button className="icon-btn" type="button" onClick={toggleTheme}>
            {theme === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="dropdown">
            <button
              className="profile-btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <AccountCircleOutlinedIcon />
              <span className="profile-name">{user?.name ?? 'Profile'}</span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#profileModal"
                >
                  Profile
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="profileModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Profile Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="profile-avatar">
                <AccountCircleOutlinedIcon />
              </div>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  value={profileDraft.name}
                  onChange={(e) =>
                    handleProfileChange("name", e.target.value)
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  value={profileDraft.email}
                  onChange={(e) =>
                    handleProfileChange("email", e.target.value)
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <input
                  className="form-control"
                  value={profileDraft.role}
                  disabled={profileDraft.role === "User"}
                  onChange={(e) =>
                    handleProfileChange("role", e.target.value)
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Joined Date</label>
                <input
                  className="form-control"
                  type="date"
                  value={profileDraft.joinedDate}
                  disabled={profileDraft.role === "User"}
                  onChange={(e) =>
                    handleProfileChange("joinedDate", e.target.value)
                  }
                />
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="statusSwitch"
                  checked={profileDraft.status === "Active"}
                  onChange={(e) =>
                    handleProfileChange(
                      "status",
                      e.target.checked ? "Active" : "Inactive"
                    )
                  }
                />
                <label className="form-check-label" htmlFor="statusSwitch">
                  {profileDraft.status}
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSaveProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
