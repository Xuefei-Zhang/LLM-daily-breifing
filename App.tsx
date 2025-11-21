
import React, { useState, useCallback } from 'react';
import { generateBriefing, BriefingData } from './services/geminiService';
import { getRSSContext } from './services/rssService';
import Header from './components/Header';
import BriefingCard from './components/BriefingCard';
import Loader from './components/Loader';
import RSSManager from './components/RSSManager';
import { Bot, Sparkles, AlertTriangle } from './components/Icons';

const DEFAULT_FEEDS = [
  'https://openai.com/blog/rss.xml',
  'https://huggingface.co/blog/feed.xml',
  'https://simonwillison.net/atom/entries/',
  'https://aws.amazon.com/blogs/machine-learning/feed/'
];

const App: React.FC = () => {
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [rssFeeds, setRssFeeds] = useState<string[]>(DEFAULT_FEEDS);

  const handleGenerateBriefing = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBriefingData(null);
    
    try {
      // Step 1: Fetch RSS Data
      setLoadingStatus("Fetching latest RSS feeds...");
      const rssContext = await getRSSContext(rssFeeds);

      // Step 2: Generate Briefing with Context
      setLoadingStatus("Consulting Gemini...");
      const data = await generateBriefing(rssContext);
      
      setBriefingData(data);
    } catch (err) {
      setError('Failed to generate briefing. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  }, [rssFeeds]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        <main className="mt-8">
          <RSSManager feeds={rssFeeds} onUpdateFeeds={setRssFeeds} />

          <div className="text-center">
            <button
              onClick={handleGenerateBriefing}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingStatus || "Processing..."}
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-6 w-6" />
                  Generate Today's LLM Briefing
                </>
              )}
            </button>
          </div>

          <div className="mt-10">
            {isLoading && <Loader />}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center" role="alert">
                <AlertTriangle className="h-6 w-6 mr-3" />
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {briefingData && <BriefingCard data={briefingData} />}
            {!isLoading && !briefingData && !error && (
              <div className="text-center text-gray-400 mt-16 flex flex-col items-center">
                <Bot className="h-24 w-24 text-indigo-500 mb-4" />
                <h2 className="text-2xl font-semibold">Welcome to your LLM Daily Briefing</h2>
                <p className="mt-2 max-w-xl">
                  Click the button above to get the latest trending LLM blogs, GitHub repos, Hugging Face models, and more, compiled by Gemini into a ready-to-send email format.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
