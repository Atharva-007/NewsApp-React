# NewsApp React

A modern, responsive news application built with React, Vite, and The News API. Features a clean interface with dark mode, category filtering, search functionality, and responsive design.

## 🚀 Features

- **Latest News**: Fetches the latest news from The News API
- **Category Filtering**: Browse news by categories (General, Business, Technology, Sports, etc.)
- **Search Functionality**: Search for specific topics or keywords
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Enhanced user experience with Framer Motion
- **Error Handling**: Graceful error handling and loading states

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- The News API key from [thenewsapi.com](https://www.thenewsapi.com/)

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd NewsApp-React
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Get your API key from [The News API Dashboard](https://www.thenewsapi.com/account/dashboard)
   - Add your API key to the `.env` file:
   ```bash
   VITE_NEWS_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🌐 Deployment

### Vercel Deployment

This project is optimized for Vercel deployment:

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Add environment variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_NEWS_API_KEY` with your The News API key
4. **Deploy**: Vercel will automatically build and deploy your app

### Environment Variables for Production

Make sure to set the following environment variable in your deployment platform:

```bash
VITE_NEWS_API_KEY=your_the_news_api_key_here
```

## 📁 Project Structure

```
NewsApp-React/
├── public/
├── src/
│   ├── components/          # React components
│   ├── stores/             # Zustand state management
│   ├── hooks/              # Custom React hooks
│   ├── assets/             # Static assets
│   └── App.jsx             # Main app component
├── service/
│   └── newsApi.js          # API service layer
├── .env.example            # Environment variables template
├── vercel.json             # Vercel deployment configuration
└── vite.config.js          # Vite configuration
```

## 🔑 API Integration

This app uses [The News API](https://www.thenewsapi.com/) which provides:

- **Free Tier**: 100 requests per day
- **Comprehensive Coverage**: News from multiple sources worldwide
- **Categories**: General, Business, Technology, Sports, Health, Science, Entertainment
- **Search**: Full-text search capabilities
- **Real-time**: Latest news updates

## 🎨 Customization

- **Themes**: Modify colors in `tailwind.config.js`
- **Categories**: Update category mappings in `service/newsApi.js`
- **Layout**: Customize components in `src/components/`
- **State**: Manage app state in `src/stores/useNewsStore.js`

## 🐛 Troubleshooting

**Build Errors:**
- Ensure you have Node.js 18+
- Delete `node_modules` and run `npm install`
- Check that all environment variables are set correctly

**API Errors:**
- Verify your API key is correct and active
- Check your API usage limits
- Ensure your API key has the correct permissions

**Deployment Issues:**
- Make sure environment variables are set in your deployment platform
- Check build logs for specific error messages
- Verify that your API key works in production

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
