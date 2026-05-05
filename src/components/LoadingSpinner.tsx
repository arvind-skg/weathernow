export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      {/* Animated weather orb */}
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white/80 animate-spin" />
        {/* Middle ring */}
        <div className="absolute inset-3 rounded-full border-4 border-white/10 border-b-white/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        {/* Inner glow */}
        <div className="absolute inset-6 rounded-full bg-white/20 animate-pulse flex items-center justify-center">
          <span className="text-2xl">🌍</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-white text-xl font-semibold">Fetching Weather Data</p>
        <p className="text-white/60 text-sm">Getting real-time conditions for your location…</p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
