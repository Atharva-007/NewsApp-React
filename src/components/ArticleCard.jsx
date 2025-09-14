import React, { forwardRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNewsStore } from '../stores/useNewsStore';
import { BookmarkIcon, ClockIcon, ExternalLinkIcon } from './Icons';

const ArticleCard = forwardRef(({ article }, ref) => {
    const { settings, savedArticles, toggleSaveArticle, setFullscreenArticle } = useNewsStore();
    const [isSummarizing, setIsSummarizing] = useState(false);

    const isSaved = savedArticles.some(a => a.url === article.url);

    const cardClasses = settings.glassMode
        ? 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-white/10'
        : 'bg-white dark:bg-gray-800';

    const motionProps = settings.reduceMotion ? {} : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3, ease: "easeOut" },
        whileHover: { y: -5 }
    };

    const handleSummarize = (e) => {
        e.stopPropagation();
        setIsSummarizing(true);
        setTimeout(() => {
            const mockSummary = "This is an AI-generated summary of the article. It highlights the key points, providing a quick overview of the content so you can stay informed faster.";
            setFullscreenArticle({ ...article, summary: mockSummary });
            setIsSummarizing(false);
        }, 1500);
    };

    return (
        <Motion.article layout ref={ref} {...motionProps}
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
                    <span className="text-right whitespace-nowrap flex items-center gap-1">
                        <ClockIcon />
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex gap-2 mt-4 items-center">
                    <button
                        onClick={() => toggleSaveArticle(article)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label={isSaved ? "Unsave article" : "Save article"}
                        title={isSaved ? "Unsave article" : "Save article"}
                    >
                        <BookmarkIcon filled={isSaved} />
                    </button>
                    <button
                        onClick={handleSummarize}
                        className="px-3 py-2 text-xs font-semibold bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors shadow-sm disabled:bg-purple-300"
                        disabled={isSummarizing}
                    >
                        {isSummarizing ? 'Summarizing...' : 'Summarize ✨'}
                    </button>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto px-4 py-2 text-xs font-semibold bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-1"
                    >
                        Read More <ExternalLinkIcon />
                    </a>
                </div>
            </div>
        </Motion.article>
    );
});

export default ArticleCard;

