import React from "react";

function getSeverityColor(severity) {
  if (severity === "Critical") return "#ef4444";
  if (severity === "High") return "#dc2626";
  if (severity === "Medium") return "#f97316";
  return "#eab308";
}

export default function AlertToast({ alert, onClose }) {
  const color = getSeverityColor(alert.severity);

  return (
    <div className="alert-toast" style={{ borderLeftColor: color }}>
      <div className="alert-toast-main">
        <div className="alert-toast-title">
          <span className="alert-dot" style={{ backgroundColor: color }} />
          <span>{alert.type}</span>
        </div>
        <span className="alert-badge" style={{ backgroundColor: color }}>
          {alert.severity}
        </span>
      </div>
      <div className="alert-toast-meta">
        <span>
          Machine: {String(alert.machineId).slice(-4)}
        </span>
        <span>
          {new Date(alert.createdAt || Date.now()).toLocaleTimeString()}
        </span>
      </div>
      {onClose && (
        <button
          className="alert-toast-close"
          onClick={() => onClose(alert._id)}
        >
          ×
        </button>
      )}
    </div>
  );
}
