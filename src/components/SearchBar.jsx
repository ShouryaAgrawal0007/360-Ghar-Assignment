import React, { useState, useRef, useEffect } from 'react';
import { Mic, Search, X, Loader2, Sparkles } from 'lucide-react';

export default function SearchBar({ 
  query, 
  setQuery, 
  onSearch, 
  isParsing, 
  isListening, 
  setIsListening,
  parsedFilters,
  onRemoveFilter
}) {
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const isCompact = !!parsedFilters;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isParsing) {
        onSearch(query);
      }
    }
  };

  const toggleListening = () => {
    console.log("toggleListening called. Current isListening state:", isListening);

    // If already listening, stop it on click (toggle behavior)
    if (isListening) {
      console.log("Stopping active speech recognition...");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Failed to stop recognition:", err);
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    try {
      console.log("Initializing SpeechRecognition instance...");
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("Speech recognition service started listening.");
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Speech recognition result received:", transcript);
        setQuery(transcript);
        onSearch(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error event:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("Speech recognition service ended.");
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
      console.log("SpeechRecognition.start() called successfully.");
    } catch (err) {
      console.error("Failed to initialize or start SpeechRecognition:", err);
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const renderPills = () => {
    if (!parsedFilters) return null;
    
    const pills = [];

    if (parsedFilters.bhk) {
      pills.push({ id: 'bhk', type: 'bhk', label: `${parsedFilters.bhk} BHK` });
    }

    if (parsedFilters.minPrice !== null || parsedFilters.maxPrice !== null) {
      let label = "";
      if (parsedFilters.minPrice !== null && parsedFilters.maxPrice !== null) {
        label = `₹${parsedFilters.minPrice}L - ₹${parsedFilters.maxPrice}L`;
      } else if (parsedFilters.minPrice !== null) {
        label = `Min ₹${parsedFilters.minPrice}L`;
      } else {
        label = `Max ₹${parsedFilters.maxPrice}L`;
      }
      pills.push({ id: 'price', type: 'price', label });
    }

    if (parsedFilters.sectors && parsedFilters.sectors.length > 0) {
      parsedFilters.sectors.forEach((sec, idx) => {
        pills.push({ id: `sec-${idx}`, type: 'sector', value: sec, label: sec });
      });
    }

    if (parsedFilters.amenities && parsedFilters.amenities.length > 0) {
      parsedFilters.amenities.forEach((am, idx) => {
        pills.push({ id: `am-${idx}`, type: 'amenity', value: am, label: am.replace('_', ' ') });
      });
    }

    if (pills.length === 0) return null;

    return (
      <div className={`flex flex-wrap items-center ${isCompact ? 'gap-1.5 mt-3' : 'gap-2 mt-5'}`}>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-455 dark:text-slate-500 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-600" /> Active Filters:
        </span>
        {pills.map(pill => (
          <div 
            key={pill.id} 
            className={`inline-flex items-center gap-1.5 bg-teal-500/10 dark:bg-teal-500/15 text-teal-650 dark:text-teal-400 rounded-full font-bold border border-teal-500/20 dark:border-teal-500/30 shadow-sm transition-all duration-300 hover:scale-105 ${
              isCompact ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs sm:text-sm'
            }`}
          >
            <span className="capitalize">{pill.label}</span>
            <button 
              onClick={() => onRemoveFilter && onRemoveFilter(pill.type, pill.value)}
              className="hover:text-teal-850 dark:hover:text-teal-300 hover:bg-teal-500/10 dark:hover:bg-teal-500/20 p-0.5 rounded-full transition-colors focus:outline-none cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`w-full relative overflow-hidden transition-all duration-500 
        ${isCompact 
          ? 'bg-transparent border-0 p-0' 
          : 'bg-white/60 dark:bg-[#0e131f]/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-5 sm:p-7 shadow-2xl hover:shadow-[0_20px_50px_rgba(13,148,136,0.08)] dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)]'
        }`}
    >
      {/* Decorative gradient orbs for luxury ambient glow */}
      {!isCompact && (
        <>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}
      
      <div className={`relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center ${isCompact ? 'gap-2.5' : 'gap-3.5'}`}>
        <div 
          className={`relative flex-1 w-full bg-slate-50 dark:bg-[#0c0f19]/80 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 
            focus-within:border-teal-500/50 focus-within:ring-2 focus-within:ring-teal-500/10 dark:focus-within:ring-teal-500/20 
            transition-all duration-300 flex items-center shadow-inner overflow-hidden`}
        >
          {isCompact ? (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Search by description or area...'
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-4 h-[44px] text-[14px] font-medium outline-none"
              disabled={isParsing}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Describe your dream home... e.g. "2BHK in Sector 50 under 95 Lakhs, near metro"'
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-5 py-4 sm:py-5 resize-none outline-none min-h-[60px] max-h-[140px] overflow-y-auto leading-relaxed text-sm sm:text-base font-medium"
              rows={1}
              disabled={isParsing}
            />
          )}

          {/* Voice Search Button */}
          <button 
            onClick={toggleListening}
            disabled={isParsing}
            className={`mx-2.5 rounded-full transition-all duration-350 focus:outline-none flex-shrink-0 cursor-pointer
              ${isCompact ? 'p-2' : 'p-3'}
              ${isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110' 
                : 'text-slate-400 hover:text-teal-650 hover:bg-slate-150 dark:hover:bg-slate-850 hover:scale-105'
              }`}
            title="Search with Voice"
          >
            <Mic className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>
        </div>

        {/* Search Button */}
        <button
          onClick={() => query.trim() && !isParsing && onSearch(query)}
          disabled={!query.trim() || isParsing}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 active:scale-95 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-slate-900 dark:disabled:to-slate-900 disabled:text-slate-400 dark:disabled:text-slate-650 text-white rounded-2xl font-bold shadow-md shadow-teal-500/10 hover:shadow-teal-500/25 dark:hover:shadow-teal-500/35 transition-all duration-300 flex-shrink-0 cursor-pointer ${
            isCompact ? 'px-5 h-[44px] text-[14px]' : 'px-8 py-4 sm:py-5 text-base'
          }`}
        >
          {isParsing ? (
            <Loader2 className={`animate-spin ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          ) : (
            <>
              <Search className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span>Analyze & Search</span>
            </>
          )}
        </button>
      </div>

      {renderPills()}
    </div>
  );
}
