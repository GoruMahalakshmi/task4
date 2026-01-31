import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/api";
import MachineCard from "../components/MachineCard";
import AlertToast from "../components/AlertToast";

export default function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadMachines = async () => {
      try {
        const res = await api.get("/machines");
        setMachines(res.data);
        setLastUpdated(new Date().toISOString());
      } catch (err) {
        console.error(err);
        setError("Failed to load machines.");
      }
    };

    const loadAlerts = async () => {
      try {
        const res = await api.get("/alerts/unresolved");
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMachines();
    loadAlerts();

    const socket = io("http://localhost:5000");

    socket.on("sensorUpdate", payload => {
      setMachines(prev =>
        prev.map(m =>
          String(m._id) === String(payload.machineId)
            ? {
                ...m,
                latestTemperature: payload.temperature,
                status: payload.status || m.status,
                efficiency:
                  payload.efficiency !== undefined
                    ? payload.efficiency
                    : m.efficiency
                ,
                vibration:
                  payload.vibration !== undefined
                    ? payload.vibration
                    : m.vibration
                ,
                load:
                  payload.load !== undefined
                    ? payload.load
                    : m.load
                ,
                pressure:
                  payload.pressure !== undefined
                    ? payload.pressure
                    : m.pressure
              }
            : m
        )
      );
    });

    socket.on("machineControl", payload => {
      setMachines(prev =>
        prev.map(m =>
          String(m._id) === String(payload.machineId)
            ? { ...m, ...payload }
            : m
        )
      );
    });

    socket.on("alert", alert => {
      setAlerts(prev => [alert, ...prev].slice(0, 5));
    });

    const interval = setInterval(loadMachines, 15000);

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  const dismissAlert = id => {
    setAlerts(prev => prev.filter(a => a._id !== id));
  };

  const activeCount = machines.filter(m => m.status === "Active").length;
  const idleCount = machines.filter(m => m.status === "Idle").length;
  const errorCount = machines.filter(m => m.status === "Error").length;
  const avgDaysSinceMaintenance = (() => {
    const withMaint = machines.filter(m => m.lastMaintenance);
    if (withMaint.length === 0) return 0;
    const now = Date.now();
    const totalDays = withMaint.reduce((sum, m) => {
      const d = new Date(m.lastMaintenance).getTime();
      return sum + Math.max(0, Math.round((now - d) / (1000 * 60 * 60 * 24)));
    }, 0);
    return Math.round(totalDays / withMaint.length);
  })();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Live Factory Dashboard</h2>
          <p className="page-subtitle">
            {lastUpdated
              ? "Last updated at " +
                new Date(lastUpdated).toLocaleTimeString()
              : "Streaming live data from plant simulator"}
          </p>
        </div>
        <div className="alerts-container">
          {alerts.map(alert => (
            <AlertToast
              key={alert._id}
              alert={alert}
              onClose={dismissAlert}
            />
          ))}
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
      <div className="dashboard-summary">
        <div className="summary-tile">
          <div className="summary-label">Active machines</div>
          <div className="summary-value">{activeCount}</div>
        </div>
        <div className="summary-tile">
          <div className="summary-label">Idle machines</div>
          <div className="summary-value">{idleCount}</div>
        </div>
        <div className="summary-tile">
          <div className="summary-label">In alarm</div>
          <div className="summary-value">{errorCount}</div>
        </div>
        <div className="summary-tile">
          <div className="summary-label">Open alerts</div>
          <div className="summary-value">{alerts.length}</div>
        </div>
        <div className="summary-tile">
          <div className="summary-label">Avg days since maintenance</div>
          <div className="summary-value">{avgDaysSinceMaintenance}</div>
        </div>
      </div>
      <div className="grid">
        {machines.map(m => (
          <MachineCard key={m._id} machine={m} />
        ))}
      </div>
    </div>
  );
}
