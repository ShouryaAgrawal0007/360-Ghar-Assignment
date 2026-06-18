import React from 'react';
import PropertyCard from './PropertyCard';
import ShareButton from './ShareButton';
import { Home } from 'lucide-react';

export default function PropertyGrid({ properties, onSelect, isParsing, parsedFilters, compareList, toggleCompare, layoutMode = "grid" }) {
  if (isParsing) {
    return (
      <div className={layoutMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-6"
      }>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`bg-white dark:bg-[#0e131f]/80 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse ${
            layoutMode === 'list' ? 'flex flex-col md:flex-row h-auto md:h-56' : ''
          }`}>
            <div className={layoutMode === 'list' 
              ? "w-full md:w-1/3 aspect-video md:aspect-auto md:h-full bg-slate-200 dark:bg-slate-800" 
              : "aspect-video bg-slate-200 dark:bg-slate-800 w-full"
            } />
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-4" />
              </div>
              <div className="flex gap-3 mt-4">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-200/40 dark:border-slate-800/60">
          <Home className="w-12 h-12 text-slate-300 dark:text-slate-700" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white mb-2">No properties found</h3>
        <p className="text-slate-500 max-w-md text-sm font-semibold">
          We couldn't find any properties matching your exact criteria. Try adjusting your search filters or exploring other areas.
        </p>
      </div>
    );
  }

  return (
    <div>
      {parsedFilters && (
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 animate-fade-in flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
              {properties.filter(p => p.matchScore > 0).length} properties found <span className="text-slate-400 font-normal text-xl">· Sorted by match</span>
            </h2>
          </div>
          <div className="flex-shrink-0">
            <ShareButton />
          </div>
        </div>
      )}
      
      {!parsedFilters && (
         <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 animate-fade-in">
           <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white">Featured Properties</h2>
         </div>
      )}

      <div className={layoutMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-6"
      }>
        {properties.map((property, index) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            index={index}
            onSelect={onSelect} 
            compareList={compareList}
            toggleCompare={toggleCompare}
            layoutMode={layoutMode}
          />
        ))}
      </div>
    </div>
  );
}
