
import React from 'react';
import { menuData } from '../constants';
import type { MenuItem } from '../types';
import MenuItemCard from './MenuItemCard';

interface MenuProps {
    onAddToCart: (item: MenuItem, selectedOptionKey: string | undefined) => void;
    t: any;
}

const Menu: React.FC<MenuProps> = ({ onAddToCart, t }) => {
    return (
        <div id="menu" className="space-y-8">
            {menuData.map(category => (
                <div key={category.categoryKey} className="menu-category">
                    <h2 className="text-2xl font-bold mb-4">{t.menu[category.categoryKey]}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.items.map(item => (
                            <MenuItemCard key={item.nameKey} item={item} onAddToCart={onAddToCart} t={t} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Menu;
