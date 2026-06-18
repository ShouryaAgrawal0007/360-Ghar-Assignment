import React, { useEffect, useState } from 'react';
import { X, Check, ArrowRight, TrendingUp } from 'lucide-react';

const CompareModal = ({ properties, onClose, onSelectProperty }) => {
  const [p1, p2] = properties;
  const [showToast, setShowToast] = useState(false);

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

  const handleLaunchTour = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const BetterBadge = ({ label }) => {
    return (
      <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-lg uppercase ml-2.5 whitespace-nowrap">
        ✓ {label}
      </span>
    );
  };

  const Chip = ({ label, highlight }) => (
    <span 
      className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all duration-200
        ${highlight 
          ? 'bg-orange-500/10 dark:bg-orange-500/15 text-orange-650 dark:text-orange-400 border-orange-500/20' 
          : 'bg-slate-100 dark:bg-slate-900/80 text-slate-655 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/60'
        }`}
    >
      {label}
    </span>
  );

  const ScoreBar = ({ score }) => {
    const scoreGradient = score >= 70 
      ? 'from-emerald-500 to-teal-400' 
      : score >= 40 
        ? 'from-orange-500 to-amber-400' 
        : 'from-rose-500 to-red-400';

    return (
      <div className="w-full">
        <span className="text-xs font-black text-slate-800 dark:text-slate-200">{score}% Match</span>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full mt-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${scoreGradient}`}
            style={{ width: `${score}%`, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </div>
      </div>
    );
  };

  const Row = ({ label, children }) => (
    <div className="contents">
      <div className="bg-slate-50/50 dark:bg-[#1b120f]/15 text-orange-500/80 dark:text-orange-400/85 text-[10px] font-black uppercase tracking-widest flex items-center p-3 sm:p-4 border-t border-slate-200/60 dark:border-slate-850">
        <span>{label}</span>
      </div>
      {children}
    </div>
  );

  const Val = ({ children, className = "" }) => (
    <div className={`p-3 sm:p-4 text-xs font-semibold text-slate-850 dark:text-slate-200 bg-white dark:bg-[#120b09]/20 border-t border-l border-slate-200/60 dark:border-slate-850 flex flex-wrap items-center gap-2 min-w-0 ${className}`}>
      {children}
    </div>
  );

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Modal box */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-[#120b09] border border-slate-200/85 dark:border-slate-850 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-white overflow-hidden my-auto max-h-[92vh] flex flex-col scrollbar-hide animate-[modalScale_0.35s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Decorative ambient radial gradients */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sync Tour success toast overlay */}
        {showToast && (
          <div className="absolute inset-x-6 sm:inset-x-12 top-[40%] -translate-y-1/2 bg-slate-900/95 dark:bg-[#1b120f]/95 border border-slate-800 text-white py-4 px-6 rounded-2xl text-center text-sm font-bold shadow-2xl z-30 animate-fade-in flex items-center justify-center gap-2">
            🚀 Launching Synchronized 360° VR Tour...
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start pb-4 mb-4 border-b border-slate-200/60 dark:border-slate-850 relative z-10 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-855 dark:text-slate-100 tracking-tight font-playfair">Curated Match Analysis</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-semibold">
              Compare spatial layout, valuation, and premium amenities side-by-side.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-650 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 p-2 rounded-full border border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable grid area */}
        <div className="overflow-y-auto scrollbar-hide flex-1 pr-1 pb-4 relative z-10">
          <div className="grid grid-cols-[100px_1fr_1fr] sm:grid-cols-[130px_1fr_1fr] border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 shadow-inner">

            {/* PHOTOS ROW */}
            <div className="contents">
              <div className="bg-slate-100/60 dark:bg-[#1b120f]/40 text-slate-400 dark:text-slate-550 text-[9px] font-bold uppercase tracking-wider flex items-center justify-center p-3 text-center">
                Photos
              </div>
              <div className="relative aspect-[16/10] sm:h-36 border-l border-slate-200 dark:border-slate-850 overflow-hidden bg-slate-100">
                <img 
                  src={p1.image} 
                  alt={p1.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=160&fit=crop' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
              </div>
              <div className="relative aspect-[16/10] sm:h-36 border-l border-slate-200 dark:border-slate-850 overflow-hidden bg-slate-100">
                <img 
                  src={p2.image} 
                  alt={p2.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=160&fit=crop' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* MATRIX HEADERS */}
            <div className="contents">
              <div className="bg-slate-100/60 dark:bg-[#1b120f]/40 text-slate-400 dark:text-slate-550 text-[9px] font-bold uppercase tracking-wider flex items-center justify-center p-3 text-center border-t border-slate-200/60 dark:border-slate-850">
                Overview
              </div>
              <div className="p-3 sm:p-4 border-t border-l border-slate-200/60 dark:border-slate-850 bg-slate-50/70 dark:bg-[#1b120f]/50">
                <div className="text-xs sm:text-sm font-extrabold text-slate-850 dark:text-slate-100 leading-snug">{p1.title}</div>
                <div className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 font-bold">{p1.sector}, Gurgaon</div>
              </div>
              <div className="p-3 sm:p-4 border-t border-l border-slate-200/60 dark:border-slate-850 bg-slate-50/70 dark:bg-[#1b120f]/50">
                <div className="text-xs sm:text-sm font-extrabold text-slate-855 dark:text-slate-100 leading-snug">{p2.title}</div>
                <div className="text-[10px] text-slate-455 dark:text-slate-500 mt-1 font-bold">{p2.sector}, Gurgaon</div>
              </div>
            </div>

            {/* PRICE */}
            <Row label="Price">
              <Val>{p1.priceLabel} {p1.price < p2.price && <BetterBadge label="Better Value" />}</Val>
              <Val>{p2.priceLabel} {p2.price < p1.price && <BetterBadge label="Better Value" />}</Val>
            </Row>

            {/* SIZE */}
            <Row label="Size">
              <Val>{p1.area} sq.ft {p1.area > p2.area && <BetterBadge label="More Spacious" />}</Val>
              <Val>{p2.area} sq.ft {p2.area > p1.area && <BetterBadge label="More Spacious" />}</Val>
            </Row>

            {/* FLOOR */}
            <Row label="Floor">
              <Val>{p1.floor} of {p1.totalFloors} {p1.floor > p2.floor && <BetterBadge label="Higher View" />}</Val>
              <Val>{p2.floor} of {p2.totalFloors} {p2.floor > p1.floor && <BetterBadge label="Higher View" />}</Val>
            </Row>

            {/* FACING */}
            <Row label="Facing">
              <Val>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border
                  ${['East','North','North-East'].includes(p1.facing) 
                    ? 'bg-teal-500/10 text-teal-650 dark:text-teal-400 border-teal-500/20' 
                    : 'bg-orange-500/10 text-orange-650 dark:text-orange-400 border-orange-500/20'
                  }`}
                >
                  {p1.facing}
                </span>
              </Val>
              <Val>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border
                  ${['East','North','North-East'].includes(p2.facing) 
                    ? 'bg-teal-500/10 text-teal-650 dark:text-teal-400 border-teal-500/20' 
                    : 'bg-orange-500/10 text-orange-650 dark:text-orange-400 border-orange-500/20'
                  }`}
                >
                  {p2.facing}
                </span>
              </Val>
            </Row>

            {/* AMENITIES */}
            <Row label="Amenities">
              <Val className="gap-1.5">{p1.amenities.map(a => <Chip key={a} label={a.replace('_', ' ')} highlight={!p2.amenities.includes(a)} />)}</Val>
              <Val className="gap-1.5">{p2.amenities.map(a => <Chip key={a} label={a.replace('_', ' ')} highlight={!p1.amenities.includes(a)} />)}</Val>
            </Row>

            {/* MATCH SCORE */}
            <Row label="Match Score">
              <Val className="flex-col items-start gap-1">
                <ScoreBar score={p1.matchScore} />
                {p1.matchScore > p2.matchScore && <BetterBadge label="Stronger Match" />}
              </Val>
              <Val className="flex-col items-start gap-1">
                <ScoreBar score={p2.matchScore} />
                {p2.matchScore > p1.matchScore && <BetterBadge label="Stronger Match" />}
              </Val>
            </Row>

          </div>
        </div>

        {/* Action triggers underneath */}
        <div className="grid grid-cols-[100px_1fr_1fr] sm:grid-cols-[130px_1fr_1fr] gap-3.5 relative z-10 flex-shrink-0 mb-3">
          <div />
          <button 
            onClick={() => onSelectProperty(p1)} 
            className="w-full bg-[#1b120f] dark:bg-slate-900 hover:bg-[#2e201b] dark:hover:bg-slate-800 text-white font-bold py-3 rounded-xl border border-slate-700 dark:border-slate-800 transition-all text-xs flex items-center justify-center cursor-pointer active:scale-[0.98] shadow-sm"
          >
            View 1st Details
          </button>
          <button 
            onClick={() => onSelectProperty(p2)} 
            className="w-full bg-[#1b120f] dark:bg-slate-900 hover:bg-[#2e201b] dark:hover:bg-slate-800 text-white font-bold py-3 rounded-xl border border-slate-700 dark:border-slate-800 transition-all text-xs flex items-center justify-center cursor-pointer active:scale-[0.98] shadow-sm"
          >
            View 2nd Details
          </button>
        </div>

        {/* Sync Tour Launch footer */}
        <div className="border-t border-slate-200 dark:border-slate-850 pt-4 flex-shrink-0 relative z-10">
          <button 
            onClick={handleLaunchTour}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto shadow-md shadow-orange-500/15 transition-all duration-300 cursor-pointer active:scale-[0.98] text-xs sm:text-sm"
          >
            <span>Synchronize 360° VR Tour Comparison</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompareModal;
