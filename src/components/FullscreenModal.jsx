import React from 'react';
import { BookmarkIcon, ShareIcon, ClockIcon, ExternalLinkIcon } from './Icons';

// Align props with App.jsx: expect `fullscreenArticle`, `settings` (optional), and handlers.
const FullscreenModal = ({
    fullscreenArticle,
    settings,
    onClose,
    onShare,
    onToggleSave,
    isSaved
}) => {
    if (!fullscreenArticle) return null;
    const darkMode = settings?.darkMode ?? false;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
            <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${darkMode ? 'bg-gray-900/70 border-white/10' : 'bg-white/70 border-black/10'} backdrop-blur-xl`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold pr-8">{fullscreenArticle.title}</h2>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-colors border ${darkMode ? 'hover:bg-gray-800 border-white/10' : 'hover:bg-gray-100 border-black/10'}`}
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {fullscreenArticle.urlToImage && (
                        <img
                            src={fullscreenArticle.urlToImage}
                            alt={fullscreenArticle.title}
                            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6 animated fadeIn"
                        />
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                        <span className="font-medium">{fullscreenArticle.source.name}</span>
                        <span className="flex items-center gap-2">
                            <ClockIcon />
                            {new Date(fullscreenArticle.publishedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {fullscreenArticle.description}
                    </p>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => onShare(fullscreenArticle)}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow flex items-center gap-2"
                        >
                            <ShareIcon /> Share Article
                        </button>
                        <button
                            onClick={() => onToggleSave(fullscreenArticle)}
                            className={`px-6 py-3 rounded-lg transition-colors shadow flex items-center gap-2 ${isSaved(fullscreenArticle.url)
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-yellow-500 hover:bg-yellow-600'
                                } text-white`}
                        >
                            <BookmarkIcon filled={isSaved(fullscreenArticle.url)} />
                            {isSaved(fullscreenArticle.url) ? 'Unsave' : 'Save'}
                        </button>
                    </div>

                    <a
                        href={fullscreenArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-6 text-center bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors shadow border border-white/10 flex items-center justify-center gap-2 mx-auto w-fit"
                    >
                        Read Full Article on {fullscreenArticle.source.name}
                        <ExternalLinkIcon />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FullscreenModal;