import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNewsStore } from './stores/useNewsStore';
import Header from './components/header';
import NewsGrid from './components/NewsGrid';
import FullscreenModal from './components/FullscreenModal';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  const {
    settings,
    settingsOpen,
    setSettingsOpen,
    setSettings,
    fullscreenArticle,
    setFullscreenArticle,
    toggleSaveArticle,
    isSaved,
    setSearchQuery,
    setCategory,
  } = useNewsStore();

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const store = useNewsStore.getState();
      if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key.toLowerCase() === 'd' && !e.metaKey && !e.ctrlKey) {
        store.setSettings(s => ({ ...s, darkMode: !s.darkMode }));
      }
      if (e.key === 'Escape') {
        store.setFullscreenArticle(null);
        store.setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(article.url);
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${settings.darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Header
        searchInputRef={searchInputRef}
        onSearchSubmit={(e) => {
          e.preventDefault();
          setSearchQuery(e.target.elements.search.value);
        }}
        onCategoryChange={(cat) => setCategory(cat)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <main className="max-w-full mx-auto">
        <NewsGrid />
      </main>

      <AnimatePresence>
        {fullscreenArticle && (
          <FullscreenModal
            fullscreenArticle={fullscreenArticle}
            onClose={() => setFullscreenArticle(null)}
            onShare={handleShare}
            onToggleSave={toggleSaveArticle}
            isSaved={isSaved}
            settings={settings}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && (
          <SettingsPanel
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </AnimatePresence>

      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-black/10 dark:border-white/10">
        <p>Powered by <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">NewsAPI.org</a></p>
        <p>Modern News Web App</p>
      </footer>
    </div>
  );
}

