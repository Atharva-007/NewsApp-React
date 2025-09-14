import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

const apiClient = axios.create({
    baseURL: BASE_URL,
    params: {
        apiKey: API_KEY,
    },
});

const transformArticle = (article) => ({
    source: article.source,
    author: article.author,
    title: article.title,
    description: article.description,
    url: article.url,
    urlToImage: article.urlToImage,
    publishedAt: article.publishedAt,
    content: article.content,
});

export const fetchNews = async ({ category, searchQuery, page = 1 }) => {
    if (!API_KEY) {
        throw new Error("News API Key is not configured. Please add it to your environment variables.");
    }

    try {
        const params = {
            pageSize: 12,
            page,
        };

        let endpoint = '/top-headlines';

        if (searchQuery) {
            endpoint = '/everything';
            params.q = searchQuery;
        } else if (category && category !== '✨ For You') {
            params.category = category;
            params.country = 'us';
        } else {
            // Default to general if no specific category or search
            params.category = 'general';
            params.country = 'us';
        }

        const response = await apiClient.get(endpoint, { params });

        const articles = response.data.articles
            .filter(article => article.title && article.title !== "[Removed]")
            .map(transformArticle);

        const totalResults = response.data.totalResults;
        const nextPage = (page * params.pageSize) < totalResults ? page + 1 : null;

        return { articles, nextPage };

    } catch (error) {
        console.error("Error fetching news:", error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch news. Please check your API key and network connection.');
    }
};

