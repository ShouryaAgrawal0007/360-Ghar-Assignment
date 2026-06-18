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

export default function PropertyCard({ property, onSelect, index = 0, compareList = [], toggleCompare }) {
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
      className={`bg-white dark:bg-[#18110f]/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_15px_35px_rgba(15,23,42,0.06)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-850 transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col relative animate-fade-in ${
        isLessRelevant ? 'opacity-50 grayscale-[0.2]' : ''
      }`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Toast Alert overlay */}
      {showToast && (
        <div className="absolute inset-x-4 top-[40%] -translate-y-1/2 bg-slate-900/95 dark:bg-[#1b120f]/95 border border-slate-800 text-white py-3.5 px-4 rounded-2xl text-center text-xs font-bold shadow-2xl z-30 animate-[modalScale_0.25s_ease-out] flex items-center justify-center gap-2">
          <span>📅 VR Tour Scheduled Successfully!</span>
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
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
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-105" 
                : isDisabled 
                  ? "bg-slate-200/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-400 dark:text-slate-650 cursor-not-allowed border border-slate-300/20 dark:border-slate-800/40"
                  : "bg-white/85 dark:bg-slate-900/85 backdrop-blur-md text-slate-700 dark:text-slate-350 hover:bg-orange-500 hover:text-white dark:hover:text-white border border-slate-200/40 dark:border-slate-800/40"
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
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Price Row */}
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 
              onClick={() => onSelect && onSelect(property)}
              className="font-bold text-base sm:text-lg leading-snug line-clamp-1 text-slate-850 dark:text-slate-100 hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition-colors flex-1"
            >
              {property.title}
            </h3>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white whitespace-nowrap">{property.priceLabel}</span>
          </div>
          
          {/* Location & BHK Row */}
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span className="line-clamp-1 font-semibold">{property.sector}, Gurgaon</span>
            </div>
            <span className="font-bold uppercase tracking-wider text-orange-500 bg-orange-500/5 dark:bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/10">{property.bhk} BHK</span>
          </div>

          {/* Match Reasons Horizontal Drawer */}
          {property.matchReasons && property.matchReasons.length > 0 && !isLessRelevant ? (
            <div className="flex overflow-x-auto gap-1.5 pb-2.5 mb-4 scrollbar-hide -mx-1 px-1">
              {property.matchReasons.map((reason, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 bg-orange-50/70 dark:bg-orange-950/20 text-orange-700 dark:text-orange-350 text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap border border-orange-500/10 dark:border-orange-500/10"
                >
                  <span className="mr-0.5">{getEmojiForReason(reason)}</span>
                  {reason}
                </div>
              ))}
            </div>
          ) : (
            /* Fallback Tags highlights */
            property.tags && (
              <div className="flex flex-wrap gap-1.5 mb-4.5">
                {property.tags.slice(0, 2).map((tag, i) => (
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

        {/* Action Buttons Footer */}
        <div className="flex gap-3 mt-4">
          <button 
            onClick={() => onSelect && onSelect(property)}
            className="flex-1 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-250 cursor-pointer shadow-sm active:scale-97"
          >
            Show Details
          </button>
          
          <button 
            onClick={handleBookTour}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-250 cursor-pointer shadow-md shadow-orange-500/10 active:scale-97 flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Tour</span>
          </button>
        </div>
      </div>
    </div>
  );
}
