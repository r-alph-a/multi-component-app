# Daylight — React Weather Dashboard

Assignment 5 rebuilds the previous Daylight weather dashboard as a responsive, multi-component React application. It uses Open-Meteo for live geocoding and current weather data; no API key is required.

## Install and run

Prerequisites: a current version of [Node.js](https://nodejs.org/) (Node 18 or newer) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). An internet connection is required for live weather requests.

To verify the production build:

```bash
npm run build
npm run preview
```

## Features

- Loads Beirut weather on startup so the application is immediately demonstrable.
- Searches by city, optionally with a two-letter country code such as `Beirut, LB`.
- Lets the user choose between matching locations.
- Displays temperature, conditions, humidity, wind, visibility, pressure, sunrise, sunset, cloud cover, and observation time.
- Switches between metric and imperial units without making another request.
- Provides explicit loading, error, retry, refresh, and success states.
- Uses responsive layouts and accessible labels, focus styles, live status announcements, and reduced-motion support.

## React architecture

`App` owns shared request, weather, status, location-match, and unit state. `SearchBar` owns only its input and validation state. Weather fetching is a side effect in `App`'s `useEffect`; its dependency array tracks the request object, and cleanup aborts stale requests. This prevents an older response from replacing a newer search.

Data flows down through props and user actions flow up through callback props. State is not drilled more than two component levels: `App` passes weather data to `WeatherCard`, which passes only the relevant values to `MetricCard` and `DetailsGrid`.

```text
App
├── Header
├── SearchBar
├── StatusMessage
├── ErrorMessage
├── LocationPicker
├── EmptyState
├── WeatherCard
│   ├── MetricCard
│   └── DetailsGrid
└── Footer
```

Every component lives in its own file under `src/components`. Components are functional and use React hooks; there are no class components.

## Project structure

```text
src/
├── api/weatherApi.js       Fetching and response validation
├── components/             Focused React UI components
├── utils/weather.js        Weather labels, icons, and conversions
├── App.jsx                 Shared state and useEffect orchestration
├── main.jsx                React entry point
└── styles.css              Responsive presentation
public/assets/              Local weather illustrations
vite.config.js              Vite React plugin configuration
```

## Submission

Repository: https://github.com/r-alph-a/multi-component-app

The submitted ZIP excludes `node_modules` and build output. After extracting it, follow **Install and run** above.

## Data source

Weather and location data are provided by [Open-Meteo](https://open-meteo.com/). The local SVG weather illustrations are carried forward from the previous weather-dashboard assignment.
