import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const role = localStorage.getItem("role") || "viewer";

  const linkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <div className="sidebar">
      <h3>Factory</h3>
      <nav className="sidebar-links">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/machines" className={linkClass}>
          Machines
        </NavLink>
        {role !== "viewer" && (
          <NavLink to="/control" className={linkClass}>
            Control
          </NavLink>
        )}
        <NavLink to="/analytics" className={linkClass}>
          Analytics
        </NavLink>
        <NavLink to="/logs" className={linkClass}>
          Logs
        </NavLink>
      </nav>
    </div>
  );
}
