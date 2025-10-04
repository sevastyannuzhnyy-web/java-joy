import React from 'react'
import { supabase } from '../lib/supabase'

type OrderItem = {
  id?: string
  name?: string
  qty?: number
  price?: number
}

type Order = {
  id: number | string
  created_at?: string
  total?: number
  status?: string | null
  payment_method?: string | null
  customer_name?: string | null
  delivery_location?: string | null
  items?: OrderItem[] | any
}

export default function OwnerDashboard() {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchOrders = React.useCallback(async () => {
    setError(null)
    const { data, error } = await supabase
      .from('orders')
      .select('id, created_at, items, total, status, payment_method, customer_name, delivery_location')
      .order('id', { ascending: false })
      .limit(100)

    if (error) {
      setError(error.message)
    } else {
      setOrders(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchOrders()

    // realtime подписка
    const channel = supabase
      .channel('orders-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders])

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Последние заказы (реальное время)</p>

      <div className="mt-6 overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2">Method</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-3 py-3" colSpan={7}>Loading…</td></tr>
            )}
            {error && (
              <tr><td className="px-3 py-3 text-red-600" colSpan={7}>{error}</td></tr>
            )}
            {!loading && !error && orders.length === 0 && (
              <tr><td className="px-3 py-3 text-gray-500" colSpan={7}>No orders yet.</td></tr>
            )}
            {orders.map(o => {
              const created = o.created_at ? new Date(o.created_at).toLocaleString() : '—'
              const items = Array.isArray(o.items) ? o.items as OrderItem[] : []
              const itemsLabel = items.length
                ? items.map((it, i) => (
                    <div key={i} style={{display:'flex', gap:8, justifyContent:'space-between'}}>
                      <span>{it.name ?? it.id ?? `Item ${i+1}`}</span>
                      <span style={{opacity:.6}}>×{it.qty ?? 1}</span>
                    </div>
                  ))
                : <span style={{opacity:.6}}>—</span>

              const delivery =
                (o.customer_name || o.delivery_location)
                  ? `${o.customer_name ?? ''}${o.delivery_location ? ` • ${o.delivery_location}` : ''}`
                  : '—'

              return (
                <tr key={String(o.id)} className="border-t">
                  <td className="px-3 py-2 font-mono">{o.id}</td>
                  <td className="px-3 py-2">{created}</td>
                  <td className="px-3 py-2">{itemsLabel}</td>
                  <td className="px-3 py-2 text-right">R${Number(o.total ?? 0).toFixed(2)}</td>
                  <td className="px-3 py-2">{o.payment_method ?? '—'}</td>
                  <td className="px-3 py-2">{o.status ?? '—'}</td>
                  <td className="px-3 py-2">{delivery}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <a href="/#/" className="mt-4 inline-block rounded bg-amber-600 px-4 py-2 text-white">
        ← Back to menu
      </a>
    </main>
  )
}
