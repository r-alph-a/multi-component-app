import { localTime } from '../utils/weather';

export default function DetailsGrid({ current, daily }) {
  const details = [
    ['☀', 'Sunrise', localTime(daily?.sunrise?.[0])],
    ['☾', 'Sunset', localTime(daily?.sunset?.[0])],
    ['☁', 'Cloud cover', Number.isFinite(current.cloud_cover) ? `${Math.round(current.cloud_cover)}%` : 'Not available'],
    ['◷', 'Observed', localTime(current.time)],
  ];
  return <div className="details-grid">{details.map(([icon, label, value]) => <article key={label}><span aria-hidden="true">{icon}</span><div><h3>{label}</h3><p>{value}</p></div></article>)}</div>;
}
