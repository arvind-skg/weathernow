export interface WeatherInfo {
  label: string;
  emoji: string;
  icon: string; // SVG path description or identifier
  bgLight: string;
  bgDark: string;
  textColor: string;
}

// WMO Weather interpretation codes
// https://open-meteo.com/en/docs#weathervariables
const WMO_MAP: Record<number, { label: string; dayEmoji: string; nightEmoji: string; bgLight: string; bgDark: string }> = {
  0:  { label: 'Clear Sky',           dayEmoji: '☀️',  nightEmoji: '🌙', bgLight: 'from-amber-300 via-orange-200 to-sky-300',   bgDark: 'from-indigo-950 via-blue-950 to-slate-900' },
  1:  { label: 'Mainly Clear',        dayEmoji: '🌤️', nightEmoji: '🌙', bgLight: 'from-amber-200 via-sky-200 to-blue-300',      bgDark: 'from-indigo-950 via-blue-950 to-slate-900' },
  2:  { label: 'Partly Cloudy',       dayEmoji: '⛅',  nightEmoji: '☁️', bgLight: 'from-sky-200 via-slate-200 to-blue-300',     bgDark: 'from-slate-900 via-blue-950 to-indigo-950' },
  3:  { label: 'Overcast',            dayEmoji: '☁️', nightEmoji: '☁️', bgLight: 'from-slate-300 via-gray-200 to-slate-400',   bgDark: 'from-slate-900 via-gray-900 to-zinc-900'   },
  45: { label: 'Foggy',               dayEmoji: '🌫️', nightEmoji: '🌫️', bgLight: 'from-gray-300 via-slate-200 to-gray-400',   bgDark: 'from-slate-800 via-gray-900 to-zinc-900'   },
  48: { label: 'Icy Fog',             dayEmoji: '🌫️', nightEmoji: '🌫️', bgLight: 'from-blue-200 via-slate-200 to-gray-300',   bgDark: 'from-slate-800 via-gray-900 to-zinc-900'   },
  51: { label: 'Light Drizzle',       dayEmoji: '🌦️', nightEmoji: '🌧️', bgLight: 'from-blue-300 via-slate-200 to-sky-300',    bgDark: 'from-slate-900 via-blue-950 to-indigo-900' },
  53: { label: 'Drizzle',             dayEmoji: '🌧️', nightEmoji: '🌧️', bgLight: 'from-blue-400 via-slate-300 to-sky-400',    bgDark: 'from-slate-900 via-blue-950 to-indigo-900' },
  55: { label: 'Heavy Drizzle',       dayEmoji: '🌧️', nightEmoji: '🌧️', bgLight: 'from-blue-500 via-slate-400 to-sky-500',    bgDark: 'from-slate-900 via-blue-900 to-indigo-900' },
  56: { label: 'Freezing Drizzle',    dayEmoji: '🌨️', nightEmoji: '🌨️', bgLight: 'from-blue-200 via-slate-300 to-cyan-300',   bgDark: 'from-slate-900 via-cyan-950 to-blue-950'   },
  57: { label: 'Heavy Freezing Drizzle', dayEmoji: '🌨️', nightEmoji: '🌨️', bgLight: 'from-blue-300 via-slate-400 to-cyan-400', bgDark: 'from-slate-900 via-cyan-950 to-blue-950' },
  61: { label: 'Light Rain',          dayEmoji: '🌦️', nightEmoji: '🌧️', bgLight: 'from-blue-300 via-sky-200 to-blue-400',     bgDark: 'from-blue-950 via-slate-900 to-indigo-950' },
  63: { label: 'Rain',                dayEmoji: '🌧️', nightEmoji: '🌧️', bgLight: 'from-blue-500 via-sky-300 to-blue-500',     bgDark: 'from-blue-950 via-slate-900 to-indigo-900' },
  65: { label: 'Heavy Rain',          dayEmoji: '⛈️', nightEmoji: '⛈️', bgLight: 'from-blue-700 via-sky-500 to-blue-600',     bgDark: 'from-blue-950 via-slate-900 to-gray-900'   },
  66: { label: 'Freezing Rain',       dayEmoji: '🌨️', nightEmoji: '🌨️', bgLight: 'from-cyan-300 via-blue-200 to-slate-300',   bgDark: 'from-cyan-950 via-blue-950 to-slate-900'   },
  67: { label: 'Heavy Freezing Rain', dayEmoji: '🌨️', nightEmoji: '🌨️', bgLight: 'from-cyan-400 via-blue-300 to-slate-400',   bgDark: 'from-cyan-950 via-blue-950 to-slate-900'   },
  71: { label: 'Light Snowfall',      dayEmoji: '🌨️', nightEmoji: '❄️', bgLight: 'from-blue-100 via-white to-slate-200',       bgDark: 'from-slate-800 via-blue-950 to-indigo-950' },
  73: { label: 'Snowfall',            dayEmoji: '❄️', nightEmoji: '❄️', bgLight: 'from-blue-100 via-white to-slate-200',       bgDark: 'from-slate-800 via-blue-950 to-indigo-950' },
  75: { label: 'Heavy Snowfall',      dayEmoji: '❄️', nightEmoji: '❄️', bgLight: 'from-blue-100 via-white to-gray-200',        bgDark: 'from-slate-700 via-blue-950 to-indigo-950' },
  77: { label: 'Snow Grains',         dayEmoji: '🌨️', nightEmoji: '🌨️', bgLight: 'from-blue-100 via-white to-slate-200',     bgDark: 'from-slate-800 via-blue-950 to-indigo-950' },
  80: { label: 'Light Showers',       dayEmoji: '🌦️', nightEmoji: '🌧️', bgLight: 'from-blue-300 via-sky-200 to-blue-300',    bgDark: 'from-blue-950 via-slate-900 to-indigo-950' },
  81: { label: 'Showers',             dayEmoji: '🌧️', nightEmoji: '🌧️', bgLight: 'from-blue-400 via-sky-300 to-blue-400',    bgDark: 'from-blue-950 via-slate-900 to-indigo-900' },
  82: { label: 'Heavy Showers',       dayEmoji: '⛈️', nightEmoji: '⛈️', bgLight: 'from-blue-600 via-sky-500 to-blue-600',    bgDark: 'from-blue-950 via-slate-900 to-gray-900'   },
  85: { label: 'Snow Showers',        dayEmoji: '🌨️', nightEmoji: '❄️', bgLight: 'from-blue-100 via-white to-slate-200',     bgDark: 'from-slate-800 via-blue-950 to-indigo-950' },
  86: { label: 'Heavy Snow Showers',  dayEmoji: '❄️', nightEmoji: '❄️', bgLight: 'from-blue-100 via-white to-gray-200',      bgDark: 'from-slate-700 via-blue-950 to-indigo-950' },
  95: { label: 'Thunderstorm',        dayEmoji: '⛈️', nightEmoji: '⛈️', bgLight: 'from-gray-600 via-slate-500 to-purple-700', bgDark: 'from-gray-950 via-slate-900 to-purple-950' },
  96: { label: 'Thunderstorm w/ Hail', dayEmoji: '⛈️', nightEmoji: '⛈️', bgLight: 'from-gray-700 via-slate-500 to-purple-800', bgDark: 'from-gray-950 via-slate-900 to-purple-950' },
  99: { label: 'Heavy Thunderstorm',  dayEmoji: '🌩️', nightEmoji: '🌩️', bgLight: 'from-gray-800 via-slate-600 to-purple-900', bgDark: 'from-gray-950 via-slate-900 to-purple-950' },
};

const DEFAULT = {
  label: 'Unknown',
  dayEmoji: '🌡️',
  nightEmoji: '🌡️',
  bgLight: 'from-sky-200 via-blue-100 to-indigo-200',
  bgDark: 'from-slate-900 via-blue-950 to-indigo-950',
};

export function getWeatherInfo(code: number, isDay: boolean = true) {
  const w = WMO_MAP[code] ?? DEFAULT;
  return {
    label: w.label,
    emoji: isDay ? w.dayEmoji : w.nightEmoji,
    bgLight: w.bgLight,
    bgDark: w.bgDark,
  };
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatHour(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

export function formatDayShort(isoString: string): string {
  const d = new Date(isoString + 'T12:00:00'); // avoid timezone edge issues
  return d.toLocaleDateString([], { weekday: 'short' });
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString + 'T12:00:00');
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function getCurrentHourIndex(times: string[]): number {
  const now = new Date();
  const nowH = now.getFullYear() * 10000 + now.getMonth() * 100 + now.getDate();
  const nowHour = now.getHours();
  
  for (let i = 0; i < times.length; i++) {
    const d = new Date(times[i]);
    const dH = d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
    if (dH === nowH && d.getHours() === nowHour) return i;
  }
  return 0;
}
