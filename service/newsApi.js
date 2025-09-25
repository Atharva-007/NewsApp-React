import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://api.thenewsapi.com/v1/news';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
    },
});

// Map categories to The News API format
const categoryMapping = {
    'general': 'general',
    'business': 'business',
    'entertainment': 'entertainment',
    'health': 'health',
    'science': 'science',
    'sports': 'sports',
    'technology': 'tech',
    '✨ For You': 'general'
};

const transformArticle = (article) => {
    // Ensure article is valid before transformation
    if (!article || typeof article !== 'object') {
        return null;
    }

    return {
        source: { name: article.source || 'Unknown' },
        author: article.author || 'Unknown',
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        url: article.url || '#',
        urlToImage: article.image_url || null,
        publishedAt: article.published_at || new Date().toISOString(),
        content: article.snippet || article.description || 'No content available',
    };
};

export const fetchNews = async ({ category, searchQuery, page = 1 }) => {
    if (!API_KEY) {
        throw new Error("News API Key is not configured. Please add it to your environment variables.");
    }

    try {
        const params = {
            limit: 12,
            page: page,
            language: 'en',
        };

        let endpoint = '/top';

        if (searchQuery) {
            endpoint = '/all';
            params.search = searchQuery;
        } else if (category && category !== '✨ For You') {
            const mappedCategory = categoryMapping[category.toLowerCase()] || 'general';
            params.categories = mappedCategory;
            params.locale = 'us';
        } else {
            // Default to general news
            params.categories = 'general';
            params.locale = 'us';
        }

        const response = await apiClient.get(endpoint, { params });

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format from The News API');
        }

        const articles = response.data.data
            .filter(article => article && article.title && article.title !== "[Removed]")
            .map(transformArticle)
            .filter(article => article !== null); // Remove any null transformations

        // The News API doesn't provide total results, so we estimate based on current page
        const hasNextPage = articles.length === params.limit;
        const nextPage = hasNextPage ? page + 1 : null;

        return { articles, nextPage };

    } catch (error) {
        console.error("Error fetching news:", error);

        if (error.response?.status === 401) {
            throw new Error('Invalid API key. Please check your The News API key.');
        }

        if (error.response?.status === 429) {
            throw new Error('API rate limit exceeded. Please try again later.');
        }

        if (error.response?.data?.error) {
            throw new Error(error.response.data.error.message || error.response.data.error);
        }

        throw new Error('Failed to fetch news. Please check your API key and network connection.');
    }
};

