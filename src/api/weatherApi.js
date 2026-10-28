const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

async function getJson(endpoint, parameters, signal) {
  let response;
  try {
    response = await fetch(`${endpoint}?${new URLSearchParams(parameters)}`, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not connect to the weather service. Check your connection and try again.');
  }

  if (!response.ok) {
    if (response.status === 429) throw new Error('The request limit was reached. Please wait a moment and retry.');
    if (response.status >= 500) throw new Error('Open-Meteo is temporarily unavailable. Please try again soon.');
    throw new Error(`The weather request failed (HTTP ${response.status}).`);
  }

  try {
    const data = await response.json();
    if (data?.error) throw new Error('The weather service could not process this request.');
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('The weather service returned an unreadable response.');
    throw error;
  }
}

export async function findCities(query, signal) {
  const parts = query.split(',').map((part) => part.trim());
  const parameters = { name: parts[0], count: '5', language: 'en', format: 'json' };
  if (parts.length === 2 && parts[1].length === 2) parameters.countryCode = parts[1].toUpperCase();

  const data = await getJson(GEO_URL, parameters, signal);
  const cities = (data.results ?? [])
    .filter((city) => typeof city.name === 'string' && Number.isFinite(city.latitude) && Number.isFinite(city.longitude))
    .map((city) => ({
      id: city.id ?? `${city.latitude}-${city.longitude}`,
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country_code,
      region: city.admin1,
    }));

  if (!cities.length) throw new Error('City not found. Check the spelling or add a country code, such as Paris, FR.');
  return cities;
}

export async function getWeather(city, signal) {
  const data = await getJson(WEATHER_URL, {
    latitude: city.latitude,
    longitude: city.longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility',
    daily: 'sunrise,sunset',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: '1',
  }, signal);

  const current = data?.current;
  if (!Number.isFinite(current?.temperature_2m) || !Number.isFinite(current?.apparent_temperature)
      || !Number.isFinite(current?.relative_humidity_2m) || !Number.isFinite(current?.wind_speed_10m)
      || typeof current?.time !== 'string' || !Number.isFinite(current?.weather_code)) {
    throw new Error('The weather response is missing important data. Please try again.');
  }
  return data;
}
