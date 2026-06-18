import React from 'react';
import PropertyCard from './PropertyCard';
import ShareButton from './ShareButton';
import { Home } from 'lucide-react';

export default function PropertyGrid({ properties, onSelect, isParsing, parsedFilters, compareList, toggleCompare }) {
  if (isParsing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
            <div className="aspect-video bg-slate-200 w-full" />
            <div className="p-5">
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-6" />
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-slate-200 rounded-full w-20" />
                <div className="h-6 bg-slate-200 rounded-full w-24" />
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
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Home className="w-12 h-12 text-slate-300" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
        <p className="text-slate-500 max-w-md">
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
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
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Properties</h2>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            index={index}
            onSelect={onSelect} 
            compareList={compareList}
            toggleCompare={toggleCompare}
          />
        ))}
      </div>
    </div>
  );
}
