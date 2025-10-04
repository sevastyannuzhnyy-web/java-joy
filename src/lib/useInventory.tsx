import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";

type InventoryRecord = {
  name?: string;
  price?: number;
  is_available: boolean;
};

type InventoryContextValue = {
  inventoryById: Record<string, InventoryRecord>;
  loading: boolean;
  reload: () => Promise<void>;
};

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined
);

async function fetchInventory(): Promise<Record<string, InventoryRecord>> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, price, is_available");

  if (error) throw error;

  const mapped: Record<string, InventoryRecord> = {};
  (data || []).forEach((row: any) => {
    if (!row?.id) return;

    const normalizedId =
      typeof row.id === "string" && row.id.startsWith("item_")
        ? row.id
        : `item_${row.id}`;

    const priceValue = Number(row.price);

    mapped[normalizedId] = {
      name: row.name ?? undefined,
      price: Number.isFinite(priceValue) ? priceValue : undefined,
      is_available: row.is_available ?? true,
    };
  });

  return mapped;
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventoryById, setInventoryById] = useState<
    Record<string, InventoryRecord>
  >({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const mapped = await fetchInventory();
      setInventoryById(mapped);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const channel = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => {
          reload().catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reload]);

  const value = useMemo(
    () => ({
      inventoryById,
      loading,
      reload,
    }),
    [inventoryById, loading, reload]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return ctx;
}
