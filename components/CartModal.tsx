
import React from 'react';
import type { Cart, CartItem } from '../types';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: Cart;
    onQuantityChange: (itemId: string, change: number) => void;
    onCheckout: () => void;
    totalPrice: number;
    t: any;
    isSubmitting: boolean;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart, onQuantityChange, onCheckout, totalPrice, t, isSubmitting }) => {
    const cartItems = Object.values(cart);
    const hasItems = cartItems.length > 0;

    return (
        <>
            <div 
                className={`modal-overlay fixed inset-0 bg-black bg-opacity-50 z-40 ${isOpen ? '' : 'hidden'}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            ></div>
            <div 
                className={`cart-modal fixed top-0 right-0 h-full w-full max-w-sm shadow-xl z-50 p-6 flex flex-col ${isOpen ? '' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-title"
                style={{visibility: isOpen ? 'visible' : 'hidden'}}
            >
                <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                    <h2 id="cart-title" className="text-3xl font-bold">{t.cartTitle}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-4xl" aria-label="Close cart">&times;</button>
                </div>
                <div className="space-y-4 mb-4 flex-grow overflow-y-auto">
                    {hasItems ? (
                        cartItems.map((item: CartItem) => (
                            <div key={item.id} className="cart-item flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{t.menu[item.nameKey]}</p>
                                    {item.optionNameKey && (
                                        <p className="text-sm text-gray-500">
                                            ({t.menu[item.optionNameKey]})
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">R${item.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="quantity-change-btn bg-gray-200 w-6 h-6 rounded-full" onClick={() => onQuantityChange(item.id, -1)} aria-label={`Decrease quantity of ${t.menu[item.nameKey]}`}>-</button>
                                    <span aria-live="polite">{item.quantity}</span>
                                    <button className="quantity-change-btn bg-gray-200 w-6 h-6 rounded-full" onClick={() => onQuantityChange(item.id, 1)} aria-label={`Increase quantity of ${t.menu[item.nameKey]}`}>+</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">{t.cartEmpty}</p>
                    )}
                </div>
                <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>{t.total}</span>
                        <span>R${totalPrice.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={onCheckout}
                        className="w-full vintage-btn py-3 mt-4 rounded-lg font-semibold text-lg" 
                        disabled={!hasItems || isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : t.checkout}
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartModal;
