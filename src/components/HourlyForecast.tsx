import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { WeatherData } from '../types/weather';
import { getWeatherInfo, formatHour, getCurrentHourIndex } from '../utils/weatherCodes';

interface Props {
  data: WeatherData;
}

export default function HourlyForecast({ data }: Props) {
  const { isDark } = useTheme();
  const { hourly, current } = data;
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDay = current.is_day === 1;

  const startIdx = getCurrentHourIndex(hourly.time);
  // Show next 24 hours
  const hours = hourly.time.slice(startIdx, startIdx + 24);

  const textPrimary = 'text-white';
  const textSecondary = 'text-white/70';
  const textMuted = 'text-white/50';

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🕐</span>
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${textSecondary}`}>Hourly Forecast</h3>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hours.map((time, i) => {
          const idx = startIdx + i;
          const temp = hourly.temperature_2m[idx];
          const code = hourly.weather_code[idx];
          const precip = hourly.precipitation_probability[idx];
          const info = getWeatherInfo(code, isDay);
          const isNow = i === 0;

          return (
            <div
              key={time}
              className={`flex flex-col items-center gap-2 flex-shrink-0 snap-start rounded-2xl p-3 min-w-[72px] transition-all
                ${isNow
                  ? 'bg-white/25 border border-white/40 shadow-lg'
                  : 'bg-white/5 border border-white/10 hover:bg-white/15'
                }
              `}
            >
              <span className={`text-xs font-semibold ${isNow ? textPrimary : textMuted}`}>
                {isNow ? 'Now' : formatHour(time)}
              </span>
              <span className="text-2xl select-none">{info.emoji}</span>
              <span className={`text-sm font-bold ${textPrimary}`}>{Math.round(temp)}°</span>
              {precip > 0 && (
                <span className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-200'}`}>
                  {precip}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
