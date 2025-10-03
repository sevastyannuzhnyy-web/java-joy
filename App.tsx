
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Cart, MenuItem, CartItem, OrderHistoryEntry, OrderType, DeliveryDetails } from './types';
import { translations } from './constants';
import HeroScreen from './components/HeroScreen';
import Menu from './components/Menu';
import CartModal from './components/CartModal';
import PaymentScreen from './components/PaymentScreen';
import FloatingHeader from './components/FloatingHeader';
import OrderHistoryModal from './components/OrderHistoryModal';
import DeliveryOptionsScreen from './components/DeliveryOptionsScreen';

type Screen = 'hero' | 'main' | 'delivery_options' | 'payment';
export type Language = 'pt' | 'en';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('hero');
    const [language, setLanguage] = useState<Language>('pt');
    const [cart, setCart] = useState<Cart>({});
    const [isCartModalOpen, setCartModalOpen] = useState<boolean>(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string | number | null>(null);
    const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>([]);
    const [orderType, setOrderType] = useState<OrderType>('pickup');
    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | undefined>(undefined);
    const [lastOrderTotal, setLastOrderTotal] = useState<number>(0);
    
    const t = translations[language];

    const syncOrderHistory = useCallback(() => {
        if (typeof window === 'undefined') return;

        try {
            const raw = localStorage.getItem('jj_order_history');
            const parsed = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(parsed)) {
                setOrderHistory([]);
                return;
            }

            const normalized = parsed.map((entry) => ({
                id: entry.id,
                total: entry.total,
                payment_method: entry.payment_method,
                created_at: entry.created_at ?? entry.createdAt,
            })) as OrderHistoryEntry[];

            setOrderHistory(normalized);
        } catch (error) {
            console.error('Failed to load order history', error);
            setOrderHistory([]);
        }
    }, []);

    useEffect(() => {
        syncOrderHistory();
    }, [syncOrderHistory]);

    const handleStartOrder = (lang: Language) => {
        setLanguage(lang);
        setScreen('main');
    };

    const handleAddToCart = (item: MenuItem, selectedOptionKey: string | undefined) => {
        const option = item.options?.items.find(o => o.nameKey === selectedOptionKey);
        const finalPrice = item.price + (option?.price || 0);
        const id = selectedOptionKey ? `${item.nameKey}-${selectedOptionKey}` : item.nameKey;
    
        setCart(prevCart => {
            const existingItem = prevCart[id];
            if (existingItem) {
                return { ...prevCart, [id]: { ...existingItem, quantity: existingItem.quantity + 1 } };
            }
            return { ...prevCart, [id]: { id, nameKey: item.nameKey, price: finalPrice, quantity: 1, optionNameKey: selectedOptionKey } };
        });
    };

    const handleQuantityChange = (itemId: string, change: number) => {
        setCart(prevCart => {
            const existingItem = prevCart[itemId];
            if (!existingItem) return prevCart;

            const newQuantity = existingItem.quantity + change;
            if (newQuantity <= 0) {
                const { [itemId]: _, ...rest } = prevCart;
                return rest;
            }
            return { ...prevCart, [itemId]: { ...existingItem, quantity: newQuantity } };
        });
    };
    
    const cartTotals = useMemo(() => {
        return Object.values(cart).reduce((acc: { totalPrice: number, totalItems: number }, item: CartItem) => {
            acc.totalPrice += item.price * item.quantity;
            acc.totalItems += item.quantity;
            return acc;
        }, { totalPrice: 0, totalItems: 0 });
    }, [cart]);

    const handleCheckout = () => {
        setScreen('delivery_options');
        setCartModalOpen(false);
    };
    
    const handleSelectPickup = () => {
        setOrderType('pickup');
        setDeliveryDetails(undefined);
        setOrderId(null);
        setScreen('payment');
    };

    const handleConfirmDelivery = (details: DeliveryDetails) => {
        setOrderType('delivery');
        setDeliveryDetails(details);
        setOrderId(null);
        setScreen('payment');
    };
    
    const handleOrderSuccess = (payload: { orderId: string | number; total: number }) => {
        setOrderId(payload.orderId);
        setLastOrderTotal(payload.total);
        setCart({});
        syncOrderHistory();
    };

    const handleNewOrder = () => {
        setOrderId(null);
        setLastOrderTotal(0);
        setDeliveryDetails(undefined);
        setOrderType('pickup');
        setCart({});
        setScreen('main');
    };

    return (
        <>
            {screen === 'hero' && <HeroScreen onStartOrder={handleStartOrder} t={t} />}

            {screen === 'main' && (
                 <>
                    <FloatingHeader 
                        language={language} 
                        setLanguage={setLanguage} 
                        t={t}
                        totalItems={cartTotals.totalItems}
                        onCartClick={() => setCartModalOpen(true)}
                        onHistoryClick={() => setHistoryModalOpen(true)}
                    />
                    <div className="container mx-auto p-4 md:p-8 pt-20"> {/* Add padding-top for header */}
                        <header className="text-center mb-10 space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">Java Joy</h1>
                        </header>
                        <main className="w-full">
                            <Menu onAddToCart={handleAddToCart} t={t} />
                        </main>
                    </div>
                 </>
            )}
            
            <CartModal 
                isOpen={isCartModalOpen}
                onClose={() => setCartModalOpen(false)}
                cart={cart}
                onQuantityChange={handleQuantityChange}
                onCheckout={handleCheckout}
                totalPrice={cartTotals.totalPrice}
                t={t}
            />

            <OrderHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                orderHistory={orderHistory}
                t={t}
                language={language}
            />

            {screen === 'delivery_options' && (
                <DeliveryOptionsScreen
                    onSelectPickup={handleSelectPickup}
                    onConfirmDelivery={handleConfirmDelivery}
                    t={t}
                />
            )}

            {screen === 'payment' && (
                <PaymentScreen 
                    orderId={orderId}
                    cartItems={Object.values(cart)}
                    totalPrice={orderId ? lastOrderTotal : cartTotals.totalPrice}
                    onOrderSuccess={handleOrderSuccess}
                    onNewOrder={handleNewOrder}
                    t={t}
                    orderType={orderType}
                    deliveryDetails={deliveryDetails}
                />
            )}
        </>
    );
};

export default App;
