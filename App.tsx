
import React, { useState, useCallback } from 'react';
import { generateBriefing } from './services/geminiService';
import Header from './components/Header';
import BriefingCard from './components/BriefingCard';
import Loader from './components/Loader';
import { Bot, Sparkles, AlertTriangle } from './components/Icons';

const App: React.FC = () => {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateBriefing = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBriefing(null);
    try {
      const content = await generateBriefing();
      setBriefing(content);
    } catch (err) {
      setError('Failed to generate briefing. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
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
                  Generating...
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
            {briefing && <BriefingCard content={briefing} />}
            {!isLoading && !briefing && !error && (
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
