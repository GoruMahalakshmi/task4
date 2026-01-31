import { useState, useEffect } from "react";
import api from "../api/api";

export default function AdminTools() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("engineer");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  const promote = async () => {
    setMessage("");
    try {
      const res = await api.post("/auth/promote", { email, role });
      setMessage(`Updated ${res.data.user.email} to ${res.data.user.role}`);
      await loadUsers();
    } catch (err) {
      const m = err.response?.data?.message || "Failed to update role";
      setMessage(m);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      setMessage("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Admin Tools</h2>
          <p className="page-subtitle">Promote or change user roles</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 420 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 13 }}>User email</div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@factory.com"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #1f2937",
              background: "#020617",
              color: "#e5e7eb"
            }}
          />
        </label>
        <label style={{ display: "block", marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 13 }}>Role</div>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #1f2937",
              background: "#020617",
              color: "#e5e7eb"
            }}
          >
            <option value="viewer">Viewer</option>
            <option value="engineer">Engineer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button onClick={promote}>Apply</button>
        {message && <div className="error-text" style={{ marginTop: 8 }}>{message}</div>}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div>Users</div>
        </div>
        <table className="logs-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    onClick={() => {
                      setEmail(u.email);
                      setRole(u.role);
                    }}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
