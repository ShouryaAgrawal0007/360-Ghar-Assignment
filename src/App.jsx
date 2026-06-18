import React, { useState, useCallback, useEffect } from 'react';
import { PROPERTIES } from './data/properties';
import SearchBar from './components/SearchBar';
import PropertyGrid from './components/PropertyGrid';
import PropertyModal from './components/PropertyModal';
import CompareModal from './components/CompareModal';
import { parseSearchQuery, generateFollowUpQuestion } from './services/openrouter';
import { filterAndRankProperties } from './services/filterEngine';
import { Sun, Moon, Compass, Sparkles, FolderOpen, ArrowRight, Shield, Globe, Award, Activity, Heart, Info } from 'lucide-react';

function App() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedFilters, setParsedFilters] = useState(null);
  const [properties, setProperties] = useState(PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState(PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleCompare = useCallback((property) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === property.id);
      if (exists) return prev.filter(p => p.id !== property.id);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, property];
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get("q");
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch(urlQuery);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setParsedFilters(null);
    setFilteredProperties([]);
    setHasSearched(false);
    setFollowUpQuestion(null);
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const handleSearch = useCallback(async (queryText) => {
    if (!queryText.trim()) return;
    setHasSearched(true);
    setIsParsing(true);
    setSelectedProperty(null);
    
    const filters = await parseSearchQuery(queryText);
    
    if (filters) {
      setParsedFilters(filters);
      const ranked = filterAndRankProperties(properties, filters);
      setFilteredProperties(ranked);
      
      const params = new URLSearchParams();
      params.set("q", queryText);
      window.history.replaceState({}, "", `?${params.toString()}`);

      // Fetch AI clarifying follow-up question
      generateFollowUpQuestion(queryText, filters).then(q => {
        setFollowUpQuestion(q);
      }).catch(err => {
        console.error("Failed to load follow-up question:", err);
      });
    }
    
    setIsParsing(false);
  }, [properties]);

  const handleChipClick = (chipQuery) => {
    setQuery(chipQuery);
    handleSearch(chipQuery);
  };

  const handleFollowUpClick = (newQuery) => {
    setQuery(newQuery);
    setFollowUpQuestion(null);
    handleSearch(newQuery);
  };

  const removeFilter = useCallback((type, value) => {
    setParsedFilters(prev => {
      if (!prev) return null;
      
      let updated = { ...prev };
      
      if (type === 'bhk') {
        updated.bhk = null;
      } else if (type === 'price') {
        updated.minPrice = null;
        updated.maxPrice = null;
      } else if (type === 'sector') {
        updated.sectors = updated.sectors.filter(sec => sec !== value);
      } else if (type === 'amenity') {
        updated.amenities = updated.amenities.filter(am => am !== value);
      }
      
      const hasRemainingFilters = 
        updated.bhk !== null || 
        updated.minPrice !== null || 
        updated.maxPrice !== null || 
        (updated.sectors && updated.sectors.length > 0) || 
        (updated.amenities && updated.amenities.length > 0);
        
      if (!hasRemainingFilters) {
        clearSearch();
        return null;
      }
      
      const ranked = filterAndRankProperties(properties, updated);
      setFilteredProperties(ranked);
      return updated;
    });
  }, [properties, clearSearch]);

  return (
    <div className="min-h-screen bg-[#FCFBFA] dark:bg-[#0d0908] text-slate-800 dark:text-slate-100 font-sans flex flex-col scroll-smooth transition-colors duration-500">
      
      {/* ── HOME PAGE VIEW ── */}
      {!hasSearched && (
        <>
          {/* HEADER */}
          <header className="sticky top-0 z-30 transition-all duration-300 backdrop-blur-md bg-white/75 dark:bg-[#0d0908]/75 border-b border-slate-200/40 dark:border-slate-850 py-4.5 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Logo */}
              <div className="flex flex-col cursor-pointer group" onClick={clearSearch}>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-2xl font-black text-orange-500 tracking-tight group-hover:scale-105 transition-transform">360°</span>
                  <span className="text-2xl font-black text-slate-905 dark:text-white tracking-widest">GHAR</span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold tracking-widest uppercase mt-1">Verified VR Spatial Portals</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105"
                  aria-label="Toggle Dark Mode"
                >
                  {darkMode ? <Sun size={17} className="text-amber-500" /> : <Moon size={17} className="text-slate-700" />}
                </button>
                <button className="hidden sm:block text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors px-4 py-2.5 cursor-pointer">
                  Sign In
                </button>
                <button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs sm:text-sm font-black px-5 py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-102">
                  List Property
                </button>
              </div>
            </div>
          </header>

          {/* MAIN HERO LANDING PAGE */}
          <main className="flex-1 flex flex-col items-center justify-center relative bg-[#FCFBFA] dark:bg-[#0d0908] overflow-hidden min-h-[calc(100vh-85px)] transition-colors duration-500">
            {/* Visual Mesh Backgrounds */}
            <div className="absolute inset-0 bg-grid-pattern opacity-80 pointer-events-none"></div>
            
            {/* Soft Ambient glowing colors */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[60%] h-[35%] bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-600/5 dark:from-orange-500/5 dark:via-purple-900/5 dark:to-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full text-center pb-24 pt-12 sm:pt-16">
              
              {/* Introduction Badge */}
              <div className="inline-flex items-center gap-2 mb-7 px-4.5 py-2 rounded-full border border-orange-500/20 dark:border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-amber-500/10 text-orange-600 dark:text-orange-400 text-[10px] sm:text-xs font-black tracking-widest uppercase animate-fade-in shadow-[0_4px_20px_rgba(249,115,22,0.08)]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-orange-500" />
                <span>Experience the Future: Semantic Search & VR Immersive Portals</span>
              </div>
              
              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-playfair font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                Skip the rigid filters,<br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-amber-550 dark:from-orange-400 dark:via-rose-450 dark:to-amber-300">
                  describe your perfect vibe.
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-slate-650 dark:text-slate-350 mb-12 max-w-2xl mx-auto animate-fade-in font-bold leading-relaxed" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                Say goodbye to clunky checkboxes. Talk to our spatial intelligence engine like a friend, and watch it map matches, floor levels, and layout styles in real-time.
              </p>
              
              {/* Prompt Search Console */}
              <div className="w-full max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                <SearchBar 
                  query={query}
                  setQuery={setQuery}
                  onSearch={handleSearch}
                  isParsing={isParsing}
                  isListening={isListening}
                  setIsListening={setIsListening}
                  parsedFilters={null}
                />
                
                {/* Example Quick Filters Chips */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {[
                    "2BHK in Sector 50 near school",
                    "3BHK with pool and gym",
                    "Modern penthouse in Gurgaon"
                  ].map((chip, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleChipClick(chip)}
                      className="bg-white dark:bg-[#150f0d]/80 hover:bg-slate-50 dark:hover:bg-[#1e1512] border border-slate-200/80 dark:border-slate-850 text-slate-650 dark:text-slate-300 text-xs sm:text-sm px-4.5 py-3 rounded-full transition-all hover:border-orange-500/40 dark:hover:border-orange-500/40 hover:text-orange-550 dark:hover:text-orange-400 hover:-translate-y-0.5 cursor-pointer shadow-sm"
                    >
                      "{chip}"
                    </button>
                  ))}
                </div>
              </div>

              {/* STUNNING INTERACTIVE FEATURE SHOWCASE */}
              <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto w-full animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                
                {/* Left Large Card: VR Portal preview */}
                <div className="md:col-span-2 relative aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-850 group bg-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop"
                    alt="Skyline Villa VR Experience"
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent pointer-events-none" />
                  
                  {/* Floating VR Glass pill */}
                  <div className="absolute top-5 left-5 bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md shadow-orange-500/10 tracking-widest uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Live VR Portal</span>
                  </div>

                  <div className="absolute bottom-6 left-6 text-white z-10">
                    <span className="text-[10px] font-black px-2.5 py-1 bg-emerald-500 rounded-md shadow-sm uppercase tracking-widest">Interactive 360° Walkthrough</span>
                    <h3 className="text-xl sm:text-2xl font-black mt-3 font-playfair tracking-tight">Skyline heights Luxury Residence</h3>
                    <p className="text-slate-350 text-xs sm:text-sm mt-1 font-semibold">Explore verified floor layouts in Gurgaon, Sector 54</p>
                  </div>
                </div>

                {/* Right stack */}
                <div className="flex flex-col gap-6">
                  {/* Top kitchen showcase */}
                  <div className="relative aspect-[16/10] md:flex-1 rounded-3xl overflow-hidden shadow-md border border-slate-200/50 dark:border-slate-850 group bg-slate-900">
                    <img 
                      src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop"
                      alt="Modern Kitchen Space"
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />
                  </div>

                  {/* Bottom AI Matching analytics widget */}
                  <div className="bg-white dark:bg-[#150f0d] border border-slate-200/80 dark:border-slate-850 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between md:flex-1 min-h-[180px] relative overflow-hidden transition-colors duration-300">
                    {/* Glowing orb inside card */}
                    <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div>
                      <div className="bg-orange-500/10 text-orange-500 p-3 rounded-2xl w-fit mb-4">
                        <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                      </div>
                      <h4 className="text-lg font-black text-slate-850 dark:text-white mb-1.5 tracking-tight">Spatial Match Scoring</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-[95%]">
                        Calculates matching precision based on area pricing, BHK volume, sun orientation, and proximity metrics.
                      </p>
                    </div>
                    
                    <a href="#matching" className="text-xs font-black text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1.5 mt-5">
                      <span>How it calculates</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </main>

          {/* LANDING FOOTER */}
          <footer className="border-t border-slate-200/60 dark:border-slate-850 py-10 bg-[#FAF9F7] dark:bg-[#0c0807] transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
              <div className="flex flex-col">
                <div className="flex items-center justify-center sm:justify-start gap-1 leading-none">
                  <span className="text-lg font-black text-orange-500 tracking-tight">360°</span>
                  <span className="text-lg font-black text-slate-905 dark:text-white tracking-widest">GHAR</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">© 2026 · AI Concierge Spatial Analytics</span>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-bold">
                <a href="#privacy" className="hover:text-orange-550 dark:hover:text-white transition-colors">Privacy Policy</a>
                <a href="#terms" className="hover:text-orange-550 dark:hover:text-white transition-colors">Terms of Service</a>
                <a href="#ethics" className="hover:text-orange-550 dark:hover:text-white transition-colors">AI Ethics Code</a>
                <a href="#contact" className="hover:text-orange-550 dark:hover:text-white transition-colors">Contact Expert</a>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ── SEARCH RESULTS VIEWS ── */}
      {hasSearched && (
        <div className="flex-1 flex bg-[#FCFBFA] dark:bg-[#0d0908] transition-colors duration-500">
          
          {/* SLEEK LEFT SIDEBAR */}
          <aside className="hidden md:flex flex-col w-[250px] bg-[#F7F5F2] dark:bg-[#0f0b09] border-r border-slate-200/50 dark:border-slate-850 p-6 shrink-0 justify-between">
            <div className="space-y-9">
              {/* Logo */}
              <div className="flex flex-col cursor-pointer group" onClick={clearSearch}>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-2xl font-black text-orange-500 tracking-tight group-hover:scale-105 transition-transform">360°</span>
                  <span className="text-2xl font-black text-slate-905 dark:text-white tracking-widest">GHAR</span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-widest mt-2">Elite AI Engine</span>
              </div>

              {/* Sidebar Menu */}
              <nav className="space-y-2.5">
                {[
                  { id: 'explore', label: 'Explore Portals', icon: Compass },
                  { id: 'matches', label: 'AI Matchboard', icon: Sparkles },
                  { id: 'portfolio', label: 'My Saved Floors', icon: FolderOpen },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = item.id === 'explore';
                  return (
                    <button
                      key={item.id}
                      className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer
                        ${isActive 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/10' 
                          : 'text-slate-550 dark:text-slate-400 hover:bg-slate-200/55 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
                        }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Premium bottom block */}
            <div className="bg-white/60 dark:bg-[#150f0d]/60 border border-slate-200/40 dark:border-slate-850 p-4.5 rounded-2xl shadow-sm text-center">
              <h5 className="text-xs font-black text-slate-800 dark:text-slate-200">Unlock Pro Portals</h5>
              <p className="text-[10px] text-slate-450 mt-1 font-semibold leading-relaxed">Gain unlimited matching breakdowns & VR synching.</p>
              <button className="mt-3.5 w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-[10px] font-black py-2.5 rounded-xl cursor-pointer transition-all shadow-sm">
                Upgrade Account
              </button>
            </div>
          </aside>

          {/* MAIN RESULTS CONTAINER */}
          <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-[#0c0807]/30 min-h-screen">
            
            {/* FLOATING TOP BAR */}
            <header className="sticky top-0 z-20 bg-white/85 dark:bg-[#0d0908]/85 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-850 py-3.5 px-4 sm:px-6 flex items-center justify-between shadow-sm">
              <div className="flex-1 max-w-2xl">
                <SearchBar 
                  query={query}
                  setQuery={setQuery}
                  onSearch={handleSearch}
                  isParsing={isParsing}
                  isListening={isListening}
                  setIsListening={setIsListening}
                  parsedFilters={parsedFilters}
                  onRemoveFilter={removeFilter}
                />
              </div>
              <div className="flex items-center gap-3 sm:gap-4 ml-4 flex-shrink-0">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850 text-slate-655 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105"
                  aria-label="Toggle Dark Mode"
                >
                  {darkMode ? <Sun size={17} className="text-amber-500" /> : <Moon size={17} className="text-slate-700" />}
                </button>
                <button className="hidden sm:block text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-405 dark:hover:text-white transition-colors px-4 py-2.5 cursor-pointer">
                  Sign In
                </button>
                <button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs sm:text-sm font-black px-5 py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-102">
                  List Property
                </button>
              </div>
            </header>

            {/* RESULTS CONTENT */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full">
              {/* AI Follow-up Clarification Banner */}
              {followUpQuestion && (
                <div className="mb-8 p-5 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/15 text-xs sm:text-sm animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4.5 shadow-sm">
                  <div className="flex items-start sm:items-center gap-2.5 text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-5 h-5 text-orange-500 flex-shrink-0 animate-pulse mt-0.5 sm:mt-0" />
                    <span className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-snug">{followUpQuestion.text}</span>
                  </div>
                  <div className="flex gap-2.5 flex-shrink-0">
                    {followUpQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFollowUpClick(option.query)}
                        className="bg-white dark:bg-[#18110f] hover:bg-orange-500/5 dark:hover:bg-orange-950/20 border border-orange-500/25 text-orange-600 dark:text-orange-400 font-extrabold px-4.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-97 hover:scale-102"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <PropertyGrid 
                properties={filteredProperties} 
                onSelect={setSelectedProperty} 
                isParsing={isParsing} 
                parsedFilters={parsedFilters} 
                compareList={compareList}
                toggleCompare={toggleCompare}
              />
            </main>

            {/* RESULTS FOOTER */}
            <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-850 py-7 bg-[#FAF9F7] dark:bg-[#0c0807]/30 text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4.5">
                <span className="font-extrabold text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">© 2026 360° GHAR · AI SPATIAL ENGINE</span>
                <div className="flex gap-6 font-bold">
                  <a href="#privacy" className="hover:text-orange-550 dark:hover:text-white transition-colors">Privacy</a>
                  <a href="#terms" className="hover:text-orange-550 dark:hover:text-white transition-colors">Terms</a>
                  <a href="#ethics" className="hover:text-orange-550 dark:hover:text-white transition-colors">AI Ethics</a>
                  <a href="#contact" className="hover:text-orange-550 dark:hover:text-white transition-colors">Support</a>
                </div>
              </div>
            </footer>
          </div>
          
        </div>
      )}

      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          userQuery={query}
        />
      )}

      {/* STICKY BOTTOM COMPARE DRAWER */}
      {compareList.length === 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-[#18110f]/95 text-white px-6 py-4.5 flex flex-col sm:flex-row items-center justify-between shadow-2xl border-t border-slate-800/80 backdrop-blur-md animate-[modalScale_0.3s_ease-out_forwards]">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compare Portal:</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-orange-400 text-sm">{compareList[0].title}</span>
              <span className="text-slate-500 text-xs uppercase font-bold">vs</span>
              <span className="font-extrabold text-orange-400 text-sm">{compareList[1].title}</span>
            </div>
          </div>
          <div className="flex gap-5 items-center w-full sm:w-auto justify-end">
            <button 
              onClick={() => setCompareList([])} 
              className="text-slate-400 hover:text-white text-xs sm:text-sm font-bold underline transition-colors cursor-pointer"
            >
              Clear selection
            </button>
            <button 
              onClick={() => setShowCompare(true)} 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-6.5 py-3 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95 cursor-pointer"
            >
              Launch Side-by-Side Analysis →
            </button>
          </div>
        </div>
      )}

      {showCompare && compareList.length === 2 && (
        <CompareModal
          properties={compareList}
          onClose={() => setShowCompare(false)}
          onSelectProperty={(p) => { setShowCompare(false); setSelectedProperty(p); }}
        />
      )}
    </div>
  );
}

export default App;
