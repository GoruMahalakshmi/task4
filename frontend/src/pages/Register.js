import { useState } from "react";
import api from "../api/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const register = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await api.post("/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      window.location = "/dashboard";
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed.";
      setError(message);
    }
  };

  return (
    <div className="login">
      <div>
        <h2>Create Account</h2>
        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={e => setConfirm(e.target.value)}
          value={confirm}
        />
        <button onClick={register}>Register</button>
        {error && <div className="error-text">{error}</div>}
        <div style={{ marginTop: 8, textAlign: "center", fontSize: 13 }}>
          Already have an account? <a href="/">Login</a>
        </div>
      </div>
    </div>
  );
}
