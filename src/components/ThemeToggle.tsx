import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 font-medium text-sm
        ${isDark
          ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
        }
        backdrop-blur-md shadow-lg active:scale-95
      `}
    >
      <span className="text-lg transition-transform duration-300" style={{ transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}>
        {isDark ? '🌙' : '☀️'}
      </span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
