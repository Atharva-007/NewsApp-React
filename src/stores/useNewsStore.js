import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Load initial settings from localStorage to prevent theme flicker on load
const getInitialSettings = () => {
    try {
        const savedSettings = localStorage.getItem('news-app-storage'); // Corrected key
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings).state.settings;
            if (parsed.darkMode) {
                document.documentElement.classList.add('dark');
            }
            return parsed;
        }
    } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
    }
    return {
        darkMode: false,
        compactMode: false,
        glassMode: true,
        reduceMotion: false,
        viewMode: 'grid',
    };
};

export const useNewsStore = create(
    persist(
        (set, get) => ({
            // --- STATE ---
            category: 'general',
            searchQuery: '',
            savedArticles: [],
            fullscreenArticle: null,
            settingsOpen: false,
            settings: getInitialSettings(),

            // --- ACTIONS ---
            setCategory: (category) => set({ category, searchQuery: '' }),
            // When searching, keep current category; fetching logic will use `searchQuery` and ignore category.
            setSearchQuery: (searchQuery) => set({ searchQuery }),

            setSettings: (newSettings) => {
                const oldSettings = get().settings;
                const updatedSettings = typeof newSettings === 'function' ? newSettings(oldSettings) : { ...oldSettings, ...newSettings };

                if (oldSettings.darkMode !== updatedSettings.darkMode) {
                    if (updatedSettings.darkMode) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }

                set({ settings: updatedSettings });
            },

            setSettingsOpen: (isOpen) => set({ settingsOpen: isOpen }),
            setFullscreenArticle: (article) => set({ fullscreenArticle: article }),

            toggleSaveArticle: (article) => {
                const { savedArticles } = get();
                const isAlreadySaved = savedArticles.some(item => item.url === article.url);
                const newSaved = isAlreadySaved
                    ? savedArticles.filter(item => item.url !== article.url)
                    : [article, ...savedArticles];
                set({ savedArticles: newSaved });
            },

            isSaved: (url) => get().savedArticles.some(item => item.url === url),
        }),
        {
            name: 'news-app-storage', // Name for the localStorage item
            partialize: (state) => ({
                // Only persist 'savedArticles' and 'settings'
                savedArticles: state.savedArticles,
                settings: state.settings,
            }),
        }
    )
);


