
import React from 'react';
import { BotMessageSquare } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center text-center border-b-2 border-indigo-500/30 pb-4">
      <BotMessageSquare className="h-10 w-10 text-indigo-400 mr-4" />
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          LLM Daily Briefing
        </h1>
        <p className="text-indigo-300 text-lg mt-1">
          Your daily dose of AI trends, powered by Gemini
        </p>
      </div>
    </header>
  );
};

export default Header;
