import { useTheme } from '../context/ThemeContext';
import type { WeatherData } from '../types/weather';
import { getWeatherInfo, formatDayShort, formatDate } from '../utils/weatherCodes';

interface Props {
  data: WeatherData;
}

export default function DailyForecast({ data }: Props) {
  const { isDark } = useTheme();
  const { daily, current } = data;
  const isDay = current.is_day === 1;

  const textPrimary = 'text-white';
  const textSecondary = 'text-white/70';
  const textMuted = 'text-white/50';

  // Find global min/max for bar scaling
  const allMaxes = daily.temperature_2m_max;
  const allMins = daily.temperature_2m_min;
  const globalMax = Math.max(...allMaxes);
  const globalMin = Math.min(...allMins);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📅</span>
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${textSecondary}`}>7-Day Forecast</h3>
      </div>

      <div className="flex flex-col divide-y divide-white/10">
        {daily.time.map((date, i) => {
          const tMax = Math.round(daily.temperature_2m_max[i]);
          const tMin = Math.round(daily.temperature_2m_min[i]);
          const code = daily.weather_code[i];
          const precip = daily.precipitation_probability_max[i];
          const info = getWeatherInfo(code, isDay);
          const isToday = i === 0;

          // Temperature bar
          const barMin = ((tMin - globalMin) / (globalMax - globalMin)) * 100;
          const barMax = ((tMax - globalMin) / (globalMax - globalMin)) * 100;
          const barWidth = barMax - barMin;

          return (
            <div
              key={date}
              className={`flex items-center gap-3 py-3 ${isToday ? '' : ''}`}
            >
              {/* Day */}
              <div className="w-12 flex-shrink-0">
                <p className={`text-sm font-semibold ${isToday ? textPrimary : textSecondary}`}>
                  {isToday ? 'Today' : formatDayShort(date)}
                </p>
                <p className={`text-xs ${textMuted}`}>{formatDate(date)}</p>
              </div>

              {/* Emoji */}
              <span className="text-xl w-8 text-center flex-shrink-0 select-none">{info.emoji}</span>

              {/* Precip */}
              <div className="w-10 text-right flex-shrink-0">
                {precip > 0 ? (
                  <span className={`text-xs font-medium ${isDark ? 'text-blue-300' : 'text-blue-200'}`}>
                    💧{precip}%
                  </span>
                ) : <span />}
              </div>

              {/* Temp range bar */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className={`text-sm font-medium text-right w-8 flex-shrink-0 ${textMuted}`}>{tMin}°</span>
                <div className="flex-1 relative h-2 rounded-full bg-white/10">
                  <div
                    className="absolute h-2 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 opacity-80"
                    style={{ left: `${barMin}%`, width: `${Math.max(barWidth, 5)}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold w-8 flex-shrink-0 ${textPrimary}`}>{tMax}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
