import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// --- SVG Icons ---
const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4" />
    <path d="M8 2h12v10L14 7l-6 5V2Z" />
    <path d="M8 12h12v8h-4v-4h-4v4H8v-8Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15-.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);


// --- Components ---

const SkeletonCard = ({ viewMode }) => (
  <div className={`rounded-xl overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg animate-pulse ${viewMode === 'list' ? 'flex' : ''}`}>
    <div className={`bg-gray-200 dark:bg-gray-700 ${viewMode === 'list' ? 'w-48 h-full shrink-0' : 'w-full h-48'}`} />
    <div className="p-5 w-full">
      <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-3" />
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  </div>
);

const SettingsPanel = ({ open, onClose, settings, setSettings }) => {
  if (!open) return null;

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <Motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl shadow-2xl border bg-white/80 dark:bg-gray-900/80 border-black/10 dark:border-white/10 backdrop-blur-xl">
        <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quick Settings</h3>
          <button aria-label="Close settings" onClick={onClose} className="px-2 py-1 rounded-full text-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">✕</button>
        </div>
        <div className="p-6 space-y-5">
          {Object.entries({
            darkMode: "Dark Mode",
            compactMode: "Compact Density",
            glassMode: "Glassy Surfaces",
            reduceMotion: "Reduce Motion"
          }).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-3 cursor-pointer">
              <span>{label}</span>
              <div className="relative">
                <input type="checkbox" checked={settings[key]} onChange={(e) => handleChange(key, e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </div>
            </label>
          ))}
          <div className="flex items-center justify-between gap-3 pt-2">
            <span>Layout</span>
            <div className="flex rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
              <button aria-label="List view" onClick={() => handleChange('viewMode', 'list')} className={`px-4 py-2 transition-colors ${settings.viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>☰</button>
              <button aria-label="Grid view" onClick={() => handleChange('viewMode', 'grid')} className={`px-4 py-2 transition-colors ${settings.viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>☷</button>
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

const FullscreenModal = ({ fullscreenArticle, onClose, onShare, onToggleSave, isSaved, settings }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4" onClick={onClose}>
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${settings.darkMode ? 'bg-gray-900/80 border-white/10 text-gray-100' : 'bg-white/80 border-black/10 text-gray-900'} backdrop-blur-xl`}>
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 text-2xl p-2 rounded-full transition-colors border ${settings.darkMode ? 'hover:bg-gray-800 border-white/10' : 'hover:bg-gray-100 border-black/10'}`}
          >
            ✕
          </button>
          <h2 className="text-3xl font-bold pr-12 mb-4">{fullscreenArticle.title}</h2>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
            <span className="font-medium">{fullscreenArticle.source.name}</span>
            <span className="text-gray-400">|</span>
            <span>{new Date(fullscreenArticle.publishedAt).toLocaleString()}</span>
          </div>

          {fullscreenArticle.urlToImage && (
            <img src={fullscreenArticle.urlToImage} alt={fullscreenArticle.title} className="w-full h-auto max-h-96 object-contain rounded-lg mb-6" />
          )}

          <p className={`text-lg leading-relaxed mb-6 ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {fullscreenArticle.content || fullscreenArticle.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
            <button onClick={() => onToggleSave(fullscreenArticle)} className={`px-6 py-3 rounded-lg transition-colors shadow-md w-full sm:w-auto font-semibold flex items-center justify-center gap-2 ${isSaved(fullscreenArticle.url) ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}>
              {isSaved(fullscreenArticle.url) ? '⭐ Unsave Article' : '⭐ Save Article'}
            </button>
            <button onClick={() => onShare(fullscreenArticle)} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md w-full sm:w-auto font-semibold flex items-center justify-center gap-2">
              🔗 Share Article
            </button>
          </div>

          <a href={fullscreenArticle.url} target="_blank" rel="noopener noreferrer" className="block mt-6 text-center bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md border border-white/10 font-bold text-lg">
            Read Full Article on {fullscreenArticle.source.name}
          </a>
        </div>
      </Motion.div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState([]);
  const [fullscreenArticle, setFullscreenArticle] = useState(null);
  const [page, setPage] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    compactMode: false,
    glassMode: true,
    reduceMotion: false,
    viewMode: 'grid',
  });

  const observer = useRef();
  const searchInputRef = useRef(null);

  const API_KEY = "3c05f6a60fc649daaa63947418b61ab4";
  const BASE_URL = 'https://newsapi.org/v2';
  const categories = ['general', 'business', 'technology', 'sports', 'health', 'science', 'entertainment'];

  // --- Effects ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('newsapp_saved');
      if (saved) setSavedArticles(JSON.parse(saved));

      const savedSettings = localStorage.getItem('newsapp_settings');
      if (savedSettings) setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('newsapp_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const lastArticleRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && news.length > 0) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, news.length]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      if (page === 1) setNews([]);

      setError(null);

      try {
        const params = {
          apiKey: API_KEY,
          pageSize: 12,
          page: page,
        };
        let endpoint = `${BASE_URL}/top-headlines`;

        if (searchQuery) {
          endpoint = `${BASE_URL}/everything`;
          params.q = searchQuery;
          delete params.category;
        } else {
          params.category = category;
          params.country = 'us';
        }

        const response = await axios.get(endpoint, { params });
        const newArticles = response.data.articles.filter(a => a.title !== "[Removed]") || [];

        setNews(prevNews => page === 1 ? newArticles : [...prevNews, ...newArticles]);

      } catch (err) {
        setError('Failed to fetch news. Please check your API key and try again.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, searchQuery, page]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key.toLowerCase() === 'd' && !e.metaKey && !e.ctrlKey) {
        setSettings(s => ({ ...s, darkMode: !s.darkMode }));
      }
      if (e.key === 'Escape') {
        setFullscreenArticle(null);
        setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Handlers ---
  const handleCategoryChange = (newCategory) => {
    if (category === newCategory) return;
    setCategory(newCategory);
    setSearchQuery('');
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newQuery = e.target.elements.search.value;
    if (searchQuery === newQuery) return;
    setSearchQuery(newQuery);
    setCategory('general');
    setPage(1);
  };

  const handleToggleSave = (article) => {
    const isAlreadySaved = isSaved(article.url);
    const newSaved = isAlreadySaved
      ? savedArticles.filter(item => item.url !== article.url)
      : [article, ...savedArticles];
    setSavedArticles(newSaved);
    localStorage.setItem('newsapp_saved', JSON.stringify(newSaved));
  };

  const isSaved = (url) => savedArticles.some(item => item.url === url);

  // --- UI Configuration ---
  const motionProps = settings.reduceMotion ? {} : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const cardLayoutClasses = settings.viewMode === 'grid'
    ? `grid grid-cols-1 ${settings.compactMode ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`
    : 'flex flex-col gap-6';

  const cardClasses = `${settings.glassMode ? 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-white/10' : 'bg-white dark:bg-gray-800'}`;

  const GlobalStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      :root { --bg-gradient: ${settings.darkMode ? 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)' : 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)'}; }
      body {
        font-family: 'Inter', sans-serif;
        background: var(--bg-gradient);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        transition: background 0.5s ease;
      }
      html { scroll-behavior: smooth; }
      *::-webkit-scrollbar { width: 10px; height: 10px; }
      *::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #3B82F6, #8B5CF6);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      *::-webkit-scrollbar-track { background: transparent; }
    `}</style>
  );

  return (
    <>
      <GlobalStyles />
      <div className={`min-h-screen transition-colors duration-500 text-gray-900 dark:text-gray-100`}>
        <AnimatePresence>
          {fullscreenArticle && (
            <FullscreenModal fullscreenArticle={fullscreenArticle} onClose={() => setFullscreenArticle(null)} onShare={() => { }} onToggleSave={handleToggleSave} isSaved={isSaved} settings={settings} />
          )}
          <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} setSettings={setSettings} />
        </AnimatePresence>

        <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/80 dark:border-gray-800/80 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <NewsIcon />
                <h1 className="text-2xl font-bold hidden sm:block">NewsWave</h1>
              </div>
              <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                <input
                  ref={searchInputRef} type="search" name="search"
                  placeholder="Search articles..."
                  className="w-full px-4 py-2 rounded-lg border bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300"
                />
              </form>
              <div className="flex items-center gap-2">
                <button onClick={() => setSettings(s => ({ ...s, darkMode: !s.darkMode }))} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {settings.darkMode ? <SunIcon /> : <MoonIcon />}
                </button>
                <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <SettingsIcon />
                </button>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-2 mt-4 pb-2 -mx-4 px-4">
              {categories.map(cat => (
                <button key={cat} onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${category === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

          <AnimatePresence>
            {savedArticles.length > 0 && (
              <Motion.section {...motionProps} className="mb-12">
                <h2 className="text-2xl font-bold mb-4">⭐ Saved Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {savedArticles.slice(0, 4).map(article => (
                    <Motion.div key={`saved-${article.url}`} whileHover={!settings.reduceMotion ? { scale: 1.05 } : {}} onClick={() => setFullscreenArticle(article)} className={`relative rounded-lg overflow-hidden cursor-pointer group h-40 shadow-lg ${cardClasses}`}>
                      <img src={article.urlToImage || `https://placehold.co/400x300/e2e8f0/334155?text=${encodeURIComponent(article.source.name)}`} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <h3 className="absolute bottom-0 left-0 p-3 text-white font-semibold text-sm line-clamp-2">{article.title}</h3>
                    </Motion.div>
                  ))}
                </div>
              </Motion.section>
            )}
          </AnimatePresence>

          <Motion.div layout className={cardLayoutClasses}>
            <AnimatePresence>
              {(loading && news.length === 0) ? (
                Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} viewMode={settings.viewMode} />)
              ) : (
                news.map((article, index) => (
                  <Motion.article layout key={article.url} ref={index === news.length - 1 ? lastArticleRef : null} {...motionProps} whileHover={!settings.reduceMotion ? { y: -5 } : {}}
                    className={`rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col ${cardClasses} ${settings.viewMode === 'list' ? 'flex-row' : ''}`}>
                    {article.urlToImage && (
                      <div onClick={() => setFullscreenArticle(article)} className={`relative overflow-hidden cursor-pointer ${settings.viewMode === 'list' ? 'w-40 sm:w-48 flex-shrink-0' : 'w-full h-48'}`}>
                        <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://placehold.co/600x400/e2e8f0/334155?text=${encodeURIComponent(article.source.name)}` }} />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-grow">
                      <h2 className="text-lg font-bold mb-2 line-clamp-3 hover:text-blue-500 cursor-pointer" onClick={() => setFullscreenArticle(article)}>
                        {article.title}
                      </h2>
                      {!settings.compactMode && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">{article.description}</p>}
                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
                        <span className="font-medium line-clamp-1 flex-shrink-0 pr-2">{article.source.name}</span>
                        <span className="text-right whitespace-nowrap">{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 mt-4 items-center">
                        <button onClick={() => handleToggleSave(article)} className={`p-2 rounded-full transition-colors text-2xl ${isSaved(article.url) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}>{isSaved(article.url) ? '★' : '☆'}</button>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="ml-auto px-4 py-2 text-xs font-semibold bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm">Read More</a>
                      </div>
                    </div>
                  </Motion.article>
                ))
              )}
            </AnimatePresence>
          </Motion.div>

          {loading && news.length > 0 && <div className="text-center py-8 font-semibold">Loading more articles...</div>}
        </main>
      </div>
    </>
  );
}

export default App;

