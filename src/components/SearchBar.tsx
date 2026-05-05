import React, { useState, useRef, useEffect, useCallback } from 'react';
import { searchCities } from '../services/weatherApi';
import type { GeoLocation } from '../types/weather';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onSelect: (loc: GeoLocation) => void;
  loading: boolean;
}

export default function SearchBar({ onSelect, loading }: Props) {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSuggestions([]); setOpen(false); return; }
    setSearching(true);
    try {
      const results = await searchCities(q);
      setSuggestions(results);
      setOpen(results.length > 0);
      setActiveIdx(-1);
    } catch {
      setSuggestions([]);
      setOpen(false);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    setQuery(`${loc.name}, ${loc.country}`);
    setSuggestions([]);
    setOpen(false);
    onSelect(loc);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(suggestions[activeIdx]); }
    if (e.key === 'Escape') { setOpen(false); setActiveIdx(-1); }
  };

  const inputBase = isDark
    ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:bg-white/15'
    : 'bg-white/80 border-white/60 text-slate-800 placeholder-slate-400 focus:border-white focus:bg-white';

  const dropdownBase = isDark
    ? 'bg-slate-800/95 border-white/10'
    : 'bg-white/95 border-slate-200';

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {searching || loading ? (
            <svg className={`w-5 h-5 animate-spin ${isDark ? 'text-white/60' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Search for a city..."
          className={`w-full pl-12 pr-4 py-4 rounded-2xl border backdrop-blur-md text-base font-medium transition-all duration-200 outline-none shadow-lg ${inputBase}`}
          aria-label="Search city"
          aria-autocomplete="list"
          aria-expanded={open}
        />

        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); inputRef.current?.focus(); }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${isDark ? 'text-white/50 hover:text-white/80' : 'text-slate-400 hover:text-slate-600'}`}
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className={`absolute top-full mt-2 left-0 right-0 rounded-2xl border shadow-2xl backdrop-blur-xl z-50 overflow-hidden ${dropdownBase}`}>
          {suggestions.map((loc, i) => (
            <button
              key={`${loc.name}-${loc.latitude}-${loc.longitude}`}
              onClick={() => handleSelect(loc)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150
                ${i === activeIdx
                  ? isDark ? 'bg-white/15' : 'bg-blue-50'
                  : isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'}
                ${i !== suggestions.length - 1 ? isDark ? 'border-b border-white/5' : 'border-b border-slate-100' : ''}
              `}
            >
              <span className="text-xl flex-shrink-0">📍</span>
              <div className="min-w-0">
                <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {loc.name}
                  {loc.admin1 ? <span className={`ml-1 font-normal ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{loc.admin1}</span> : null}
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                  {loc.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
