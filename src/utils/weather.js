export const CONDITIONS = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  56: 'Freezing drizzle', 57: 'Dense freezing drizzle', 61: 'Slight rain', 63: 'Moderate rain',
  65: 'Heavy rain', 66: 'Freezing rain', 67: 'Heavy freezing rain', 71: 'Slight snow',
  73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains', 80: 'Slight rain showers',
  81: 'Moderate rain showers', 82: 'Violent rain showers', 85: 'Slight snow showers',
  86: 'Heavy snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm with hail',
};

export function iconFor(code, isDay) {
  if ([95, 96, 99].includes(code)) return 'storm';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([45, 48].includes(code)) return 'mist';
  if (code === 0) return isDay ? 'sun' : 'moon';
  if ([1, 2].includes(code)) return isDay ? 'partly-cloudy' : 'partly-night';
  return 'clouds';
}

export const convertTemperature = (value, unit) => Math.round(unit === 'fahrenheit' ? (value * 9) / 5 + 32 : value);
export const temperatureSymbol = (unit) => (unit === 'fahrenheit' ? '°F' : '°C');
export const localTime = (timestamp) => timestamp?.split('T')[1] ?? 'Not available';

export function windDirection(degrees, speed) {
  if (speed === 0) return 'Calm';
  if (!Number.isFinite(degrees)) return 'Direction unavailable';
  const compass = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return `From ${compass[Math.round(degrees / 45) % 8]} · ${Math.round(degrees)}°`;
}
