
import React, { useEffect, useMemo, useState } from 'react';
import type { DeliveryDetails, OrderType } from '../types';

interface PaymentScreenProps {
    orderNumber: string;
    totalPrice: number;
    isSubmitting: boolean;
    onPlaceOrder: (method: 'cash' | 'pix') => Promise<void>;
    onNewOrder: () => void;
    t: any;
    orderType: OrderType;
    deliveryDetails?: DeliveryDetails;
    paymentMethod: 'cash' | 'pix' | null;
}

const PixKey = 'xxxxxxxxxx';

const PaymentScreen: React.FC<PaymentScreenProps> = ({ orderNumber, totalPrice, isSubmitting, onPlaceOrder, onNewOrder, t, orderType, deliveryDetails, paymentMethod }) => {
    const [copyButtonText, setCopyButtonText] = useState(t.copyKey);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'pix' | null>(paymentMethod);

    useEffect(() => {
        if (orderNumber) return;
        setSelectedPaymentMethod(paymentMethod);
    }, [orderNumber, paymentMethod]);

    const handleCopyPixKey = () => {
        navigator.clipboard.writeText(PixKey).then(() => {
            setCopyButtonText(t.keyCopied);
            setTimeout(() => {
                setCopyButtonText(t.copyKey);
            }, 2000);
        });
    };

    const handlePlaceOrder = async () => {
        if (isSubmitting) return;
        if (!selectedPaymentMethod) {
            alert('Select a payment method');
            return;
        }

        await onPlaceOrder(selectedPaymentMethod);
    };

    const displayTotal = useMemo(() => Number(totalPrice).toFixed(2), [totalPrice]);
    const effectivePaymentMethod = orderNumber ? paymentMethod : selectedPaymentMethod;
    const showPixDetails = effectivePaymentMethod === 'pix';

    return (
        <div className="fixed inset-0 z-50 p-6 flex flex-col justify-center items-center text-center bg-[#FDF8F2]">
            <div className="flex flex-col items-center w-full">
                <h2 className="text-3xl font-bold mb-2">{t.pixOrderTitle}</h2>
                <p className="text-gray-600 mb-8">{t.pixSubtitle}</p>

                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs mx-auto overflow-hidden">
                    <div className="receipt pt-4 text-left">
                        <div className="text-center mb-4">
                            <p className="text-lg text-gray-700">{orderType === 'delivery' ? t.orderForDelivery : t.orderForPickup}</p>
                            <p className="text-6xl font-bold my-2 text-black">{orderNumber ? `#${orderNumber}` : '---'}</p>
                        </div>

                        {orderType === 'delivery' && deliveryDetails && (
                            <>
                                <div className="border-t border-dashed border-gray-400 my-4"></div>
                                <div className="text-sm">
                                    <p className="font-semibold">{t.deliverTo}</p>
                                    <p>{deliveryDetails.name}</p>
                                    <p className="font-semibold mt-1">{t.atLocation}</p>
                                    <p>{deliveryDetails.location}</p>
                                </div>
                            </>
                        )}

                        <div className="border-t border-dashed border-gray-400 my-4"></div>
                        
                        <div className="flex justify-between items-baseline mb-2">
                            <p className="text-gray-700">{t.pixAmountLabel}</p>
                            <p className="text-2xl font-bold text-black">R${displayTotal}</p>
                        </div>

                        {showPixDetails && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-700 mb-1">{t.pixKeyLabel}</p>
                                <p className="text-base font-semibold bg-gray-100 p-2 rounded-md break-words text-center">{PixKey}</p>
                                <button onClick={handleCopyPixKey} className="mt-3 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 text-sm">{copyButtonText}</button>
                            </div>
                        )}
                        
                        <div className="text-center mt-6">
                           <p className="text-sm text-gray-500">{t.receiptThanks}</p>
                        </div>
                    </div>
                </div>

                {!orderNumber && (
                    <div className="mt-6 flex flex-col items-center space-y-4">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedPaymentMethod('cash')}
                                className={`vintage-btn py-2 px-4 rounded-lg font-semibold ${selectedPaymentMethod === 'cash' ? 'ring-2 ring-amber-500' : ''}`}
                            >
                                {t.payAtCounter}
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedPaymentMethod('pix')}
                                className={`vintage-btn py-2 px-4 rounded-lg font-semibold ${selectedPaymentMethod === 'pix' ? 'ring-2 ring-amber-500' : ''}`}
                            >
                                {t.payWithPix}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handlePlaceOrder}
                            className="vintage-btn py-3 px-8 rounded-lg font-semibold text-lg"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : t.confirmAndPay}
                        </button>
                    </div>
                )}

                {orderNumber && (
                    <button onClick={onNewOrder} className="mt-8 text-blue-600 font-semibold hover:underline">{t.newOrder}</button>
                )}
            </div>
        </div>
    );
};

export default PaymentScreen;
