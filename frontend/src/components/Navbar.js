import config from "../config";

export default function Navbar() {
  const role = localStorage.getItem("role") || "viewer";

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <div className="navbar">
      <div className="navbar-title">{config.appName}</div>

      <div className="nav-right">
        {role === "admin" && (
          <button onClick={() => (window.location = "/admin")}>Admin</button>
        )}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
