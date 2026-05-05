const POPULAR_CITIES = [
  { name: 'New York', country: 'US', latitude: 40.7128, longitude: -74.006, country_code: 'US' },
  { name: 'London', country: 'GB', latitude: 51.5074, longitude: -0.1278, country_code: 'GB' },
  { name: 'Tokyo', country: 'JP', latitude: 35.6762, longitude: 139.6503, country_code: 'JP' },
  { name: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522, country_code: 'FR' },
  { name: 'Sydney', country: 'AU', latitude: -33.8688, longitude: 151.2093, country_code: 'AU' },
  { name: 'Dubai', country: 'AE', latitude: 25.2048, longitude: 55.2708, country_code: 'AE' },
  { name: 'Mumbai', country: 'IN', latitude: 19.0760, longitude: 72.8777, country_code: 'IN' },
  { name: 'Toronto', country: 'CA', latitude: 43.6532, longitude: -79.3832, country_code: 'CA' },
];

interface Props {
  onSelect: (loc: { name: string; country: string; latitude: number; longitude: number; country_code: string }) => void;
}

export default function WelcomeScreen({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 py-10 px-4">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="flex justify-center gap-2 text-5xl mb-2 animate-[bounce_2s_ease-in-out_infinite]">
          🌤️
        </div>
        <h2 className="text-3xl font-bold text-white">Discover the Weather</h2>
        <p className="text-white/70 text-base max-w-md leading-relaxed">
          Search for any city worldwide to get real-time weather data, hourly forecasts, and a 7-day outlook.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {[
          { icon: '🌡️', title: 'Live Temperature', desc: 'Accurate current conditions' },
          { icon: '📅', title: '7-Day Forecast', desc: 'Plan your week ahead' },
          { icon: '⚡', title: 'Hourly Updates', desc: 'Hour-by-hour breakdown' },
        ].map(f => (
          <div key={f.title} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">{f.icon}</div>
            <p className="text-white text-sm font-semibold">{f.title}</p>
            <p className="text-white/50 text-xs mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Popular Cities */}
      <div className="w-full max-w-lg">
        <p className="text-white/60 text-sm font-medium mb-3 text-center uppercase tracking-wider">
          Popular Cities
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {POPULAR_CITIES.map(city => (
            <button
              key={city.name}
              onClick={() => onSelect(city)}
              className="bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 hover:border-white/40
                rounded-2xl px-3 py-3 text-white text-sm font-medium transition-all duration-200
                backdrop-blur-md flex flex-col items-center gap-1"
            >
              <span className="text-xl">🌍</span>
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Attribution */}
      <p className="text-white/30 text-xs text-center mt-2">
        Powered by{' '}
        <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="underline hover:text-white/60">
          Open-Meteo
        </a>
        {' '}— Free weather API, no key required
      </p>
    </div>
  );
}
