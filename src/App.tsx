import { useState, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import SunriseSunset from './components/SunriseSunset';
import ThemeToggle from './components/ThemeToggle';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WelcomeScreen from './components/WelcomeScreen';
import { fetchWeather } from './services/weatherApi';
import type { GeoLocation, WeatherData } from './types/weather';
import { getWeatherInfo } from './utils/weatherCodes';

function WeatherApp() {
  const { isDark } = useTheme();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLocation, setLastLocation] = useState<GeoLocation | null>(null);

  const loadWeather = useCallback(async (loc: GeoLocation) => {
    setLoading(true);
    setError(null);
    setLastLocation(loc);
    try {
      const data = await fetchWeather(loc);
      setWeather(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to fetch weather data. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastLocation) loadWeather(lastLocation);
  }, [lastLocation, loadWeather]);

  // Dynamic background based on weather
  let bgGradient = isDark
    ? 'from-indigo-950 via-blue-950 to-slate-900'
    : 'from-sky-400 via-blue-400 to-indigo-500';

  if (weather && !loading) {
    const info = getWeatherInfo(weather.current.weather_code, weather.current.is_day === 1);
    bgGradient = isDark ? info.bgDark : info.bgLight;
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br transition-all duration-700 ${bgGradient}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Subtle animated orbs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse
          ${isDark ? 'bg-blue-500' : 'bg-white'}`} />
        <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse
          ${isDark ? 'bg-indigo-500' : 'bg-yellow-200'}`}
          style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl animate-pulse
          ${isDark ? 'bg-purple-500' : 'bg-blue-100'}`}
          style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 min-h-screen flex flex-col gap-5">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-lg">
              <span className="text-xl">🌦️</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-none">WeatherNow</h1>
              <p className="text-white/50 text-xs mt-0.5">Real-time global weather</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Search */}
        <SearchBar onSelect={loadWeather} loading={loading} />

        {/* Content */}
        <main className="flex-1">
          {loading && <LoadingSpinner />}

          {!loading && error && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}

          {!loading && !error && !weather && (
            <WelcomeScreen onSelect={loc => loadWeather(loc as GeoLocation)} />
          )}

          {!loading && !error && weather && (
            <div className="flex flex-col gap-4 pb-8 animate-[fadeIn_0.4s_ease-in-out]">
              {/* Current Weather */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
                <CurrentWeatherCard data={weather} />
              </div>

              {/* Hourly */}
              <HourlyForecast data={weather} />

              {/* Daily */}
              <DailyForecast data={weather} />

              {/* Sunrise / Sunset */}
              <SunriseSunset data={weather} />

              {/* Footer info */}
              <div className="text-center">
                <p className="text-white/30 text-xs">
                  Data provided by{' '}
                  <a
                    href="https://open-meteo.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-white/60 transition-colors"
                  >
                    Open-Meteo
                  </a>
                  {' '}· Updated every 15 minutes
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WeatherApp />
    </ThemeProvider>
  );
}
