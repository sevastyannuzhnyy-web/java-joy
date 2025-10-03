
import type { MenuCategory } from './types';

export const menuData: MenuCategory[] = [
    { 
        categoryKey: "cat_coffees", 
        items: [
            { nameKey: "item_espresso", descriptionKey: "desc_100ml", price: 8 },
            { 
                nameKey: "item_iced_coffee", 
                descriptionKey: "desc_400ml", 
                price: 17,
                options: {
                    titleKey: "opt_title_milk",
                    default: "opt_item_whole_milk",
                    items: [
                        { nameKey: "opt_item_whole_milk", price: 0 },
                        { nameKey: "opt_item_vegan_milk", price: 3 }
                    ]
                }
            },
            { 
                nameKey: "item_mocha", 
                descriptionKey: "desc_300ml", 
                price: 18,
                options: {
                    titleKey: "opt_title_milk",
                    default: "opt_item_whole_milk",
                    items: [
                        { nameKey: "opt_item_whole_milk", price: 0 },
                        { nameKey: "opt_item_vegan_milk", price: 3 }
                    ]
                }
            },
            { 
                nameKey: "item_cappuccino", 
                descriptionKey: "desc_300ml", 
                price: 15,
                options: {
                    titleKey: "opt_title_milk",
                    default: "opt_item_whole_milk",
                    items: [
                        { nameKey: "opt_item_whole_milk", price: 0 },
                        { nameKey: "opt_item_vegan_milk", price: 3 }
                    ]
                }
            },
            { 
                nameKey: "item_caramel_iced", 
                descriptionKey: "desc_400ml", 
                price: 9,
                options: {
                    titleKey: "opt_title_milk",
                    default: "opt_item_whole_milk",
                    items: [
                        { nameKey: "opt_item_whole_milk", price: 0 },
                        { nameKey: "opt_item_vegan_milk", price: 3 }
                    ]
                }
            }
        ] 
    },
    { 
        categoryKey: "cat_drinks", 
        items: [
            { nameKey: "item_water", descriptionKey: "desc_none", price: 7 },
            { nameKey: "item_sparkling_water", descriptionKey: "desc_none", price: 7 },
            { nameKey: "item_chocoki", descriptionKey: "desc_300ml", price: 9 }
        ] 
    },
    { 
        categoryKey: "cat_food", 
        items: [
            { nameKey: "item_croissant", descriptionKey: "desc_none", price: 16 },
            { nameKey: "item_chocolate_croissant", descriptionKey: "desc_none", price: 19 },
            { nameKey: "item_caramel_cookie", descriptionKey: "desc_none", price: 15 },
            { nameKey: "item_chocolate_cookie", descriptionKey: "desc_none", price: 13 },
            { nameKey: "item_cupcake", descriptionKey: "desc_none", price: 9 }
        ] 
    }
];

export const CART_VALUE_TARGET = 50;


