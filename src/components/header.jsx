import React from 'react';
import { useNewsStore } from '../stores/useNewsStore';
import { NewsIcon, SettingsIcon, SunIcon, MoonIcon, SearchIcon } from './Icons';

// Accept props from App to keep one source of truth for refs and actions
const Header = ({ searchInputRef, onSearchSubmit, onCategoryChange, onSettingsClick }) => {
    const { category, settings, setSettings } = useNewsStore();

    const categories = ['✨ For You', 'general', 'business', 'technology', 'sports', 'health', 'science', 'entertainment'];

    const handleSearch = (e) => {
        if (onSearchSubmit) onSearchSubmit(e);
    };

    return (
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/80 dark:border-gray-800/80 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <NewsIcon />
                        <h1 className="text-2xl font-bold hidden sm:block">NewsWave</h1>
                    </div>
                    <form onSubmit={handleSearch} className="flex-1 max-w-lg relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="search"
                            name="search"
                            placeholder="Search articles... (Press '/' to focus)"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-300"
                        />
                    </form>
                    <div className="flex items-center gap-2">
                        <button onClick={() => {
                            const next = !settings.darkMode;
                            if (next !== settings.darkMode) setSettings({ darkMode: next });
                        }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {settings.darkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <SettingsIcon />
                        </button>
                    </div>
                </div>
                <div className="flex overflow-x-auto gap-2 mt-4 pb-2 -mx-4 px-4">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => onCategoryChange?.(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${category === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;

