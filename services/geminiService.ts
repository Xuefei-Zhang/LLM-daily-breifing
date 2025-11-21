
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface BriefingData {
  text: string;
  sources: { title: string; url: string }[];
}

const getBriefingPrompt = (rssContext: string) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
Current Date: ${today}

Task: Generate a daily briefing email about the latest Large Language Model (LLM) and AI trends.
You MUST use the Google Search tool to find real, up-to-date information.

${rssContext}

Step 1: Search for "trending github AI repositories this week" and "latest trending LLM open source projects".
Step 2: Search for "Hugging Face trending models papers ${today}" or recent days.
Step 3: Search for "latest AI LLM news ${today}".
Step 4: Review the provided RSS FEED content (if any) and integrate the most interesting articles.

Step 5: Compile the results into the following Markdown format:

Subject: Your LLM Daily Briefing - ${today}

Hi there,

Here are the latest updates from the world of AI.

### 🚀 Top Trending GitHub Repositories
(List 3-5 REAL repositories found in search. Ensure links start with https://github.com/. If exact "today" trends are unclear, use "this week".)
- [Repo Name](https://github.com/...) - Description

### 🤗 Hugging Face Highlights
(List 3-5 REAL models or papers. Ensure links start with https://huggingface.co/.)
- [Name](https://huggingface.co/...) - Description

### 📰 Must-Read Articles & Feed Highlights
(List 3-5 REAL articles from Google Search OR the RSS feeds provided above.)
- [Title](URL) - Source - Summary

---
Best,
Your AI Assistant
  `;
};

export const generateBriefing = async (rssContext: string = ''): Promise<BriefingData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: getBriefingPrompt(rssContext),
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are an expert AI researcher. Your goal is to provide a factual, sourced daily briefing.
        CRITICAL:
        1. Verify every URL. Do not guess URLs.
        2. For GitHub, only include repositories that are actually trending or highly active recently.
        3. If search results are sparse for "today", look for "this week".
        4. Prioritize quality content from the user's RSS feeds in the Articles section if available.
        5. The output must be valid Markdown.`
      }
    });

    const text = response.text || "No content generated.";
    
    const sources: { title: string; url: string }[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach(chunk => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source",
            url: chunk.web.uri || "#"
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Error generating briefing from Gemini:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
