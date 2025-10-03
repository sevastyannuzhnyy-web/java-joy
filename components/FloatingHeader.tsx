
import React from 'react';
import type { Language } from '../App';

interface FloatingHeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
  totalItems: number;
  onCartClick: () => void;
  onHistoryClick: () => void;
}

const FloatingHeader: React.FC<FloatingHeaderProps> = ({ language, setLanguage, t, totalItems, onCartClick, onHistoryClick }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#FFFBF5] shadow-md p-3 flex justify-between items-center z-30 w-full border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800" style={{fontFamily: "'Lora', serif"}}>Java Joy</h1>
        <div className="flex items-center gap-4">
            <button onClick={onHistoryClick} className="relative transition-transform transform hover:scale-110" aria-label="View order history">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            </button>
            <button onClick={onCartClick} className="relative transition-transform transform hover:scale-110" aria-label={`View cart, ${totalItems} items`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </button>
            <button onClick={toggleLanguage} className="vintage-btn text-sm px-4 py-1 rounded-md">
                {t.changeLang}
            </button>
        </div>
      </div>
    </header>
  );
};

export default FloatingHeader;
