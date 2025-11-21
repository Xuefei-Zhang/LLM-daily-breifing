
import React, { useState, useEffect } from 'react';
import { Check, Copy } from './Icons';

// A lightweight markdown parser
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  const renderLine = (line: string, index: number) => {
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-indigo-300">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b border-gray-600 pb-2">{line.substring(3)}</h2>;
    }
    if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-extrabold mt-8 mb-4 border-b-2 border-indigo-500 pb-3">{line.substring(2)}</h1>;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
       const content = line.substring(2);
       // Regex to find markdown links: [text](url)
       const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
       const parts = [];
       let lastIndex = 0;
       let match;

       while ((match = linkRegex.exec(content)) !== null) {
         if (match.index > lastIndex) {
           parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex, match.index)}</span>);
         }
         parts.push(
           <a key={`link-${lastIndex}`} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline transition-colors">
             {match[1]}
           </a>
         );
         lastIndex = linkRegex.lastIndex;
       }

       if (lastIndex < content.length) {
         parts.push(<span key={`text-end-${lastIndex}`}>{content.substring(lastIndex)}</span>);
       }
       
      return <li key={index} className="ml-5 list-disc text-gray-300 leading-relaxed">{parts}</li>;
    }
    if (line.trim() === '---') {
      return <hr key={index} className="my-6 border-gray-600" />;
    }
    return <p key={index} className="text-gray-300 leading-relaxed my-2">{line}</p>;
  };
  
  return (
    <div>
      {lines.map(renderLine)}
    </div>
  );
};


const BriefingCard: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="bg-gray-800 border border-indigo-500/30 rounded-lg shadow-2xl p-6 sm:p-8 relative transition-all duration-500 ease-in-out transform animate-fade-in">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Copy to clipboard"
      >
        {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5 text-gray-300" />}
      </button>
      
      <div className="prose prose-invert max-w-none prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline">
         <SimpleMarkdown text={content} />
      </div>

       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BriefingCard;
