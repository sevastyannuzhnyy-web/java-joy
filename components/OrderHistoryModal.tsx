
import React, { useMemo } from 'react';
import type { OrderHistoryEntry } from '../types';
import type { Language } from '../App';

interface OrderHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderHistory: OrderHistoryEntry[];
    t: any;
    language: Language;
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose, orderHistory, t, language }) => {
    const hasHistory = orderHistory.length > 0;
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';

    const formatter = useMemo(() => new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }), [locale]);

    const formatDate = (value: string) => {
        try {
            return formatter.format(new Date(value));
        } catch (error) {
            console.error('Failed to parse order date', error);
            return value;
        }
    };

    const formatTotal = (value: number | string) => {
        const numeric = typeof value === 'number' ? value : parseFloat(value);
        return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00';
    };

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
                aria-labelledby="history-title"
                style={{visibility: isOpen ? 'visible' : 'hidden'}}
            >
                <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                    <h2 id="history-title" className="text-3xl font-bold">{t.historyTitle}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-4xl" aria-label="Close history">&times;</button>
                </div>
                <div className="space-y-6 mb-4 flex-grow overflow-y-auto">
                    {hasHistory ? (
                        orderHistory.map((order) => {
                            const createdAt = 'created_at' in order ? order.created_at : (order as any).createdAt;

                            return (
                                <div key={order.id} className="cart-item bg-white/50 p-4 rounded-lg">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <p className="font-bold text-xl">#{order.id}</p>
                                        <p className="text-sm text-gray-500">R${formatTotal(order.total)}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                                        <span>{order.payment_method === 'pix' ? t.payWithPix : t.payAtCounter}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{t.orderDate} {formatDate(createdAt)}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-center mt-8">{t.noHistory}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderHistoryModal;
