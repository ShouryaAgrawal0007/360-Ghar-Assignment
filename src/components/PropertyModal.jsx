import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, MapPin, Building2, Ruler, Compass, Grid, Dumbbell, BookOpen, Train, Sun, TreePine, Waves, ShieldCheck, Share2, Heart, Copy, Flag, TrendingUp, Calendar } from 'lucide-react';
import { generatePropertySummary } from '../services/openrouter';

const AMENITY_ICONS = {
  gym: Dumbbell,
  school_nearby: BookOpen,
  metro: Train,
  sunlight: Sun,
  park: TreePine,
  pool: Waves,
  security: ShieldCheck
};

export default function PropertyModal({ 
  property, 
  onClose, 
  userQuery
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [liked, setLiked] = useState(false);
  
  const images = property.images || [property.image];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    if (!property || !userQuery) {
      setAiSummary("Search for properties using natural language to get a custom suitability breakdown.");
      setSummaryLoading(false);
      return;
    }

    setSummaryLoading(true);
    setAiSummary("");

    generatePropertySummary(property, userQuery)
      .then((summary) => {
        setAiSummary(summary);
      })
      .catch((err) => {
        console.error(err);
        setAiSummary("Could not load dynamic suitability analysis.");
      })
      .finally(() => {
        setSummaryLoading(false);
      });
  }, [property?.id, userQuery]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Link copied to clipboard!");
    setTimeout(() => setToastMessage(""), 2000);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const pricePerSqFt = property.area > 0 ? Math.round((property.price * 100000) / property.area) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-start justify-center md:items-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="bg-white dark:bg-[#120b09] w-full sm:w-[92vw] md:max-w-5xl sm:rounded-3xl rounded-t-3xl shadow-2xl relative z-10 sm:animate-[modalScale_0.35s_cubic-bezier(0.16,1,0.3,1)] animate-[fade-in_0.35s_cubic-bezier(0.16,1,0.3,1)] flex flex-col md:flex-row sm:max-h-[90vh] max-h-[95vh] overflow-y-auto md:my-8 mx-auto border border-slate-200/80 dark:border-slate-850">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/55 hover:bg-black/80 text-white rounded-full p-2.5 backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:scale-105 cursor-pointer shadow-md"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto sm:overflow-hidden">
          
          {/* LEFT COLUMN (60%) */}
          <div className="w-full md:w-[60%] flex flex-col sm:overflow-y-auto scrollbar-hide">
            {/* Image Carousel */}
            <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 group flex-shrink-0">
              <img 
                src={images[currentImageIndex]} 
                alt={`${property.title} view ${currentImageIndex + 1}`}
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop" }}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              <button 
                onClick={prevImage} 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-orange-500 w-5 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-white/60 w-1.5'} cursor-pointer`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6 sm:p-8 flex-shrink-0 space-y-6">
              <div>
                <h2 className="font-playfair font-black text-2xl sm:text-3xl text-slate-850 dark:text-slate-100 leading-tight">
                  {property.title}
                </h2>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-2.5 font-medium">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{property.sector}, Gurgaon</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-[#1b120f]/50 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-850">
                <div className="flex flex-col">
                  <span className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-orange-500" /> Layout</span>
                  <span className="font-extrabold text-slate-850 dark:text-white text-sm sm:text-base">{property.bhk} BHK</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 dark:border-slate-800 pl-4 sm:border-l-0 sm:pl-0">
                  <span className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5 text-orange-500" /> Size</span>
                  <span className="font-extrabold text-slate-850 dark:text-white text-sm sm:text-base">{property.area} <span className="text-[10px] font-semibold text-slate-550">sq ft</span></span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-4">
                  <span className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Grid className="w-3.5 h-3.5 text-orange-500" /> Floor</span>
                  <span className="font-extrabold text-slate-850 dark:text-white text-sm sm:text-base">{property.floor} <span className="text-[10px] font-semibold text-slate-555">/ {property.totalFloors}</span></span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 pl-4">
                  <span className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-orange-500" /> Facing</span>
                  <span className="font-extrabold text-slate-850 dark:text-white text-sm sm:text-base">{property.facing}</span>
                </div>
              </div>

              {/* Amenities Section */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm sm:text-base uppercase tracking-wider">Premium Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4">
                    {property.amenities.map((amenity, idx) => {
                      const Icon = AMENITY_ICONS[amenity] || Sparkles;
                      return (
                        <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <div className="bg-orange-500/10 dark:bg-orange-500/15 p-2 rounded-xl text-orange-500 dark:text-orange-400 shadow-sm border border-orange-500/10">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold capitalize">{amenity.replace('_', ' ')}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (40%) */}
          <div className="w-full md:w-[40%] bg-slate-50/70 dark:bg-[#1b120f]/30 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-850 p-6 sm:p-8 flex flex-col shrink-0 justify-between">
            <div className="space-y-6">
              {/* Price block */}
              <div>
                <div className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest mb-1.5">Value Assessment</div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{property.priceLabel}</span>
                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 dark:bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/20 shadow-sm">Verified Value</span>
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-450 mt-2">~ ₹{pricePerSqFt.toLocaleString('en-IN')} per sq.ft</div>
              </div>

              {/* AI Concierge Summary Block */}
              <div className="space-y-3.5">
                <h3 className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  <Sparkles className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
                  AI Suitability Advisory
                </h3>
                
                <div className="bg-white dark:bg-[#18110f]/90 border border-slate-200/50 dark:border-slate-850 border-l-4 border-l-orange-500 shadow-sm rounded-r-2xl p-5 relative overflow-hidden">
                  <div className="text-5xl text-orange-500/10 absolute top-1 left-2 font-serif leading-none select-none pointer-events-none">“</div>
                  
                  {summaryLoading ? (
                    <div className="space-y-2.5 animate-pulse pt-2.5">
                      <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-11/12" />
                      <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-4/6" />
                    </div>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed pt-2.5 font-semibold text-xs sm:text-sm">
                      {aiSummary}
                    </p>
                  )}
                </div>
              </div>

              {/* Appreciation Potential */}
              <div className="flex items-center gap-2 bg-teal-500/10 dark:bg-teal-500/15 text-teal-650 dark:text-teal-400 border border-teal-500/20 py-3 px-4 rounded-2xl text-center text-xs font-bold tracking-wide uppercase select-none shadow-sm">
                <TrendingUp className="w-4.5 h-4.5 text-teal-500" />
                <span>Excellent Appreciation Rating (+12% Sector)</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-300 cursor-pointer active:scale-[0.98] text-xs sm:text-sm flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Schedule a 360° VR Tour</span>
              </button>
              
              <button 
                onClick={handleCopyLink}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-850/50 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] text-xs sm:text-sm cursor-pointer shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Property link</span>
              </button>

              {/* Action row (Heart, Copy, Flag) */}
              <div className="flex items-center justify-center gap-6 pt-3.5 text-slate-400 dark:text-slate-650">
                <button 
                  onClick={() => setLiked(!liked)} 
                  className={`hover:text-red-500 transition-colors cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-full ${liked ? 'text-red-505 fill-red-550 scale-110' : ''}`}
                  title="Save Property"
                >
                  <Heart className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={handleCopyLink} 
                  className="hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-full transition-colors cursor-pointer p-1.5"
                  title="Copy Details URL"
                >
                  <Copy className="w-4.5 h-4.5" />
                </button>
                <button 
                  className="hover:text-yellow-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-full transition-colors cursor-pointer p-1.5"
                  title="Report Listing"
                >
                  <Flag className="w-4.5 h-4.5" />
                </button>
              </div>
              
              {/* Copy success toast */}
              <div className="h-4">
                {toastMessage && (
                  <div className="text-center text-[11px] font-bold text-green-600 dark:text-green-450 animate-fade-in">
                    {toastMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
