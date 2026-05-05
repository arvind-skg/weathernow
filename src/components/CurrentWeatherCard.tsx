import { useTheme } from '../context/ThemeContext';
import type { WeatherData } from '../types/weather';
import { getWeatherInfo, getWindDirection } from '../utils/weatherCodes';

interface Props {
  data: WeatherData;
}

export default function CurrentWeatherCard({ data }: Props) {
  const { isDark } = useTheme();
  const { current, location } = data;
  const isDay = current.is_day === 1;
  const info = getWeatherInfo(current.weather_code, isDay);

  const textPrimary = isDark ? 'text-white' : 'text-white';
  const textSecondary = isDark ? 'text-white/70' : 'text-white/80';
  const textMuted = isDark ? 'text-white/50' : 'text-white/60';
  const cardBg = 'bg-white/10 backdrop-blur-md border border-white/20';

  const stats = [
    { icon: '💧', label: 'Humidity', value: `${current.relative_humidity_2m}%` },
    { icon: '🌬️', label: 'Wind', value: `${Math.round(current.wind_speed_10m)} km/h ${getWindDirection(current.wind_direction_10m)}` },
    { icon: '🌡️', label: 'Feels Like', value: `${Math.round(current.apparent_temperature)}°` },
    { icon: '☁️', label: 'Cloud Cover', value: `${current.cloud_cover}%` },
    { icon: '👁️', label: 'Visibility', value: `${(current.visibility / 1000).toFixed(1)} km` },
    { icon: '📊', label: 'Pressure', value: `${Math.round(current.surface_pressure)} hPa` },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Main Info */}
      <div className="flex flex-col items-center text-center gap-2 pt-4">
        {/* Weather emoji */}
        <div className="text-8xl drop-shadow-lg select-none animate-[bounce_3s_ease-in-out_infinite]">
          {info.emoji}
        </div>

        {/* Temperature */}
        <div className={`text-8xl font-extrabold tracking-tight leading-none mt-2 ${textPrimary} drop-shadow-lg`}>
          {Math.round(current.temperature_2m)}°
          <span className="text-4xl font-normal align-super ml-1">C</span>
        </div>

        {/* Condition */}
        <p className={`text-2xl font-semibold mt-1 ${textPrimary}`}>{info.label}</p>

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-1">
          <svg className={`w-4 h-4 ${textSecondary}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <p className={`text-lg font-medium ${textSecondary}`}>
            {location.name}
            {location.admin1 ? `, ${location.admin1}` : ''}
          </p>
          <span className={`text-sm ${textMuted}`}>{location.country}</span>
        </div>

        {/* Day/Night indicator */}
        <div className={`flex items-center gap-1.5 text-sm ${textMuted} mt-0.5`}>
          <span>{isDay ? '☀️' : '🌙'}</span>
          <span>{isDay ? 'Daytime' : 'Nighttime'}</span>
          <span className="mx-1">·</span>
          <span>{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ icon, label, value }) => (
          <div key={label} className={`${cardBg} rounded-2xl p-4 flex flex-col gap-1`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className={`text-xs font-medium uppercase tracking-wide ${textMuted}`}>{label}</span>
            </div>
            <p className={`text-lg font-bold ${textPrimary}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
