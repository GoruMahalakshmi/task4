export default function StatusBadge({ status }) {
  const color =
    status === "Active" ? "green" :
    status === "Idle" ? "orange" : "red";

  return (
    <span style={{ color }}>
      ● {status}
    </span>
  );
}
