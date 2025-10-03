import { supabase } from './supabase'

export type CartItem = {
  id: string
  name: string
  qty: number
  price: number
  options?: unknown
}

export type PaymentMethod = 'cash' | 'pix'

function getDeviceId() {
  const key = 'jj_device_id'
  let value = localStorage.getItem(key)
  if (!value) {
    value = crypto.randomUUID()
    localStorage.setItem(key, value)
  }
  return value
}

function makeIdemKey(total: number, paymentMethod: PaymentMethod) {
  const device = getDeviceId()
  const windowBucket = Math.floor(Date.now() / 2000)
  return `${device}:${paymentMethod}:${total}:${windowBucket}`
}

export async function createOrder(
  items: CartItem[],
  total: number,
  paymentMethod: PaymentMethod
) {
  const device_id = getDeviceId()
  const idempotency_key = makeIdemKey(total, paymentMethod)

  const payload = {
    device_id,
    items,
    total,
    payment_method: paymentMethod,
    idempotency_key,
  }

  const { data, error } = await supabase
    .from('orders')
    .upsert(payload, { onConflict: 'idempotency_key' })
    .select('id, total, payment_method, created_at')
    .single()

  if (error) throw error

  try {
    const historyKey = 'jj_order_history'
    const raw = localStorage.getItem(historyKey)
    const parsed = raw ? JSON.parse(raw) : []
    const entries: any[] = Array.isArray(parsed) ? parsed : []
    const filtered = entries.filter((entry) => entry?.id !== data.id)
    filtered.unshift({
      id: data.id,
      total: data.total,
      payment_method: data.payment_method,
      created_at: data.created_at,
    })
    localStorage.setItem(historyKey, JSON.stringify(filtered.slice(0, 50)))
  } catch (err) {
    console.error('Failed to update local order history', err)
  }

  return data
}
