import { useEffect, useState } from "react";
import api from "../api/api";

const PAGE_SIZE = 10;

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/logs");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load logs.");
      }
    };
    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = logs.slice(start, start + PAGE_SIZE);

  const changePage = next => {
    setPage(prev => {
      const target = prev + next;
      if (target < 1) return 1;
      if (target > totalPages) return totalPages;
      return target;
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Activity logs</h2>
          <p className="page-subtitle">
            Operator and system actions for traceability and compliance
          </p>
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
      <table className="logs-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Machine</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map(log => (
            <tr key={log._id}>
              <td>
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td>{log.userId || "-"}</td>
              <td>{log.action}</td>
              <td>{log.machineId || "-"}</td>
            </tr>
          ))}
          {pageItems.length === 0 && (
            <tr>
              <td colSpan={4}>No log entries yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => changePage(-1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => changePage(1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
