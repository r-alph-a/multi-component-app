import { useState } from 'react';

const examples = ['Beirut', 'London', 'Tokyo'];

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');

  function submit(event) {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2 || cleanQuery.length > 100) {
      setValidationError('Enter a city name with at least two letters.');
      return;
    }
    setValidationError('');
    onSearch(cleanQuery);
  }

  function searchExample(city) {
    setQuery(city);
    setValidationError('');
    onSearch(city);
  }

  return (
    <section className="search-section" aria-labelledby="search-heading">
      <div className="intro">
        <div><p className="eyebrow">WEATHER, WITHOUT THE NOISE</p><h1 id="search-heading">How does it feel <span>outside?</span></h1></div>
        <p className="intro-note">Search any city for current conditions.<br />No account or API key required.</p>
      </div>
      <form className="search-form" onSubmit={submit} noValidate>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="city">City name</label>
        <input id="city" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a city, e.g. Beirut, LB" disabled={isLoading} aria-invalid={Boolean(validationError)} aria-describedby={validationError ? 'validation-error' : undefined} />
        <button className="primary-button" disabled={isLoading}>{isLoading ? 'Finding weather…' : 'Find weather →'}</button>
      </form>
      <div className="search-meta">
        <p id="validation-error" className="validation" role="alert">{validationError}</p>
        <div className="quick-search"><span>Try:</span>{examples.map((city) => <button type="button" key={city} onClick={() => searchExample(city)} disabled={isLoading}>{city}</button>)}</div>
      </div>
    </section>
  );
}
