import { useEffect, useState } from "react";
import api from "../api/api";

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/machines");
        setMachines(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load machines.");
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Machines</h2>
          <p className="page-subtitle">
            Installed assets and their latest health snapshot
          </p>
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
      <table className="logs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Last Maintenance</th>
          </tr>
        </thead>
        <tbody>
          {machines.map(m => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.status}</td>
              <td>{m.lastMaintenance || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