export const translations = {
  pt: {
    // Hero
    heroSubtitle: "O melhor café da escola, a um clique de distância.",
    startOrderPT: "Português",
    startOrderEN: "English",

    // Header
    changeLang: "EN",

    // Menu
    addToCart: "+",
    
    // Cart
    cartTitle: "Seu Pedido",
    cartEmpty: "Seu carrinho está vazio.",
    total: "Total:",
    checkout: "Finalizar Pedido",

    // Delivery Options
    deliveryOrPickup: "É para entrega ou retirada?",
    pickup: "Retirada",
    delivery: "Entrega",
    deliveryDetailsTitle: "Detalhes da Entrega",
    nameLabel: "Seu Nome",
    locationLabel: "Sua Localização (ex: Sala A17/A16)",
    confirmAndPay: "Confirmar e Pagar",
    goBack: "Voltar",

    // Payment
    paymentQuestion: "Como você gostaria de pagar?",
    payAtCounter: "Pagar no Caixa",
    payWithPix: "Pagar com PIX",
    
    // Receipt
    receiptTitle: "Retire seu pedido no caixa!",
    receiptSubtitle: "Apresente o número do seu pedido.",
    receiptOrderNumber: "Seu número de pedido é:",
    receiptThanks: "Obrigado por comprar na Java Joy!",
    newOrder: "Fazer novo pedido",
    
    // PIX
    pixOrderTitle: "Seu Pedido:",
    pixSubtitle: "Começaremos a fazer assim que você pagar :)",
    pixAmountLabel: "Valor a transferir:",
    pixKeyLabel: "Para a chave PIX:",
    copyKey: "Copiar Chave",
    keyCopied: "Copiado!",
    orderForPickup: "Pedido para Retirada",
    orderForDelivery: "Pedido para Entrega",
    deliverTo: "Entregar para:",
    atLocation: "Local:",

    // Order History
    historyTitle: "Histórico de Pedidos",
    noHistory: "Você ainda não fez nenhum pedido.",
    orderDate: "Pedido em",

    menu: {
        // Categories
        cat_coffees: "Cafés",
        cat_drinks: "Bebidas",
        cat_food: "Comidas",
        
        // Descriptions
        desc_100ml: "100ml",
        desc_300ml: "300ml",
        desc_400ml: "400ml",
        desc_none: "",

        // Items
        item_espresso: "Espresso",
        item_iced_coffee: "Café gelado",
        item_mocha: "Mocha",
        item_cappuccino: "Capuccino",
        item_caramel_iced: "Brainstorm Caramel Iced",
        item_water: "Água",
        item_sparkling_water: "Água com gás",
        item_chocoki: "Chocoki",
        item_croissant: "Croissant",
        item_chocolate_croissant: "Croissant de Chocolate",
        item_caramel_cookie: "Cookie Cake Caramelo",
        item_chocolate_cookie: "Cookie Cake Chocolate",
        item_cupcake: "Cupcake",
        
        // Options
        opt_title_milk: "Leite",
        opt_item_whole_milk: "Leite Integral",
        opt_item_vegan_milk: "Leite Vegano"
    }
  },
  en: {
    // Hero
    heroSubtitle: "The best coffee in school, just a click away.",
    startOrderPT: "Português",
    startOrderEN: "English",

    // Header
    changeLang: "PT",

    // Menu
    addToCart: "+",

    // Cart
    cartTitle: "Your Order",
    cartEmpty: "Your cart is empty.",
    total: "Total:",
    checkout: "Checkout",
    
    // Delivery Options
    deliveryOrPickup: "Delivery or Pick up?",
    pickup: "Pick up",
    delivery: "Delivery",
    deliveryDetailsTitle: "Delivery Details",
    nameLabel: "Your Name",
    locationLabel: "Your Location (e.g., Classroom A17/A16)",
    confirmAndPay: "Confirm and Pay",
    goBack: "Go Back",

    // Payment
    paymentQuestion: "How would you like to pay?",
    payAtCounter: "Pay at Counter",
    payWithPix: "Pay with PIX",
    
    // Receipt
    receiptTitle: "Pick up your order at the counter!",
    receiptSubtitle: "Please present your order number.",
    receiptOrderNumber: "Your order number is:",
    receiptThanks: "Thank you for your purchase at Java Joy!",
    newOrder: "Make a new order",
    
    // PIX
    pixOrderTitle: "Your Order:",
    pixSubtitle: "We'll start preparing it once payment is complete :)",
    pixAmountLabel: "Amount to transfer:",
    pixKeyLabel: "To the PIX key:",
    copyKey: "Copy Key",
    keyCopied: "Copied!",
    orderForPickup: "Order for Pick up",
    orderForDelivery: "Order for Delivery",
    deliverTo: "Deliver to:",
    atLocation: "Location:",

    // Order History
    historyTitle: "Order History",
    noHistory: "You haven't placed any orders yet.",
    orderDate: "Order placed on",

    menu: {
        // Categories
        cat_coffees: "Coffees",
        cat_drinks: "Drinks",
        cat_food: "Food",

        // Descriptions
        desc_100ml: "100ml",
        desc_300ml: "300ml",
        desc_400ml: "400ml",
        desc_none: "",

        // Items
        item_espresso: "Espresso",
        item_iced_coffee: "Iced Coffee",
        item_mocha: "Mocha",
        item_cappuccino: "Cappuccino",
        item_caramel_iced: "Brainstorm Caramel Iced",
        item_water: "Water",
        item_sparkling_water: "Sparkling Water",
        item_chocoki: "Chocoki",
        item_croissant: "Croissant",
        item_chocolate_croissant: "Chocolate Croissant",
        item_caramel_cookie: "Caramel Cookie Cake",
        item_chocolate_cookie: "Chocolate Cookie Cake",
        item_cupcake: "Cupcake",

        // Options
        opt_title_milk: "Milk",
        opt_item_whole_milk: "Whole Milk",
        opt_item_vegan_milk: "Vegan Milk"
    }
  }
};