import React from 'react';
import { CART_VALUE_TARGET } from '../constants';

interface FloatingCartButtonProps {
    totalItems: number;
    totalPrice: number;
    onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ totalItems, totalPrice, onClick }) => {
    const fillPercentage = Math.min(totalPrice / CART_VALUE_TARGET, 1);
    const iconColorClass = fillPercentage > 0.4 ? 'text-white' : 'text-gray-800';

    return (
        <button 
            onClick={onClick}
            className="bottom-8 right-8 z-50 w-20 h-20 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200"
            aria-label={`View cart, ${totalItems} items`}
        >
            <div 
                className="circle-fill absolute bottom-0 left-0 w-full h-full"
                style={{ transform: `scaleY(${fillPercentage})` }}
            ></div>
            <div className="relative z-10 w-10 h-10 flex items-center justify-center">
                {fillPercentage >= 1 && (
                    <svg className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path className="steam-path" d="M 8,20 C 8,15 12,15 12,10 S 8,5 8,0"></path>
                        <path className="steam-path steam-path-2" d="M 16,20 C 16,15 20,15 20,10 S 16,5 16,0"></path>
                    </svg>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 transition-colors duration-500 ${iconColorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                </svg>
            </div>
            {totalItems > 0 && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-20">
                    {totalItems}
                </span>
            )}
        </button>
    );
};

export default FloatingCartButton;