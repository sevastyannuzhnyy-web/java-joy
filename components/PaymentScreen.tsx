import React, { useEffect, useMemo, useState } from 'react';
import type { DeliveryDetails, OrderType, CartItem as AppCartItem } from '../types';
import { createOrder, type CartItem as OrderCartItem, type PaymentMethod } from '../src/lib/createOrder';

interface PaymentScreenProps {
  cartItems: AppCartItem[];
  totalPrice: number;
  orderId: string | number | null;
  onOrderSuccess: (payload: { orderId: string | number; total: number; paymentMethod: PaymentMethod }) => void;
  onNewOrder: () => void;
  t: any;
  orderType: OrderType;
  deliveryDetails?: DeliveryDetails;
  completedPaymentMethod: PaymentMethod | null;
}

const PIX_KEY = 'xxxxxxxxxx';

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  cartItems,
  totalPrice,
  orderId,
  onOrderSuccess,
  onNewOrder,
  t,
  orderType,
  deliveryDetails,
  completedPaymentMethod,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState(t.copyKey);
  useEffect(() => {
    setCopyButtonText(t.copyKey);
  }, [t.copyKey]);

  const numericTotal = useMemo(() => Number(totalPrice), [totalPrice]);
  const effectivePaymentMethod = orderId ? completedPaymentMethod ?? paymentMethod : paymentMethod;
  const showPixDetails = effectivePaymentMethod === 'pix';

  const placeOrderDisabled =
    isSubmitting || orderId !== null || !cartItems.length || !Number.isFinite(numericTotal) || numericTotal <= 0;

  async function handlePlaceOrder() {
    if (isSubmitting || orderId !== null) return;
    setErrorMsg(null);

    if (!cartItems.length) {
      const message = 'Cart is empty';
      setErrorMsg(message);
      alert('Order error: ' + message);
      return;
    }

    if (!Number.isFinite(numericTotal) || numericTotal <= 0) {
      const message = 'Cart total is invalid';
      setErrorMsg(message);
      alert('Order error: ' + message);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems: OrderCartItem[] = cartItems.map((item) => ({
        id: item.id,
        name: t.menu[item.nameKey],
        qty: item.quantity,
        price: item.price,
        options: item.optionNameKey
          ? {
              optionKey: item.optionNameKey,
              optionLabel: t.menu[item.optionNameKey],
            }
          : undefined,
      }));

      const result = await createOrder(orderItems, numericTotal, paymentMethod);

      onOrderSuccess({ orderId: result.id, total: numericTotal, paymentMethod });
    } catch (e: any) {
      const msg = e?.message || e?.error_description || e?.hint || JSON.stringify(e);
      setErrorMsg(msg);
      alert('Order error: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyPixKey() {
    navigator.clipboard
      .writeText(PIX_KEY)
      .then(() => {
        setCopyButtonText(t.keyCopied);
        setTimeout(() => setCopyButtonText(t.copyKey), 2000);
      })
      .catch(() => {
        const message = 'Unable to copy PIX key';
        setErrorMsg(message);
        alert('Order error: ' + message);
      });
  }

  const formattedTotal = useMemo(() => (Number.isFinite(numericTotal) ? numericTotal.toFixed(2) : '0.00'), [numericTotal]);

  return (
    <div className="fixed inset-0 z-50 p-6 flex flex-col justify-center items-center text-center bg-[#FDF8F2]">
      <div className="flex flex-col items-center w-full">
        <h2 className="text-3xl font-bold mb-2">
          {orderId ? `Order #${orderId}` : t.pixOrderTitle}
        </h2>
        <p className="text-gray-600 mb-8">{t.pixSubtitle}</p>

        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs mx-auto overflow-hidden">
          <div className="receipt pt-4 text-left">
            <div className="text-center mb-4">
              <p className="text-lg text-gray-700">{orderType === 'delivery' ? t.orderForDelivery : t.orderForPickup}</p>
              <p className="text-6xl font-bold my-2 text-black">{orderId ? `#${orderId}` : '---'}</p>
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
              <p className="text-2xl font-bold text-black">R${formattedTotal}</p>
            </div>

            {showPixDetails && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-1">{t.pixKeyLabel}</p>
                <p className="text-base font-semibold bg-gray-100 p-2 rounded-md break-words text-center">{PIX_KEY}</p>
                <button
                  type="button"
                  onClick={handleCopyPixKey}
                  className="mt-3 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 text-sm"
                >
                  {copyButtonText}
                </button>
              </div>
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">{t.receiptThanks}</p>
            </div>
          </div>
        </div>

        {!orderId && (
          <div className="mt-6 flex flex-col items-center space-y-5">
            <fieldset className="w-full max-w-xs text-left">
              <legend className="text-sm font-semibold text-gray-700 mb-2">{t.paymentQuestion}</legend>
              <div className="space-y-2">
                <label className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                  paymentMethod === 'cash' ? 'border-amber-500 bg-white' : 'border-transparent bg-white/70'
                } cursor-pointer transition`}
                >
                  <span className="font-medium text-gray-800">{t.payAtCounter}</span>
                  <input
                    type="radio"
                    name="payment-method"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                  />
                </label>
                <label className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                  paymentMethod === 'pix' ? 'border-amber-500 bg-white' : 'border-transparent bg-white/70'
                } cursor-pointer transition`}
                >
                  <span className="font-medium text-gray-800">{t.payWithPix}</span>
                  <input
                    type="radio"
                    name="payment-method"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={() => setPaymentMethod('pix')}
                  />
                </label>
              </div>
            </fieldset>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="vintage-btn py-3 px-12 rounded-lg font-semibold text-lg"
              disabled={placeOrderDisabled}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        )}

        {orderId && (
          <button onClick={onNewOrder} className="mt-8 text-blue-600 font-semibold hover:underline">
            {t.newOrder}
          </button>
        )}

        {errorMsg && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentScreen;
