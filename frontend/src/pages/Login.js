import { useState } from "react";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      window.location = "/dashboard";
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Login failed. Please check credentials.";
      setError(message);
    }
  };

  return (
    <div className="login">
      <div className="card login-card">
        <h2>Industrial Login</h2>
        <label style={{ display: "block", marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 13 }}>Email</div>
          <input
            placeholder="user@factory.com"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label style={{ display: "block", marginBottom: 8 }}>
          <div style={{ marginBottom: 4, fontSize: 13 }}>Password</div>
          <input
            type="password"
            placeholder="••••••••"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <button onClick={login}>Login</button>
        {error && <div className="error-text">{error}</div>}
        <div style={{ marginTop: 8, textAlign: "center", fontSize: 13 }}>
          No account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
