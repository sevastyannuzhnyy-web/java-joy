import React from 'react';

type Item = {
  id: string;
  nameKey: string;
  descriptionKey?: string;
  price?: number;     // если у тебя цены в pix, можно заменить на pix
  pix?: number;
  inStock: boolean;
  options?: {
    titleKey: string;
    default?: string;
    items: { nameKey: string; price: number }[];
  };
};

export default function MenuItemCard({
  item,
  t,
  onAddToCart = () => {},
}: {
  item: Item;
  t: any; // t.menu[...], t.addToCart, t.outOfStock
  onAddToCart?: (i: Item, selected?: string) => void;
}) {
  const available = item.inStock !== false;
  const [selected, setSelected] = React.useState(item.options?.default);
  const amount = item.pix ?? item.price ?? 0;

  return (
    <article className={`rounded-xl border bg-white p-4 shadow-sm transition ${available ? 'border-neutral-200 hover:shadow-md' : 'border-neutral-200/70 opacity-70'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-zinc-900">
            {t.menu[item.nameKey]}
          </h3>
          {item.descriptionKey && (
            <p className="text-sm text-zinc-500">{t.menu[item.descriptionKey]}</p>
          )}
          <p className={`mt-1 font-semibold ${available ? 'text-zinc-900' : 'text-zinc-500 line-through'}`}>
            R${amount.toFixed(2)}
          </p>
          {!available && (
            <span className="mt-2 inline-block rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-white">
              {t.outOfStock}
            </span>
          )}
        </div>

        <button
          disabled={!available}
          onClick={() => available && onAddToCart(item, selected)}
          className={`h-9 w-9 shrink-0 rounded-lg text-xl font-bold ${
            available
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'cursor-not-allowed bg-zinc-200 text-zinc-500'
          }`}
          aria-label={available ? `${t.addToCart} ${t.menu[item.nameKey]}` : `${t.menu[item.nameKey]} ${t.outOfStock}`}
          title={available ? `${t.addToCart} ${t.menu[item.nameKey]}` : `${t.menu[item.nameKey]} ${t.outOfStock}`}
        >
          {available ? t.addToCart : '×'}
        </button>
      </div>

      {item.options && (
        <div className={`mt-3 border-t pt-3 text-sm ${available ? 'text-zinc-700' : 'text-zinc-400'}`}>
          <h4 className="mb-2 font-semibold">{t.menu[item.options.titleKey]}</h4>
          <div className="space-y-2">
            {item.options.items.map((opt) => (
              <label key={opt.nameKey} className={`flex items-center gap-2 ${available ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                <input
                  type="radio"
                  name={`${item.id}-opt`}
                  value={opt.nameKey}
                  checked={selected === opt.nameKey}
                  onChange={(e) => setSelected(e.target.value)}
                  disabled={!available}
                  className="h-4 w-4"
                />
                <span>
                  {t.menu[opt.nameKey]}
                  {opt.price > 0 && (
                    <span className="text-xs text-zinc-500"> (+R${opt.price.toFixed(2)})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
