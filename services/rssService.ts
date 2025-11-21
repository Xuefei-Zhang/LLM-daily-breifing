
interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
}

interface RSSResponse {
  status: string;
  feed: {
    url: string;
    title: string;
  };
  items: RSSItem[];
}

// We use rss2json to avoid CORS issues in a purely frontend application
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

const fetchSingleFeed = async (url: string): Promise<string> => {
  try {
    const response = await fetch(`${RSS_TO_JSON_API}${encodeURIComponent(url)}`);
    const data: RSSResponse = await response.json();

    if (data.status !== 'ok') {
      console.warn(`Failed to parse feed: ${url}`);
      return '';
    }

    // Get the top 3 items
    const recentItems = data.items.slice(0, 3).map(item => {
      return `- [${data.feed.title}] ${item.title}: ${item.link} (Published: ${item.pubDate})`;
    }).join('\n');

    return recentItems;
  } catch (error) {
    console.error(`Error fetching feed ${url}:`, error);
    return '';
  }
};

export const getRSSContext = async (urls: string[]): Promise<string> => {
  if (!urls || urls.length === 0) return '';

  // Fetch all feeds in parallel
  const results = await Promise.allSettled(urls.map(url => fetchSingleFeed(url)));

  const contextParts: string[] = [];

  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value) {
      contextParts.push(result.value);
    }
  });

  if (contextParts.length === 0) return '';

  return `
HEADLINES FROM SUBSCRIBED RSS FEEDS:
The following are recent articles from the user's subscribed RSS feeds. 
Use this information to populate the "Must-Read Articles" section or "Latest News" if the content is high quality and relevant.

${contextParts.join('\n\n')}
`;
};
