import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import './App.css'
import FullscreenModal from './components/FullscreenModal'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedArticles, setSavedArticles] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [fullscreenArticle, setFullscreenArticle] = useState(null)
  const [sourceFilter, setSourceFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const observer = useRef()

  // You'll need to get a free API key from newsapi.org
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY
  const BASE_URL = 'https://newsapi.org/v2'

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'sports', label: 'Sports' },
    { value: 'health', label: 'Health' },
    { value: 'science', label: 'Science' },
    { value: 'entertainment', label: 'Entertainment' }
  ]

  // Load saved articles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('newsapp_saved')
    if (saved) {
      setSavedArticles(JSON.parse(saved))
    }
  }, [])

  // Dark mode initialization
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('newsapp_darkmode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Load theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('newsapp_darkmode', JSON.stringify(darkMode))
  }, [darkMode])

  // Intersection Observer for infinite scroll
  const lastArticleRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading])

  const fetchNews = async (cat = category, query = '', append = false) => {
    setLoading(true)
    setError(null)

    try {
      const endpoint = query
        ? `${BASE_URL}/everything?q=${query}&page=${page}&apiKey=${API_KEY}&pageSize=10`
        : `${BASE_URL}/top-headlines?category=${cat}&page=${page}&apiKey=${API_KEY}&pageSize=10`

      const response = await axios.get(endpoint)
      const newArticles = response.data.articles || []

      setNews(prevNews =>
        append ? [...prevNews, ...newArticles] : newArticles
      )
    } catch (err) {
      setError('Failed to fetch news. Please check your API key and try again.')
      console.error('Error fetching news:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (API_KEY === 'YOUR_NEWSAPI_KEY_HERE') {
      setError('Please add your NewsAPI key to the API_KEY constant in App.jsx')
      setLoading(false)
    } else {
      setPage(1) // Reset page when category changes
      fetchNews()
    }
  }, [category])

  useEffect(() => {
    if (page > 1) {
      fetchNews(category, searchQuery, true)
    }
  }, [page])

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    setSearchQuery('')
    setPage(1)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setPage(1)
      fetchNews(null, searchQuery.trim(), false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setPage(1)
    fetchNews()
  }

  const saveArticle = (article) => {
    const newSaved = [...savedArticles, article]
    setSavedArticles(newSaved)
    localStorage.setItem('newsapp_saved', JSON.stringify(newSaved))
  }

  const removeSavedArticle = (url) => {
    const newSaved = savedArticles.filter(item => item.url !== url)
    setSavedArticles(newSaved)
    localStorage.setItem('newsapp_saved', JSON.stringify(newSaved))
  }

  const isSaved = (url) => {
    return savedArticles.some(item => item.url === url)
  }

  const shareArticle = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      })
    } else {
      navigator.clipboard.writeText(`${article.title}\n${article.description}\n${article.url}`)
      alert('Link copied to clipboard!')
    }
  }

  const openFullscreen = (article) => {
    setFullscreenArticle(article)
    setShowFullscreen(true)
  }

  const closeFullscreen = () => {
    setShowFullscreen(false)
    setFullscreenArticle(null)
  }

  const handleToggleSave = (article) => {
    if (isSaved(article.url)) {
      removeSavedArticle(article.url)
    } else {
      saveArticle(article)
    }
  }

  const filteredNews = news.filter(article => {
    if (sourceFilter && !article.source.name.toLowerCase().includes(sourceFilter.toLowerCase())) {
      return false
    }
    if (dateFilter && article.publishedAt.split('T')[0] !== dateFilter) {
      return false
    }
    return true
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-black'}`}>
      <AnimatePresence>
        {showFullscreen && (
          <FullscreenModal
            fullscreenArticle={fullscreenArticle}
            darkMode={darkMode}
            onClose={closeFullscreen}
            onShare={shareArticle}
            onToggleSave={handleToggleSave}
            isSaved={isSaved}
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`shadow-lg transition-all duration-300 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">📰 NewsApp</h1>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-300 ${darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>
          </div>

          {/* Search and Advanced Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-1 gap-3">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-focus transition-all duration-300"
              >
                🔍 Search
              </motion.button>
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSearch}
                  className="bg-neutral text-white px-6 py-3 rounded-lg hover:bg-neutral-focus transition-all duration-300"
                >
                  🗑️ Clear
                </motion.button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Source:</label>
              <input
                type="text"
                placeholder="Filter by source"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className={`px-3 py-2 rounded-md border transition-all duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Date:</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`px-3 py-2 rounded-md border transition-all duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSourceFilter('')
                setDateFilter('')
              }}
              className="bg-error text-white px-4 py-2 rounded-md hover:bg-error-focus transition-colors"
            >
              Clear Filters
            </motion.button>
          </div>

          {/* Categories */}
          <motion.div
            className="flex flex-wrap gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${category === cat.value
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : `${darkMode ? 'bg-neutral hover:bg-neutral-focus' : 'bg-gray-200 hover:bg-gray-300'} text-gray-700`
                  }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`rounded-xl p-6 mb-8 border-2 shadow-lg ${darkMode
                ? 'bg-red-900 bg-opacity-50 border-red-700 text-red-300'
                : 'bg-red-50 border-red-200 text-red-800'
                }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <strong className="text-lg">Error:</strong>
              </div>
              <p className="mt-2">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Articles Section */}
        {savedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-2xl">⭐</motion.span>
              <h2 className="text-2xl font-bold">Saved Articles ({savedArticles.length})</h2>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {savedArticles.map((article) => (
                <motion.article
                  key={`saved-${article.url}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300`}
                >
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                      {article.title}
                    </h3>
                    <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {article.description || 'No description available.'}
                    </p>
                    <div className="flex justify-between items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openFullscreen(article)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors"
                      >
                        📖 Read Full
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleSave(article)}
                        className={`px-4 py-2 rounded-lg transition-colors text-white ${isSaved(article.url)
                          ? 'bg-error hover:bg-error-focus'
                          : 'bg-warning hover:bg-warning-focus'
                          }`}
                      >
                        {isSaved(article.url) ? '⭐ Unsave' : '⭐ Save'}
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent absolute top-2 left-2"></motion.div>
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-xl font-semibold">Fetching fresh news...</motion.span>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredNews.map((article, index) => (
                <motion.article
                  key={article.url}
                  ref={index === filteredNews.length - 1 ? lastArticleRef : null}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                  {article.urlToImage && (
                    <div className="relative overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => shareArticle(article)}
                          className="bg-success bg-opacity-90 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        >
                          🔗
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleSave(article)}
                          className={`p-2 rounded-full transition-all duration-200 ${isSaved(article.url)
                            ? 'bg-error bg-opacity-90 hover:bg-opacity-100 text-white'
                            : 'bg-warning bg-opacity-90 hover:bg-opacity-100 text-white'
                            }`}
                        >
                          {isSaved(article.url) ? '★' : '☆'}
                        </motion.button>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h2
                      className={`text-xl font-bold mb-3 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      onClick={() => openFullscreen(article)}
                    >
                      {article.title}
                    </h2>
                    <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                      {article.description || 'No description available.'}
                    </p>

                    <div className={`flex justify-between items-center text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      <span className="font-medium">{article.source.name}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openFullscreen(article)}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-lg hover:from-primary-focus hover:to-secondary-focus transition-all duration-300 font-medium"
                      >
                        📖 Full View
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-success text-white px-4 py-2.5 rounded-lg hover:bg-success-focus transition-all duration-300 font-medium"
                      >
                        🌐 Read
                      </motion.a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredNews.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-2xl font-bold mb-4">No News Found</h3>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your search or filters to find more articles.
            </p>
          </motion.div>
        )}
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`py-12 mt-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
                <span className="text-3xl">📰</span> NewsApp
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Stay informed with the latest news from around the world.
                Powered by cutting-edge technology and trusted sources.
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✅</span> Live News Updates
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-blue-400">✅</span> Multiple Categories
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-yellow-400">✅</span> Saved Articles
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-purple-400">✅</span> Dark Mode
                </li>
              </ul>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <p className="text-gray-300">📧 newsapp@example.com</p>
                <p className="text-gray-300">📱 +1 (555) 123-4567</p>
                <p className="text-gray-300">📍 Worldwide Coverage</p>
              </div>
              <div className="flex justify-center md:justify-end gap-4 mt-6">
                <a href="#" className="text-2xl hover:scale-110 transition-transform duration-200">🌐</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform duration-200">🐦</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform duration-200">📘</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 NewsApp. Powered by <span className="font-semibold text-blue-400">NewsAPI.org</span>
              <br />
              <span className="text-sm">Made with ❤️ using React & Tailwind CSS</span>
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="text-2xl">⬆️</span>
        </motion.button>
      </motion.footer>
    </div>
  )
}

export default App
