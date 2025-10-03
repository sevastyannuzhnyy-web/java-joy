
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Cart, MenuItem, CartItem, OrderHistoryEntry, OrderType, DeliveryDetails } from './types';
import { createOrder } from './src/lib/createOrder';
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
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>([]);
    const [orderType, setOrderType] = useState<OrderType>('pickup');
    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const isSubmittingRef = useRef(false);
    const [lastOrderTotal, setLastOrderTotal] = useState<number>(0);
    const [completedPaymentMethod, setCompletedPaymentMethod] = useState<'cash' | 'pix' | null>(null);
    
    const t = translations[language];

    const syncOrderHistory = useCallback(() => {
        if (typeof window === 'undefined') return;

        try {
            const raw = localStorage.getItem('orders_v1');
            const parsed = raw ? JSON.parse(raw) : [];
            setOrderHistory(Array.isArray(parsed) ? (parsed as OrderHistoryEntry[]) : []);
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
        setOrderNumber('');
        setCompletedPaymentMethod(null);
        setIsSubmitting(false);
        isSubmittingRef.current = false;
        setScreen('payment');
    };

    const handleConfirmDelivery = (details: DeliveryDetails) => {
        setOrderType('delivery');
        setDeliveryDetails(details);
        setOrderNumber('');
        setCompletedPaymentMethod(null);
        setIsSubmitting(false);
        isSubmittingRef.current = false;
        setScreen('payment');
    };

    const handlePlaceOrder = async (paymentMethod: 'cash' | 'pix') => {
        if (isSubmittingRef.current) return;

        const cartItems = Object.values(cart);
        if (cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }

        if (paymentMethod !== 'cash' && paymentMethod !== 'pix') {
            alert('Select a payment method');
            return;
        }

        const total = Number(cartTotals.totalPrice);
        if (!Number.isFinite(total) || total <= 0) {
            alert('Cart total is invalid');
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            const itemsForOrder = cartItems.map((item) => ({
                id: item.id,
                qty: item.quantity,
                name: t.menu[item.nameKey],
                price: item.price,
            }));

            const order = await createOrder(itemsForOrder, total, paymentMethod);

            setOrderNumber(String(order.id));
            setLastOrderTotal(total);
            setCompletedPaymentMethod(paymentMethod);
            setCart({});
            syncOrderHistory();
        } catch (e: any) {
            const msg = e?.message || e?.error_description || e?.hint || JSON.stringify(e);
            alert('Order error: ' + msg);
        } finally {
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    };
    
    const handleNewOrder = () => {
        setOrderNumber('');
        setLastOrderTotal(0);
        setCompletedPaymentMethod(null);
        setDeliveryDetails(undefined);
        setOrderType('pickup');
        setCart({});
        setIsSubmitting(false);
        isSubmittingRef.current = false;
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
                isSubmitting={isSubmitting}
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
                    orderNumber={orderNumber}
                    totalPrice={orderNumber ? lastOrderTotal : cartTotals.totalPrice}
                    isSubmitting={isSubmitting}
                    onPlaceOrder={handlePlaceOrder}
                    onNewOrder={handleNewOrder}
                    t={t}
                    orderType={orderType}
                    deliveryDetails={deliveryDetails}
                    paymentMethod={completedPaymentMethod}
                />
            )}
        </>
    );
};

export default App;
