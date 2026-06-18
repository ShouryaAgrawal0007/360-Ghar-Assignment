import React, { useState } from 'react';
import { MapPin, Play, GitCompare, Sparkles, Calendar } from 'lucide-react';

const REASON_EMOJIS = {
  "gym": "💪",
  "school": "🏫",
  "schools": "🏫",
  "metro": "🚇",
  "sunlight": "🌞",
  "light": "🌞",
  "park": "🌳",
  "pool": "🏊",
  "security": "👮",
  "budget": "💰",
  "bhk": "🛏️",
  "area": "📍",
  "facing": "🧭"
};

const getEmojiForReason = (reason) => {
  const lowerReason = reason.toLowerCase();
  for (const [key, emoji] of Object.entries(REASON_EMOJIS)) {
    if (lowerReason.includes(key)) return emoji;
  }
  return "✨";
};

export default function PropertyCard({ property, onSelect, index = 0, compareList = [], toggleCompare, layoutMode = "grid" }) {
  const [showToast, setShowToast] = useState(false);
  const isLessRelevant = property.matchScore === 0 && compareList.length > 0;

  const isInCompare = compareList.some(p => p.id === property.id);
  const isDisabled = compareList.length >= 2 && !isInCompare;

  const handleBookTour = (e) => {
    e.stopPropagation();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div 
      className={`premium-card bg-white dark:bg-[#0e131f]/80 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-500 transform flex relative animate-fade-in ${
        isLessRelevant ? 'opacity-50 grayscale-[0.2]' : ''
      } ${layoutMode === 'list' ? 'flex-col md:flex-row h-auto md:h-56' : 'flex-col hover:-translate-y-1.5'}`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Toast Alert overlay */}
      {showToast && (
        <div className="absolute inset-x-4 top-[40%] -translate-y-1/2 bg-slate-900/95 dark:bg-[#0e131f]/95 border border-slate-800/80 text-white py-3.5 px-4 rounded-2xl text-center text-xs font-bold shadow-2xl z-30 animate-[modalScale_0.25s_ease-out] flex items-center justify-center gap-2">
          <span>📅 VR Tour Scheduled Successfully!</span>
        </div>
      )}

      {/* Image Section */}
      <div className={`relative bg-slate-105 dark:bg-slate-900 overflow-hidden shrink-0 ${
        layoutMode === 'list' ? 'w-full md:w-[32%] aspect-video md:aspect-auto md:h-full' : 'aspect-video'
      }`}>
        <img 
          src={property.image} 
          alt={property.title} 
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop" }}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent pointer-events-none" />

        {/* Compare Button */}
        {toggleCompare && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleCompare(property); }}
            disabled={isDisabled}
            className={`absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 
              rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm
              ${isInCompare 
                ? "bg-gradient-to-r from-teal-650 to-indigo-600 text-white shadow-md shadow-teal-500/20 scale-105" 
                : isDisabled 
                  ? "bg-slate-200/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-300/20 dark:border-slate-800/40"
                  : "bg-white/85 dark:bg-slate-900/85 backdrop-blur-md text-slate-700 dark:text-slate-350 hover:bg-teal-600 hover:text-white dark:hover:text-white border border-slate-200/40 dark:border-slate-800/40"
              }`}
          >
            <GitCompare size={13} /> {isInCompare ? "Added" : "Compare"}
          </button>
        )}
        
        {/* 360 Tour Pill */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Play className="w-3 h-3 fill-white text-white animate-pulse" />
          <span>360° VR Tour</span>
        </div>

        {/* Match Score Badge */}
        {property.matchScore > 0 ? (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md shadow-emerald-500/10 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>{property.matchScore}% Match</span>
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider uppercase border border-white/10">
            VR Ready
          </div>
        )}
      </div>

      {/* Body Section */}
      <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between min-w-0 ${
        layoutMode === 'list' ? 'md:flex-row gap-4' : ''
      }`}>
        <div className={`flex-1 flex flex-col justify-center min-w-0 ${
          layoutMode === 'list' ? 'md:max-w-[70%]' : ''
        }`}>
          {/* Title and Price Row */}
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 
              onClick={() => onSelect && onSelect(property)}
              className="font-heading font-black text-base sm:text-lg leading-snug line-clamp-1 text-slate-800 dark:text-slate-100 hover:text-teal-655 dark:hover:text-teal-400 cursor-pointer transition-colors flex-1"
            >
              {property.title}
            </h3>
            {layoutMode !== 'list' && (
              <span className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white whitespace-nowrap">{property.priceLabel}</span>
            )}
          </div>
          
          {/* Location & BHK Row */}
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4 font-semibold gap-3">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span className="line-clamp-1 font-semibold">{property.sector}, Gurgaon</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-500/5 dark:bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/10">{property.bhk} BHK</span>
            {layoutMode === 'list' && (
              <span className="text-[10px] text-slate-400 font-bold">• {property.area} sq.ft</span>
            )}
          </div>

          {/* Match Reasons Horizontal Drawer */}
          {property.matchReasons && property.matchReasons.length > 0 && !isLessRelevant ? (
            <div className="flex overflow-x-auto gap-1.5 pb-2.5 mb-2 scrollbar-hide -mx-1 px-1">
              {property.matchReasons.map((reason, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 bg-teal-500/5 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap border border-teal-500/10 dark:border-teal-500/10"
                >
                  <span className="mr-0.5">{getEmojiForReason(reason)}</span>
                  {reason}
                </div>
              ))}
            </div>
          ) : (
            /* Fallback Tags highlights */
            property.tags && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {property.tags.slice(0, 3).map((tag, i) => (
                  <div 
                    key={i} 
                    className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800/40"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Action Buttons & Price Footer */}
        <div className={`flex ${
          layoutMode === 'list' 
            ? 'flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3.5 md:min-w-[160px]' 
            : 'gap-3 mt-4'
        }`}>
          {layoutMode === 'list' && (
            <div className="text-right">
              <span className="text-xl font-heading font-black text-slate-900 dark:text-white whitespace-nowrap block">{property.priceLabel}</span>
              <span className="text-[10px] text-slate-400 font-semibold block">Verified Valuation</span>
            </div>
          )}

          <div className="flex gap-2 w-full">
            <button 
              onClick={() => onSelect && onSelect(property)}
              className="flex-1 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800 font-bold py-2.5 rounded-xl text-xs transition-all duration-250 cursor-pointer shadow-sm active:scale-97"
            >
              Details
            </button>
            
            <button 
              onClick={handleBookTour}
              className="flex-1 bg-gradient-to-r from-teal-650 to-indigo-650 hover:from-teal-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all duration-250 cursor-pointer shadow-md shadow-teal-500/10 active:scale-97 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
