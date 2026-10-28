import { useEffect, useState } from 'react';
import { findCities, getWeather } from './api/weatherApi';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatusMessage from './components/StatusMessage';
import ErrorMessage from './components/ErrorMessage';
import LocationPicker from './components/LocationPicker';
import WeatherCard from './components/WeatherCard';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';

const DEFAULT_CITY = { id: 276781, name: 'Beirut', latitude: 33.8933, longitude: 35.5016, country: 'LB', region: 'Beyrouth' };

export default function App() {
  const [request, setRequest] = useState({ city: DEFAULT_CITY, sequence: 0 });
  const [weather, setWeather] = useState(null);
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Loading current weather for Beirut…');
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('celsius');

  useEffect(() => {
    if (!request.city) return undefined;
    const controller = new AbortController();
    setStatus('loading');
    setMessage(`Getting current weather for ${request.city.name}…`);
    setError('');

    getWeather(request.city, controller.signal)
      .then((data) => {
        setWeather(data);
        setStatus('success');
        setMessage(`Weather loaded for ${request.city.name}. All times are local.`);
      })
      .catch((caughtError) => {
        if (caughtError.name !== 'AbortError') {
          setWeather(null);
          setStatus('error');
          setMessage('Weather unavailable.');
          setError(caughtError.message);
        }
      });
    return () => controller.abort();
  }, [request]);

  async function search(query) {
    setStatus('loading');
    setMessage(`Finding ${query}…`);
    setError('');
    setCities([]);
    setWeather(null);
    try {
      const matches = await findCities(query);
      if (matches.length === 1) setRequest({ city: matches[0], sequence: Date.now() });
      else {
        setCities(matches);
        setStatus('idle');
        setMessage('Several places match. Choose your city below.');
      }
    } catch (caughtError) {
      setStatus('error');
      setMessage('Location unavailable.');
      setError(caughtError.message);
    }
  }

  function selectCity(city) {
    setCities([]);
    setRequest({ city, sequence: Date.now() });
  }

  function retry() {
    setRequest((current) => ({ ...current, sequence: current.sequence + 1 }));
  }

  const isLoading = status === 'loading';
  return (
    <>
      <a className="skip-link" href="#main">Skip to weather search</a>
      <Header />
      <main id="main" className="shell">
        <SearchBar onSearch={search} isLoading={isLoading} />
        <StatusMessage status={status} message={message} />
        {error && <ErrorMessage message={error} onRetry={retry} />}
        {cities.length > 0 && <LocationPicker cities={cities} onSelect={selectCity} />}
        {weather && <WeatherCard city={request.city} weather={weather} unit={unit} onUnitChange={setUnit} onRefresh={retry} isLoading={isLoading} />}
        {!weather && !error && cities.length === 0 && status !== 'loading' && <EmptyState />}
      </main>
      <Footer />
    </>
  );
}
