import React, { useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNewsData } from '../hooks/useNewsData';
import { useNewsStore } from '../stores/useNewsStore';
import ArticleCard from './ArticleCard';
import SkeletonCard from './SkeletonCard';

const NewsGrid = () => {
    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNewsData();
    const { settings, category, savedArticles } = useNewsStore();
    const observer = useRef();

    const lastArticleRef = useCallback(node => {
        if (isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    const articles = category === '✨ For You'
        ? savedArticles
        : data?.pages.flatMap(page => page.articles) || [];

    const cardLayoutClasses = `px-4 md:px-6 lg:px-8 py-6 ${settings.viewMode === 'grid'
        ? `grid grid-cols-1 ${settings.compactMode ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`
        : 'flex flex-col gap-6'
        }`;

    if (isLoading && category !== '✨ For You') {
        return (
            <div className={cardLayoutClasses}>
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} viewMode={settings.viewMode} />)}
            </div>
        );
    }

    if (error) {
        return <div className="m-6 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">{error.message}</div>;
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                <h3 className="text-2xl font-semibold mb-2">
                    {category === '✨ For You'
                        ? "No Saved Articles Yet"
                        : "No Articles Found"
                    }
                </h3>
                <p>
                    {category === '✨ For You'
                        ? "Click the `⭐` icon on an article to save it for later."
                        : "Try a different category or search term."
                    }
                </p>
            </div>
        );
    }

    return (
        <>
            <div className={cardLayoutClasses}>
                <AnimatePresence>
                    {articles.map((article, index) => (
                        <ArticleCard
                            key={article.url}
                            article={article}
                            ref={index === articles.length - 1 ? lastArticleRef : null}
                        />
                    ))}
                </AnimatePresence>
            </div>
            {isFetchingNextPage && (
                <div className="text-center py-6">
                    <p>Loading more articles...</p>
                </div>
            )}
            {!hasNextPage && articles.length > 0 && category !== '✨ For You' && (
                <div className="text-center py-10 text-gray-500">
                    <p>You've reached the end of the results.</p>
                </div>
            )}
        </>
    );
};

export default NewsGrid;

