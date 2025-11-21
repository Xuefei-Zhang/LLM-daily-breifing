
import React, { useState } from 'react';
import { Rss, Trash, Plus, ChevronDown, ChevronUp } from './Icons';

interface RSSManagerProps {
  feeds: string[];
  onUpdateFeeds: (newFeeds: string[]) => void;
}

const RSSManager: React.FC<RSSManagerProps> = ({ feeds, onUpdateFeeds }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeedUrl && !feeds.includes(newFeedUrl)) {
      onUpdateFeeds([...feeds, newFeedUrl]);
      setNewFeedUrl('');
    }
  };

  const handleRemoveFeed = (urlToRemove: string) => {
    onUpdateFeeds(feeds.filter(url => url !== urlToRemove));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 text-left transition-colors"
      >
        <div className="flex items-center text-indigo-300">
          <Rss className="h-5 w-5 mr-3" />
          <span className="font-semibold">Manage RSS Sources</span>
          <span className="ml-3 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
            {feeds.length} Active
          </span>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-700 bg-gray-900/30">
          <form onSubmit={handleAddFeed} className="flex gap-2 mb-4">
            <input
              type="url"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="https://site.com/feed.xml"
              className="flex-1 bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 placeholder-gray-500"
              required
            />
            <button 
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {feeds.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-2">No feeds added yet.</p>
            ) : (
              feeds.map((feed, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700 group hover:border-indigo-500/30 transition-colors">
                  <span className="text-sm text-gray-300 truncate max-w-[85%]" title={feed}>
                    {feed}
                  </span>
                  <button
                    onClick={() => handleRemoveFeed(feed)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Remove feed"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Note: Gemini will prioritize content from these feeds when generating your briefing.
          </p>
        </div>
      )}
    </div>
  );
};

export default RSSManager;
