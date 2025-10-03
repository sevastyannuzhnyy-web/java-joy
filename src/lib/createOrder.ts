import { supabase } from './supabase'

export type CartItem = { id: string; qty: number; name?: string; price?: number }

export async function createOrder(
  items: CartItem[],
  total: number | string,
  paymentMethod: 'cash' | 'pix'
) {
  const deviceId =
    localStorage.getItem('device_id') ||
    (() => {
      const id = crypto.randomUUID()
      localStorage.setItem('device_id', id)
      return id
    })()

  const idempotencyKey = crypto.randomUUID()
  const numericTotal = Number(total)

  const { data, error } = await supabase
    .from('orders')
    .upsert(
      [
        {
          device_id: deviceId,
          items,
          total: numericTotal,
          payment_method: paymentMethod,
          status: 'pending',
          idempotency_key: idempotencyKey,
        },
      ],
      { onConflict: 'idempotency_key' }
    )
    .select()
    .single()

  if (error) throw error

  const key = 'orders_v1'
  const list: any[] = JSON.parse(localStorage.getItem(key) || '[]')
  if (!list.some((o) => o.id === data.id)) {
    list.unshift({
      id: data.id,
      total: data.total,
      status: data.status,
      createdAt: data.created_at,
      payment_method: data.payment_method,
    })
    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)))
  }

  return data
}
