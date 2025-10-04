import { supabase } from './supabase'

type InventoryMap = Record<string, boolean>
type InventoryListener = (map: InventoryMap) => void

const STORAGE_KEY = 'java-joy-inventory'
const hasWindow = typeof window !== 'undefined'
const hasSupabase = Boolean(supabase)

let cache: InventoryMap = hasWindow ? readLocal() : {}
const listeners = new Set<InventoryListener>()
let supabaseSubscribed = false
let loadingPromise: Promise<InventoryMap> | null = null

function readLocal(): InventoryMap {
  if (!hasWindow) return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed
  } catch (error) {
    console.warn('Failed to read inventory from localStorage', error)
  }
  return {}
}

function writeLocal(map: InventoryMap) {
  if (!hasWindow) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch (error) {
    console.warn('Failed to persist inventory to localStorage', error)
  }
}

function notify() {
  const snapshot = { ...cache }
  listeners.forEach((listener) => listener(snapshot))
}

function ensureRealtime() {
  if (!supabase || supabaseSubscribed) return
  supabaseSubscribed = true
  supabase
    .channel('menu-items-inventory')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, (payload) => {
      if (payload.eventType === 'DELETE') {
        const id = (payload.old as { id?: string } | null)?.id
        if (id && id in cache) {
          const next = { ...cache }
          delete next[id]
          cache = next
          writeLocal(cache)
          notify()
        }
        return
      }

      const record = payload.new as { id?: string; is_available?: boolean } | null
      if (record?.id) {
        const next = { ...cache, [record.id]: record.is_available !== false }
        cache = next
        writeLocal(cache)
        notify()
      }
    })
    .subscribe()
}

export function getInventorySnapshot(): InventoryMap {
  return { ...cache }
}

export async function loadInventory(): Promise<InventoryMap> {
  ensureRealtime()
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    if (hasSupabase && supabase) {
      const { data, error } = await supabase.from('menu_items').select('id, is_available')
      if (!error && Array.isArray(data)) {
        const next: InventoryMap = {}
        data.forEach((row) => {
          if (row?.id) next[row.id] = row.is_available !== false
        })
        cache = next
        writeLocal(cache)
        notify()
        loadingPromise = null
        return { ...cache }
      }
    }

    cache = readLocal()
    notify()
    loadingPromise = null
    return { ...cache }
  })()

  return loadingPromise
}

export async function setInventoryState(id: string, inStock: boolean) {
  cache = { ...cache, [id]: inStock }
  writeLocal(cache)
  notify()

  if (hasSupabase && supabase) {
    await supabase.from('menu_items').update({ is_available: inStock }).eq('id', id)
  }
}

export function subscribeToInventory(listener: InventoryListener) {
  listeners.add(listener)
  listener({ ...cache })
  ensureRealtime()
  return () => {
    listeners.delete(listener)
  }
}

if (hasWindow) {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      cache = readLocal()
      notify()
    }
  })
}

if (hasSupabase) {
  loadInventory().catch(() => {})
}
