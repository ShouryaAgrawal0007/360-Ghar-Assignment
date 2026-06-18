import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

export default function ShareButton() {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <>
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 px-4.5 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18110f]/90 hover:bg-slate-50 dark:hover:bg-[#201815] hover:border-orange-500/30 dark:hover:border-orange-500/30 text-slate-700 dark:text-slate-300 hover:text-orange-550 dark:hover:text-orange-400 text-xs sm:text-sm font-bold transition-all duration-350 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
      >
        <Share2 className="w-4 h-4 text-orange-500" />
        <span>Share Search Link</span>
      </button>

      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-[#1b120f]/95 border border-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl transition-all duration-300 pointer-events-none flex items-center gap-2 
          ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      >
        <span>🔗 Search Query Link Copied to Clipboard!</span>
      </div>
    </>
  );
}
