import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNews } from '../../service/newsApi';
import { useNewsStore } from '../stores/useNewsStore'; // Corrected path

/**
 * Custom hook to fetch and manage news data using TanStack Query.
 */
export const useNewsData = () => {
    const { category, searchQuery } = useNewsStore(state => ({
        category: state.category,
        searchQuery: state.searchQuery,
    }));

    return useInfiniteQuery({
        queryKey: ['news', { category, searchQuery }],
        queryFn: ({ pageParam = 1 }) => fetchNews({ category, searchQuery, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        // Enable when there's a search query (any category) or when category is not "For You".
        enabled: (searchQuery && searchQuery.trim() !== '') || category !== '✨ For You',
    });
};

