export default function LocationPicker({ cities, onSelect }) {
  return (
    <section className="location-panel" aria-labelledby="location-title">
      <h2 id="location-title" tabIndex="-1">Which place did you mean?</h2>
      <p>Choose a matching location to load its current weather.</p>
      <div className="location-list">
        {cities.map((city) => (
          <button type="button" key={city.id} onClick={() => onSelect(city)}>
            <strong>{[city.name, city.region, city.country].filter(Boolean).join(', ')}</strong>
            <span>{city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°</span>
          </button>
        ))}
      </div>
    </section>
  );
}
