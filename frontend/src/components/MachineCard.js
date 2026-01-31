import StatusBadge from "./StatusBadge";

export default function MachineCard({ machine }) {
  return (
    <div className="card">
      <div className="card-header">
        <h4>{machine.name}</h4>
        <StatusBadge status={machine.status} />
      </div>
      <div className="card-metrics">
        <p>Type: {machine.type}</p>
        <p>Temperature: {Math.round(machine.latestTemperature || 0)}°C</p>
        <p>Vibration: {Math.round(machine.vibration || 0)}</p>
        <p>Load: {Math.round(machine.load || 0)}%</p>
        <p>Pressure: {Math.round(machine.pressure || 0)}</p>
        <p>Efficiency: {Math.round(machine.efficiency || 0)}%</p>
        <p>Cycle time: {Math.round(machine.cycleTime || 0)} s</p>
        <p>Mode: {machine.operatingMode}</p>
        <p>Job: {machine.assignedJob || "None"}</p>
        <p>
          Last maintenance:{" "}
          {machine.lastMaintenance
            ? new Date(machine.lastMaintenance).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
}
