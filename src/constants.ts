
export const menuData = [
  {
    id: "coffees",
    title_en: "Coffees",
    title_pt: "Cafés",
    items: [
      { id: "espresso", name_en: "Espresso - 100ml", name_pt: "Expresso - 100ml", cash: 8, card: 10, inStock: true },
      { id: "iced_coffee", name_en: "Iced Coffee - 400ml", name_pt: "Café gelado - 400ml", cash: 17, card: 21, inStock: true },
      { id: "mocha", name_en: "Mocha - 300ml", name_pt: "Mocca - 300ml", cash: 18, card: 22.3, inStock: true },
      { id: "cappuccino", name_en: "Cappuccino - 300ml", name_pt: "Cappuccino - 300ml", cash: 15, card: 18.6, inStock: true },
      { id: "brainstorm", name_en: "Brainstorm Caramel Iced - 400ml", name_pt: "Brainstorm Caramelo Gelado - 400ml", cash: 9, card: 11.2, inStock: true },
      { id: "vegan_milk", name_en: "Vegan Milk", name_pt: "Leite vegetal", cash: 3, card: 3, inStock: true },
    ],
  },
  {
    id: "drinks",
    title_en: "Drinks",
    title_pt: "Bebidas",
    items: [
      { id: "water", name_en: "Water", name_pt: "Água", cash: 7, card: 8.7, inStock: true },
      { id: "sparkling", name_en: "Sparkling Water", name_pt: "Água com gás", cash: 7, card: 8.7, inStock: true },
      { id: "chocoki", name_en: "Chocoki", name_pt: "Chocoki", cash: 9, card: 11.2, inStock: true },
    ],
  },
  {
    id: "food",
    title_en: "Comidas",
    title_pt: "Comidas",
    items: [
      { id: "croissant", name_en: "Croissant", name_pt: "Croissant", cash: 16, card: 20, inStock: true },
      { id: "choco_croissant", name_en: "Chocolate Croissant", name_pt: "Croissant de chocolate", cash: 19, card: 23.5, inStock: true },
      { id: "caramel_cookie", name_en: "Caramel Cookie Cake", name_pt: "Bolo de biscoito caramelo", cash: 15, card: 18.6, inStock: true },
      { id: "choco_cookie", name_en: "Chocolate Cookie Cake", name_pt: "Bolo de biscoito chocolate", cash: 13, card: 16, inStock: true },
      { id: "cupcake", name_en: "Cupcake", name_pt: "Cupcake", cash: 9, card: 11, inStock: true },
    ],
  },
];

// строки интерфейса
export const strings = {
  en: {
    addToCart: "+",
    outOfStock: "Out of stock",
    inStock: "In stock",
    cart: "Cart",
    total: "Total",
    checkout: "Checkout",
  },
  pt: {
    addToCart: "+",
    outOfStock: "Sem estoque",
    inStock: "Em estoque",
    cart: "Carrinho",
    total: "Total",
    checkout: "Finalizar",
  },
} as const;
