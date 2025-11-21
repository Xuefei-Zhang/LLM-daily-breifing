
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getBriefingPrompt = () => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
Subject: Your LLM Daily Briefing - ${today}

Hi there,

Here is your daily briefing on the most significant and trending topics in the world of Large Language Models (LLM) for today.

---

### 🚀 Top Trending GitHub Repositories

*Instructions: Find 3-5 of the most popular or rapidly gaining traction LLM-related repositories on GitHub today. For each, provide its name, a link, and a concise one-sentence description.*
- [Repo Name](link) - Brief, one-sentence description of what it does.
- [Repo Name](link) - Brief, one-sentence description of what it does.
- [Repo Name](link) - Brief, one-sentence description of what it does.

### 🤗 Hugging Face Highlights (Models & Papers)

*Instructions: Identify 3-5 trending or newly released models, datasets, or papers on Hugging Face that are generating buzz. Explain their significance briefly.*
- [Model/Paper Name](link) - Briefly explain its significance or what's new.
- [Model/Paper Name](link) - Briefly explain its significance or what's new.
- [Model/Paper Name](link) - Briefly explain its significance or what's new.

### 📰 Must-Read Articles & Blog Posts

*Instructions: Discover 3-5 insightful and recent articles or blog posts about LLMs from top AI labs, researchers, or tech publications. Provide the title, link, author/publication, and a key takeaway.*
- [Article Title](link) - Author/Publication - Key takeaway in one sentence.
- [Article Title](link) - Author/Publication - Key takeaway in one sentence.
- [Article Title](link) - Author/Publication - Key takeaway in one sentence.

---

Best,
Your AI Assistant
  `;
};

export const generateBriefing = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: getBriefingPrompt(),
      config: {
        systemInstruction: `You are an expert AI researcher and content curator. Your task is to generate a concise daily briefing on the most significant and trending topics in the world of Large Language Models (LLM) for today. You must follow the format and instructions provided in the user's prompt exactly. The output must be in Markdown format, suitable for an email. Ensure all links are functional and the information is as current as possible.`
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating briefing from Gemini:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
