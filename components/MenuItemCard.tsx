
import React, { useState } from 'react';
import type { MenuItem } from '../types';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: (item: MenuItem, selectedOptionKey: string | undefined) => void;
    t: any;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, t }) => {
    const [selectedOptionKey, setSelectedOptionKey] = useState<string | undefined>(item.options?.default);

    const handleAddToCartClick = () => {
        onAddToCart(item, selectedOptionKey);
    };
    
    const description = t.menu[item.descriptionKey];

    return (
        <div className="menu-card p-4 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{t.menu[item.nameKey]}</h3>
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                    <p className="font-semibold mt-1">R${item.price}</p>
                </div>
                <button 
                    className="add-to-cart-btn bg-amber-100 text-amber-800 w-10 h-10 rounded-lg text-2xl font-bold hover:bg-amber-200 transition-colors flex-shrink-0"
                    onClick={handleAddToCartClick}
                    aria-label={`Add ${t.menu[item.nameKey]} to cart`}
                >
                    {t.addToCart}
                </button>
            </div>
            {item.options && (
                <div className="mt-4 pt-2 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">{t.menu[item.options.titleKey]}</h4>
                    <div className="flex gap-4">
                        {item.options.items.map(option => (
                            <label key={option.nameKey} className="flex items-center text-sm cursor-pointer">
                                <input 
                                    type="radio" 
                                    name={`${item.nameKey}-option`} 
                                    value={option.nameKey}
                                    checked={selectedOptionKey === option.nameKey}
                                    onChange={(e) => setSelectedOptionKey(e.target.value)}
                                    className="mr-2"
                                />
                                {t.menu[option.nameKey]} {option.price > 0 && `(+R$${option.price})`}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuItemCard;
