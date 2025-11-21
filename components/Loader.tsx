
import React from 'react';
import { Bot } from './Icons';

const Loader: React.FC = () => {
  const messages = [
    "Contacting AI experts...",
    "Scanning GitHub for trending repos...",
    "Checking Hugging Face for new models...",
    "Curating the best articles...",
    "Compiling your briefing...",
  ];
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-75 animate-ping"></div>
        <Bot className="relative h-20 w-20 text-indigo-300" />
      </div>
      <p className="mt-6 text-lg font-medium text-gray-300 transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default Loader;
