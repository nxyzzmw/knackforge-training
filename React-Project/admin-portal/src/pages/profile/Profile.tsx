import { useEffect, useMemo, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import users from "../../data/users.json";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const viewUser =
    (location.state as { user?: typeof user } | null)?.user ?? null;
  const search = new URLSearchParams(location.search);
  const userIdParam = search.get("userId");
  const userFromQuery =
    userIdParam != null
      ? users.find((u) => String(u.id) === String(userIdParam)) ?? null
      : null;
  const isViewOnly = !!viewUser || !!userFromQuery;
  const activeUser = useMemo(
    () => viewUser ?? userFromQuery ?? user,
    [viewUser, userFromQuery, user]
  );
  const [draft, setDraft] = useState({
    id: 0,
    name: "",
    email: "",
    role: "",
    status: "Active",
    joinedDate: "",
  });

  useEffect(() => {
    if (activeUser) {
      setDraft({
        id: activeUser.id,
        name: activeUser.name,
        email: activeUser.email,
        role: activeUser.role,
        status: activeUser.status ?? "Active",
        joinedDate: activeUser.joinedDate ?? "",
      });
    }
  }, [activeUser]);

  const handleChange = (field: keyof typeof draft, value: string) => {
    if (draft.role === "User" && (field === "role" || field === "joinedDate")) {
      return;
    }
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!user || isViewOnly) return;
    updateUser({
      id: draft.id,
      name: draft.name.trim() || user.name,
      email: draft.email.trim() || user.email,
      role: draft.role.trim() || user.role,
      status: draft.status,
      joinedDate: draft.joinedDate || user.joinedDate,
    });
  };

  return (
    <div className="profile-page">
      {!activeUser && (
        <div className="profile-empty">
          No user loaded. Please login or open a user from the Users page.
        </div>
      )}
      <div className="profile-card">
        <div className="profile-avatar-lg">
          <AccountCircleOutlinedIcon />
        </div>
        <h3 className="profile-name">{draft.name || "Profile"}</h3>
        {isViewOnly && (
          <div className="profile-subtitle">Viewing user profile</div>
        )}

        <div className="profile-form">
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              value={draft.name}
              disabled={isViewOnly}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={draft.email}
              disabled={isViewOnly}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <input
              className="form-control"
              value={draft.role}
              disabled={isViewOnly || draft.role === "User"}
              onChange={(e) => handleChange("role", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Joined Date</label>
            <input
              className="form-control"
              type="date"
              value={draft.joinedDate}
              disabled={isViewOnly || draft.role === "User"}
              onChange={(e) => handleChange("joinedDate", e.target.value)}
            />
          </div>
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="profileStatus"
              checked={draft.status === "Active"}
              disabled={isViewOnly}
              onChange={(e) =>
                handleChange("status", e.target.checked ? "Active" : "Inactive")
              }
            />
            <label className="form-check-label" htmlFor="profileStatus">
              {draft.status}
            </label>
          </div>
          {!isViewOnly && (
            <button className="btn btn-primary" type="button" onClick={handleSave}>
              Save Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
