export default function MetricCard({ title, icon, value, unit, note, progress }) {
  return (
    <article className="metric-card">
      <div className="metric-title"><h3>{title}</h3><span aria-hidden="true">{icon}</span></div>
      <p className="metric-value">{value}<small>{unit}</small></p>
      <p className="metric-note">{note}</p>
      {Number.isFinite(progress) && <div className="humidity-track" aria-hidden="true"><span style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} /></div>}
    </article>
  );
}
