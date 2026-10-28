import MetricCard from './MetricCard';
import DetailsGrid from './DetailsGrid';
import { CONDITIONS, convertTemperature, iconFor, localTime, temperatureSymbol, windDirection } from '../utils/weather';

export default function WeatherCard({ city, weather, unit, onUnitChange, onRefresh, isLoading }) {
  const current = weather.current;
  const symbol = temperatureSymbol(unit);
  const imperial = unit === 'fahrenheit';
  const condition = CONDITIONS[current.weather_code] ?? 'Conditions unavailable';
  const visibility = Number.isFinite(current.visibility) ? (current.visibility / (imperial ? 1609.344 : 1000)).toFixed(1) : '—';

  return (
    <section className="weather-results" aria-labelledby="results-title" aria-busy={isLoading}>
      <div className="results-heading">
        <h2 id="results-title">Current conditions</h2>
        <div className="results-actions">
          <span>As of {localTime(current.time)} local</span>
          <div className="unit-toggle" aria-label="Temperature unit">
            <button type="button" aria-pressed={!imperial} onClick={() => onUnitChange('celsius')}>°C</button>
            <button type="button" aria-pressed={imperial} onClick={() => onUnitChange('fahrenheit')}>°F</button>
          </div>
          <button className="refresh-button" type="button" onClick={onRefresh} disabled={isLoading} aria-label="Refresh weather">↻</button>
        </div>
      </div>
      <div className="dashboard-grid">
        <article className="current-card">
          <div className="current-top"><span><i /> LIVE CONDITIONS</span><b>{city.country ?? 'WORLD'}</b></div>
          <h3>{city.name}</h3><p className="local-date">{current.time.split('T')[0]}</p>
          <div className="current-main"><div><p className="temperature">{convertTemperature(current.temperature_2m, unit)}<small>{symbol}</small></p><p className="description">{condition}</p></div><img src={`/assets/${iconFor(current.weather_code, current.is_day)}.svg`} alt={condition} /></div>
          <div className="current-bottom"><p>Feels like <strong>{convertTemperature(current.apparent_temperature, unit)}{symbol}</strong></p><p>{Math.abs(city.latitude).toFixed(2)}° {city.latitude < 0 ? 'S' : 'N'} · {Math.abs(city.longitude).toFixed(2)}° {city.longitude < 0 ? 'W' : 'E'}</p></div>
        </article>
        <div className="metrics">
          <MetricCard title="Humidity" icon="⌁" value={Math.round(current.relative_humidity_2m)} unit="%" note="Relative humidity" progress={current.relative_humidity_2m} />
          <MetricCard title="Wind" icon="≋" value={(current.wind_speed_10m * (imperial ? 0.621371 : 1)).toFixed(1)} unit={imperial ? 'mph' : 'km/h'} note={windDirection(current.wind_direction_10m, current.wind_speed_10m)} />
          <MetricCard title="Visibility" icon="◉" value={visibility} unit={imperial ? 'mi' : 'km'} note="Horizontal visibility" />
          <MetricCard title="Pressure" icon="⌁" value={Number.isFinite(current.pressure_msl) ? Math.round(current.pressure_msl) : '—'} unit="hPa" note="Mean sea level" />
        </div>
      </div>
      <div className="details-heading"><h2>Today at a glance</h2><span>Times are local to {city.name}</span></div>
      <DetailsGrid current={current} daily={weather.daily} />
    </section>
  );
}
