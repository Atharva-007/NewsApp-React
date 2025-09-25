import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNews } from '../../service/newsApi';
import { useNewsStore } from '../stores/useNewsStore'; // Corrected path

/**
 * Custom hook to fetch and manage news data using TanStack Query.
 */
export const useNewsData = () => {
    const { category, searchQuery } = useNewsStore(state => ({
        category: state.category || 'general',
        searchQuery: state.searchQuery || '',
    }));

    // Ensure stable query key by normalizing values
    const normalizedCategory = typeof category === 'string' ? category : 'general';
    const normalizedSearchQuery = typeof searchQuery === 'string' ? searchQuery.trim() : '';

    return useInfiniteQuery({
        queryKey: ['news', { category: normalizedCategory, searchQuery: normalizedSearchQuery }],
        queryFn: ({ pageParam = 1 }) => {
            try {
                return fetchNews({
                    category: normalizedCategory,
                    searchQuery: normalizedSearchQuery,
                    page: pageParam
                });
            } catch (error) {
                console.error('Error in queryFn:', error);
                throw error;
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage || null,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Enable when there's a search query (any category) or when category is not "For You".
        enabled: (normalizedSearchQuery !== '') || normalizedCategory !== '✨ For You',
    });
};

