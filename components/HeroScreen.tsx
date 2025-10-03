
import React from 'react';
import type { Language } from '../App';

interface HeroScreenProps {
    onStartOrder: (lang: Language) => void;
    t: any;
}

const HeroScreen: React.FC<HeroScreenProps> = ({ onStartOrder, t }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tight">Java Joy</h1>
                <p className="text-lg md:text-xl text-gray-600" style={{fontFamily: "'Roboto Slab', serif"}}>
                    {t.heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => onStartOrder('pt')} className="vintage-btn py-3 px-10 rounded-lg font-semibold text-lg">
                        {t.startOrderPT}
                    </button>
                    <button onClick={() => onStartOrder('en')} className="vintage-btn py-3 px-10 rounded-lg font-semibold text-lg">
                        {t.startOrderEN}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroScreen;
