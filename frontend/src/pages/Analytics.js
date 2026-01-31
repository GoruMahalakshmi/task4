import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import api from "../api/api";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [temperature, setTemperature] = useState([]);
  const [vibration, setVibration] = useState([]);
  const [conveyorLoad, setConveyorLoad] = useState([]);
  const [production, setProduction] = useState([]);
  const [robotMovement, setRobotMovement] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [t, v, c, p, r] = await Promise.all([
          api.get("/analytics/temperature"),
          api.get("/analytics/vibration"),
          api.get("/analytics/conveyor-load"),
          api.get("/analytics/production"),
          api.get("/analytics/robot-movement")
        ]);
        setTemperature(t.data);
        setVibration(v.data);
        setConveyorLoad(c.data);
        setProduction(p.data);
        setRobotMovement(r.data);
        setError("");
      } catch (err) {
        setError("Failed to load analytics. Backend may be offline.");
      }
    };
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  const temperatureData = {
    labels: temperature.map(r =>
      new Date(r.createdAt).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Temperature °C",
        data: temperature.map(r => r.temperature),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.3
      }
    ]
  };

  const vibrationData = {
    labels: vibration.map(r =>
      new Date(r.createdAt).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Vibration",
        data: vibration.map(r => r.vibration),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.3)",
        tension: 0.3
      }
    ]
  };

  const conveyorData = {
    labels: conveyorLoad.map(r =>
      new Date(r.createdAt).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Conveyor load %",
        data: conveyorLoad.map(r => r.load),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.3)",
        tension: 0.3
      }
    ]
  };

  const productionData = {
    labels: production.map(p => p.machineName),
    datasets: [
      {
        label: "Units per hour",
        data: production.map(p => p.unitsPerHour),
        backgroundColor: "rgba(234, 179, 8, 0.9)"
      }
    ]
  };

  const rmLabels = robotMovement.map(r =>
    new Date(r.createdAt).toLocaleTimeString()
  );
  const robotMovementData = {
    labels: rmLabels,
    datasets: [
      {
        label: "J1",
        data: robotMovement.map(r => r.j1),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.25)",
        tension: 0.3
      },
      {
        label: "J2",
        data: robotMovement.map(r => r.j2),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.25)",
        tension: 0.3
      },
      {
        label: "J3",
        data: robotMovement.map(r => r.j3),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.25)",
        tension: 0.3
      }
    ]
  };
  const robotMovementData2 = {
    labels: rmLabels,
    datasets: [
      {
        label: "J4",
        data: robotMovement.map(r => r.j4),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.25)",
        tension: 0.3
      },
      {
        label: "J5",
        data: robotMovement.map(r => r.j5),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.25)",
        tension: 0.3
      },
      {
        label: "J6",
        data: robotMovement.map(r => r.j6),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.25)",
        tension: 0.3
      }
    ]
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Analytics and Predictive Insights</h2>
          <p className="page-subtitle">
            Trends and performance KPIs from the last simulation window
          </p>
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
      <div className="analytics-grid">
        <div className="chart-card">
          <h4>Temperature trend</h4>
          <Line data={temperatureData} />
        </div>
        <div className="chart-card">
          <h4>Vibration analysis</h4>
          <Line data={vibrationData} />
        </div>
        <div className="chart-card">
          <h4>Conveyor load</h4>
          <Line data={conveyorData} />
        </div>
        <div className="chart-card">
          <h4>Production rate per hour</h4>
          <Bar data={productionData} />
        </div>
        <div className="chart-card">
          <h4>Robot arm movement (J1–J3)</h4>
          <Line data={robotMovementData} />
        </div>
        <div className="chart-card">
          <h4>Robot arm movement (J4–J6)</h4>
          <Line data={robotMovementData2} />
        </div>
      </div>
    </div>
  );
}
