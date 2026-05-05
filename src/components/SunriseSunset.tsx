import type { WeatherData } from '../types/weather';
import { formatTime } from '../utils/weatherCodes';

interface Props {
  data: WeatherData;
}

export default function SunriseSunset({ data }: Props) {
  const sunrise = data.daily.sunrise[0];
  const sunset = data.daily.sunset[0];

  const sunriseTime = formatTime(sunrise);
  const sunsetTime = formatTime(sunset);

  // Calculate progress through the day
  const now = new Date();
  const riseDate = new Date(sunrise);
  const setDate = new Date(sunset);
  const totalMs = setDate.getTime() - riseDate.getTime();
  const elapsedMs = now.getTime() - riseDate.getTime();
  const progress = Math.max(0, Math.min(1, elapsedMs / totalMs));
  const isDay = now > riseDate && now < setDate;

  // Arc position
  const angle = progress * 180; // 0 = sunrise, 180 = sunset
  const rad = (angle * Math.PI) / 180;
  const cx = 50;
  const cy = 90;
  const r = 70;
  const sunX = cx + r * Math.cos(Math.PI - rad);
  const sunY = cy - r * Math.sin(Math.PI - rad);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🌅</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Sunrise & Sunset</h3>
      </div>

      {/* Arc visualization */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 100 50" className="w-full max-w-[240px] overflow-visible" style={{ height: '100px' }}>
          {/* Arc path */}
          <path
            d="M 5 90 A 65 65 0 0 1 95 90"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          {isDay && (
            <path
              d={`M 5 90 A 65 65 0 0 1 ${sunX.toFixed(1)} ${sunY.toFixed(1)}`}
              fill="none"
              stroke="rgba(251,191,36,0.7)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {/* Sun marker */}
          {isDay && (
            <>
              <circle cx={sunX} cy={sunY} r="5" fill="#fbbf24" opacity="0.9">
                <animate attributeName="r" values="4.5;5.5;4.5" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx={sunX} cy={sunY} r="8" fill="rgba(251,191,36,0.3)"/>
            </>
          )}
          {/* Horizon line */}
          <line x1="2" y1="91" x2="98" y2="91" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          {/* Sunrise dot */}
          <circle cx="5" cy="90" r="3" fill="#fb923c"/>
          {/* Sunset dot */}
          <circle cx="95" cy="90" r="3" fill="#6366f1"/>
        </svg>

        <div className="flex w-full justify-between mt-2 px-2">
          <div className="text-center">
            <p className="text-xs text-white/50 mb-0.5">Sunrise</p>
            <p className="text-sm font-bold text-orange-300">🌅 {sunriseTime}</p>
          </div>
          {isDay && (
            <div className="text-center">
              <p className="text-xs text-white/50 mb-0.5">Progress</p>
              <p className="text-sm font-bold text-yellow-300">{Math.round(progress * 100)}%</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-white/50 mb-0.5">Sunset</p>
            <p className="text-sm font-bold text-indigo-300">🌇 {sunsetTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
