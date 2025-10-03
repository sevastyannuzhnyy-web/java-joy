
import React, { useState } from 'react';
import type { DeliveryDetails } from '../types';

interface DeliveryOptionsScreenProps {
  onSelectPickup: () => void;
  onConfirmDelivery: (details: DeliveryDetails) => void;
  t: any;
}

const DeliveryOptionsScreen: React.FC<DeliveryOptionsScreenProps> = ({ onSelectPickup, onConfirmDelivery, t }) => {
  const [view, setView] = useState<'options' | 'form'>('options');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && location.trim()) {
      onConfirmDelivery({ name: name.trim(), location: location.trim() });
    }
  };

  if (view === 'form') {
    return (
      <div className="fixed inset-0 z-50 p-6 flex flex-col justify-center items-center bg-[#FDF8F2] animate-fadeIn">
        <div className="w-full max-w-md text-center">
            <h1 className="text-4xl font-bold mb-4">{t.deliveryDetailsTitle}</h1>
            <form onSubmit={handleConfirm} className="bg-white p-8 rounded-lg shadow-md space-y-4">
                <div>
                    <label htmlFor="name" className="block text-left font-semibold mb-1 text-gray-700">{t.nameLabel}</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-[#FFFBF5]"
                        required 
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-left font-semibold mb-1 text-gray-700">{t.locationLabel}</label>
                    <input 
                        type="text" 
                        id="location" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-[#FFFBF5]" 
                        required
                        aria-required="true"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!name.trim() || !location.trim()}
                    className="w-full vintage-btn py-3 mt-4 rounded-lg font-semibold text-lg"
                >
                    {t.confirmAndPay}
                </button>
            </form>
            <button onClick={() => setView('options')} className="mt-6 text-gray-600 font-semibold hover:underline">{t.goBack}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 p-6 flex flex-col justify-center items-center bg-[#FDF8F2] animate-fadeIn">
        <h1 className="text-4xl font-bold mb-8 text-center">{t.deliveryOrPickup}</h1>
        <div className="flex flex-col sm:flex-row gap-6">
            <button onClick={onSelectPickup} className="vintage-btn py-4 px-12 rounded-lg font-semibold text-2xl">
                {t.pickup}
            </button>
            <button onClick={() => setView('form')} className="vintage-btn py-4 px-12 rounded-lg font-semibold text-2xl">
                {t.delivery}
            </button>
        </div>
    </div>
  );
};

export default DeliveryOptionsScreen;