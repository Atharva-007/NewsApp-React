import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Reentrancy guard + burst counter for debugging potential recursive updates
let settingsUpdateInProgress = false;
let settingsBurstCount = 0;
let lastBurstTs = 0;

// Shallow compare two plain objects (single-level) to avoid redundant store updates
const shallowEqual = (a, b) => {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
        if (a[k] !== b[k]) return false;
    }
    return true;
};

// Default settings object
const defaultSettings = {
    darkMode: false,
    compactMode: false,
    glassMode: true,
    reduceMotion: false,
    viewMode: 'grid',
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
            settings: defaultSettings,

            // --- ACTIONS ---
            setCategory: (category) => set({ category, searchQuery: '' }),
            // When searching, keep current category; fetching logic will use `searchQuery` and ignore category.
            setSearchQuery: (searchQuery) => set({ searchQuery }),

            setSettings: (newSettings) => {
                // Prevent recursive / overlapping updates
                if (settingsUpdateInProgress) {
                    if (import.meta.env.DEV) {
                        console.warn('[settings] Skipped recursive call');
                    }
                    return;
                }
                settingsUpdateInProgress = true;
                try {
                    const now = Date.now();
                    if (now - lastBurstTs > 250) {
                        // reset burst window
                        settingsBurstCount = 0;
                        lastBurstTs = now;
                    }
                    settingsBurstCount++;
                    if (settingsBurstCount > 25 && import.meta.env.DEV) {
                        console.warn('[settings] High-frequency updates detected (>', settingsBurstCount, 'in 250ms)');
                    }
                    const oldSettings = get().settings;
                    const updatedSettings = typeof newSettings === 'function'
                        ? newSettings(oldSettings)
                        : { ...oldSettings, ...newSettings };

                    // Prevent redundant updates that can trigger re-render loops
                    if (shallowEqual(oldSettings, updatedSettings)) return;

                    if (oldSettings.darkMode !== updatedSettings.darkMode) {
                        if (updatedSettings.darkMode) {
                            document.documentElement.classList.add('dark');
                        } else {
                            document.documentElement.classList.remove('dark');
                        }
                    }

                    set({ settings: updatedSettings });
                } finally {
                    settingsUpdateInProgress = false;
                }
            },

            setSettingsOpen: (isOpen) => set({ settingsOpen: isOpen }),
            setFullscreenArticle: (article) => set({ fullscreenArticle: article }),

            toggleSaveArticle: (article) => {
                const { savedArticles } = get();
                const isAlreadySaved = savedArticles.some(item => item.url === article.url);
                const newSaved = isAlreadySaved
                    ? savedArticles.filter(item => item.url !== article.url)
                    : [article, ...savedArticles];
                // Only update if list actually changes length/content
                if (newSaved.length === savedArticles.length && isAlreadySaved) return;
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


