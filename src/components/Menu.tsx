import React from "react";
import { menuData } from "../constants";
import MenuItemCard from "./MenuItemCard";

export default function Menu() {
  // простой выбор языка (можешь заменить на свой переключатель)
  const lang = (navigator.language || "en").toLowerCase().startsWith("pt") ? "pt" : "en";

  return (
    <div className="max-w-3xl mx-auto p-4">
      {menuData.map((category) => (
        <section key={category.id} className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {lang === "pt" ? category.title_pt : category.title_en}
          </h2>

          <div className="grid gap-3">
            {category.items.map((item) => {
              // НОРМАЛИЗУЕМ имя, чтобы у карточки всегда было item.name (string)
              const normalizedItem = {
                ...item,
                name: lang === "pt" ? item.name_pt : item.name_en,
              };

              return (
                <MenuItemCard
                  key={item.id}                 // <— ключ для React
                  item={normalizedItem}         // <— у карточки будет item.name
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
