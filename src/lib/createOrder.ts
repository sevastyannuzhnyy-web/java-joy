import { supabase } from './supabase'

export type CartItem = {
  id: string
  name: string
  qty: number
  price: number
  options?: unknown
}

export type PaymentMethod = 'pix'

const PIX_PAYMENT_METHOD: PaymentMethod = 'pix'

function uuidUniversal() {
  const globalCrypto =
    typeof globalThis !== 'undefined' ? (globalThis as { crypto?: Crypto }).crypto : undefined

  if (globalCrypto?.getRandomValues) {
    const bytes = new Uint8Array(16)
    globalCrypto.getRandomValues(bytes)

    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
  }

  let timestamp = Date.now()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    timestamp += performance.now()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = ((timestamp + Math.random() * 16) % 16) | 0
    timestamp = Math.floor(timestamp / 16)
    if (char === 'x') {
      return random.toString(16)
    }
    return ((random & 0x3) | 0x8).toString(16)
  })
}

function getDeviceId() {
  const key = 'jj_device_id'
  let value = localStorage.getItem(key)
  if (!value) {
    value = uuidUniversal()
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
  total: number
) {
  const device_id = getDeviceId()
  const idempotency_key = makeIdemKey(total, PIX_PAYMENT_METHOD)

  const payload = {
    device_id,
    items,
    total,
    payment_method: PIX_PAYMENT_METHOD,
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
