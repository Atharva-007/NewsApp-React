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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 animated fadeIn">
            <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold pr-8 animated slideUp">{fullscreenArticle.title}</h2>
                        <button
                            onClick={onClose}
                            className={`text-2xl p-2 rounded-full hover:bg-gray-200 ${darkMode ? 'hover:bg-gray-700' : ''} transition-colors`}
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

                    <p className={`text-lg leading-relaxed mb-6 animated slideUp ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {fullscreenArticle.description}
                    </p>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => onShare(fullscreenArticle)}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors animated pulse"
                        >
                            🔗 Share Article
                        </button>
                        <button
                            onClick={() => onToggleSave(fullscreenArticle)}
                            className={`px-6 py-3 rounded-lg transition-colors ${isSaved(fullscreenArticle.url)
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
                        className="block mt-6 text-center bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors animated bounceIn"
                    >
                        Read Full Article on {fullscreenArticle.source.name}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FullscreenModal;
