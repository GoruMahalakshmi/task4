import { useEffect, useState } from "react";
import api from "../api/api";

export default function ControlPanel() {
  const [machines, setMachines] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [job, setJob] = useState("");
  const [mode, setMode] = useState("Auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role") || "viewer";

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

  const selectedMachine = machines.find(
    m => String(m._id) === String(selectedId)
  );

  const runAction = async (path, body) => {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      await api.post(path, body || {});
      const res = await api.get("/machines");
      setMachines(res.data);
    } catch (err) {
      console.error(err);
      setError("Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Machine Control Panel</h2>
          <p className="page-subtitle">
            Safely operate assets with role-based access and live feedback
          </p>
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
      <div className="control-layout">
        <div className="control-left">
          <label>
            Select machine
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">Choose machine</option>
              {machines.map(m => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.type})
                </option>
              ))}
            </select>
          </label>

          <div className="control-buttons">
            <button
              disabled={!selectedId || loading || role === "viewer"}
              onClick={() => runAction(`/control/${selectedId}/start`)}
            >
              Start
            </button>
            <button
              disabled={!selectedId || loading || role === "viewer"}
              onClick={() => runAction(`/control/${selectedId}/stop`)}
            >
              Stop
            </button>
            <button
              disabled={!selectedId || loading || role === "viewer"}
              onClick={() => runAction(`/control/${selectedId}/reset`)}
            >
              Reset
            </button>
          </div>

          <div className="control-row">
            <label>
              Operating mode
              <select
                value={mode}
                onChange={e => setMode(e.target.value)}
                disabled={!selectedId || loading || role === "viewer"}
              >
                <option value="Auto">Auto</option>
                <option value="Manual">Manual</option>
              </select>
            </label>
            <button
              disabled={!selectedId || loading || role === "viewer"}
              onClick={() =>
                runAction(`/control/${selectedId}/mode`, { mode })
              }
            >
              Apply mode
            </button>
          </div>

          <div className="control-row">
            <label>
              Assign job
              <input
                value={job}
                onChange={e => setJob(e.target.value)}
                placeholder="Job or task name"
                disabled={!selectedId || loading || role === "viewer"}
              />
            </label>
            <button
              disabled={!selectedId || loading || role === "viewer"}
              onClick={() => runAction(`/control/${selectedId}/job`, { job })}
            >
              Assign
            </button>
          </div>

          <button
            className="btn-emergency"
            disabled={!selectedId || loading || role !== "admin"}
            onClick={() => runAction(`/control/${selectedId}/emergency`)}
          >
            Emergency shutdown
          </button>
        </div>

        <div className="control-right">
          {selectedMachine ? (
            <div className="card">
              <h3>{selectedMachine.name}</h3>
              <p>Type: {selectedMachine.type}</p>
              <p>Status: {selectedMachine.status}</p>
              <p>
                Temperature:{" "}
                {Math.round(selectedMachine.latestTemperature || 0)}°C
              </p>
              <p>Efficiency: {Math.round(selectedMachine.efficiency || 0)}%</p>
              <p>Cycle time: {Math.round(selectedMachine.cycleTime || 0)} s</p>
              <p>Mode: {selectedMachine.operatingMode}</p>
              <p>Job: {selectedMachine.assignedJob || "None"}</p>
            </div>
          ) : (
            <p>Select a machine to view its live status.</p>
          )}
        </div>
      </div>
    </div>
  );
}
