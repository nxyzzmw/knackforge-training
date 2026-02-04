import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import users from "../../data/users.json";
import type { User } from "../../context/AuthContext";
import "./users.css";

const Users = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const data: User[] = users;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((u) => {
      const matchQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole = role === "All" || u.role === role;
      return matchQuery && matchRole;
    });
  }, [data, query, role]);

  const openProfile = () => {
    if (!selectedUser) return;
    navigate(`/profile?userId=${selectedUser.id}`, {
      state: { user: selectedUser },
    });
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div className="title users-title">Users</div>
        <div className="users-controls">
          <input
            className="form-control users-search"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="form-select users-filter"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td data-label="Name">{u.name}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Role">{u.role}</td>
                <td data-label="Status">{u.status ?? "-"}</td>
                <td data-label="Joined">{u.joinedDate ?? "-"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#userDetailModal"
                    onClick={() => setSelectedUser(u)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-row">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="modal fade"
        id="userDetailModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span>{selectedUser?.name ?? "-"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span>{selectedUser?.email ?? "-"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <span>{selectedUser?.role ?? "-"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span>{selectedUser?.status ?? "-"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Joined</span>
                <span>{selectedUser?.joinedDate ?? "-"}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={openProfile}
                disabled={!selectedUser}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
