const FullscreenModal = ({
    showFullscreen,
    fullscreenArticle,
    darkMode,
    onClose,
    onShare,
    onToggleSave,
    isSaved
}) => {
    if (!showFullscreen || !fullscreenArticle) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
            <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${darkMode ? 'bg-gray-900/70 border-white/10' : 'bg-white/70 border-black/10'} backdrop-blur-xl`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold pr-8">{fullscreenArticle.title}</h2>
                        <button
                            onClick={onClose}
                            className={`text-2xl p-2 rounded-full transition-colors border ${darkMode ? 'hover:bg-gray-800 border-white/10' : 'hover:bg-gray-100 border-black/10'}`}
                        >
                            ✕
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
                        <span>{new Date(fullscreenArticle.publishedAt).toLocaleDateString()}</span>
                    </div>

                    <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {fullscreenArticle.description}
                    </p>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => onShare(fullscreenArticle)}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow"
                        >
                            🔗 Share Article
                        </button>
                        <button
                            onClick={() => onToggleSave(fullscreenArticle)}
                            className={`px-6 py-3 rounded-lg transition-colors shadow ${isSaved(fullscreenArticle.url)
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-yellow-500 hover:bg-yellow-600'
                                } text-white`}
                        >
                            {isSaved(fullscreenArticle.url) ? '⭐ Unsave' : '⭐ Save'}
                        </button>
                    </div>

                    <a
                        href={fullscreenArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-6 text-center bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors shadow border border-white/10"
                    >
                        Read Full Article on {fullscreenArticle.source.name}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FullscreenModal;