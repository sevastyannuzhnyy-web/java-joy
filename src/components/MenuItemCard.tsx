import React from "react";

type Item = {
  id: string;
  name?: string;        // придёт из Menu.tsx
  name_en?: string;
  name_pt?: string;
  cash: number;
  card: number;
  inStock: boolean;
};

export default function MenuItemCard({ item }: { item: Item }) {
  // ФОЛБЭК, если вдруг name не прилетит
  const displayName =
    item.name ?? item.name_en ?? item.name_pt ?? "Unnamed item";

  return (
    <div className="flex items-center justify-between border-b border-neutral-200 py-2">
      <div className="min-w-0">
        <div className="font-medium truncate">{displayName}</div>
        {!item.inStock && (
          <div className="text-sm text-red-600">Sem estoque</div>
        )}
      </div>

      <div className="text-right">
        <div className="text-sm">PIX: ${item.cash}</div>
        <div className="text-sm opacity-80">CARD: ${item.card}</div>
      </div>
    </div>
  );
}
