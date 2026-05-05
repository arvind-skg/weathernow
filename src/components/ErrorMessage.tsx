interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 px-6 text-center">
      {/* Animated error icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center animate-pulse">
          <span className="text-4xl">⚠️</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-white text-xl font-bold">Something Went Wrong</h3>
        <p className="text-white/70 text-sm max-w-sm leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-6 py-3 rounded-2xl bg-white/20 border border-white/30 text-white font-semibold text-sm
            hover:bg-white/30 active:scale-95 transition-all duration-200 backdrop-blur-md shadow-lg
            flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}
