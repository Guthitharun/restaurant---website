/* ==========================================================================
   DATA.JS — ADHIRATHA Family Restaurant Menu Data
   Complete menu with 14 categories, 100+ items
   All prices in ₹ (Indian Rupees)
   ========================================================================== */

const RESTAURANT = {
  name: "ADHIRATHA FAMILY RESTAURANT (AC)",
  tagline: "Authentic Flavors, Royal Experience",
  address: "Near Highway (NH-565), Near Govt. Hospital, Pamuru, Andhra Pradesh - 523108",
  phone1: "6301042993",
  phone2: "9666250268",
  whatsapp: "916301042993",
  email: "adhiratharestaurant@gmail.com",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15365.123!2d79.913!3d15.115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPamuru!5e0!3m2!1sen!2sin!4v1700000000000",
  mapLink: "https://maps.google.com/?q=Adhiratha+Family+Restaurant+Pamuru+Andhra+Pradesh",
  hours: {
    weekday: "11:00 AM – 11:00 PM",
    weekend: "11:00 AM – 11:30 PM",
    closed: "None"
  },
  delivery: {
    charge: 0,
    freeAbove: 500,
    estimateMin: 30,
    estimateMax: 45
  },
  gst: 0,
  currency: "₹"
};

/* --------------------------------------------------------------------------
   Coupon Codes
   -------------------------------------------------------------------------- */
const COUPONS = [
  { code: "WELCOME20", discount: 20, minOrder: 300, maxDiscount: 100, description: "20% off on first order", active: true },
  { code: "ADHIRATHA10", discount: 10, minOrder: 200, maxDiscount: 80, description: "10% off on orders above ₹200", active: true },
  { code: "FAMILY50", discount: 15, minOrder: 500, maxDiscount: 150, description: "15% off on family orders above ₹500", active: true },
  { code: "BIRYANI30", discount: 30, minOrder: 250, maxDiscount: 120, description: "30% off on Biryani orders", active: true },
  { code: "WEEKEND15", discount: 15, minOrder: 400, maxDiscount: 100, description: "15% off on weekends", active: true }
];

/* --------------------------------------------------------------------------
   Menu Categories
   -------------------------------------------------------------------------- */
const CATEGORIES = [
  { id: "veg-starters",   name: "Veg Starters",    icon: "fa-leaf",        emoji: "🥗" },
  { id: "non-veg-curry",  name: "Non-Veg Gravy",   icon: "fa-drumstick-bite", emoji: "🍗" },
  { id: "veg-curry",      name: "Veg Gravy",       icon: "fa-carrot",      emoji: "🥘" },
  { id: "biryani",        name: "Biryani Items",   icon: "fa-bowl-rice",   emoji: "🍚" },
  { id: "mandi",          name: "Mandi",           icon: "fa-fire",        emoji: "🔥" },
  { id: "rice",           name: "Rice Items",      icon: "fa-bowl-rice",   emoji: "🍛" },
  { id: "tandoori",       name: "Tandoori Section",icon: "fa-fire-flame-curved", emoji: "🍖" },
  { id: "bread",          name: "Indian Bread",    icon: "fa-bread-slice", emoji: "🫓" },
  { id: "fry-items",      name: "Fry Items",       icon: "fa-utensils",    emoji: "🍳" },
  { id: "fish",           name: "Fish",            icon: "fa-fish",        emoji: "🐟" },
  { id: "prawns",         name: "Prawns",          icon: "fa-shrimp",      emoji: "🦐" },
  { id: "egg",            name: "Egg",             icon: "fa-egg",         emoji: "🥚" },
  { id: "soups",          name: "Soups",           icon: "fa-mug-hot",     emoji: "🍲" },
  { id: "drinks",         name: "Deserts & Drinks", icon: "fa-glass-water", emoji: "🥤" }
];

/* --------------------------------------------------------------------------
   Menu Items — Complete Menu (105 items)
   All prices in ₹ (Indian Rupees)
   -------------------------------------------------------------------------- */
const MENU_ITEMS = [
  // ==================== VEG STARTERS ====================
  { id: 1,   name: "PANEER 65",             category: "veg-starters", price: 210, isVeg: true,  isBestseller: true,  isPopular: true,  description: "Crispy paneer chunks in spicy red marinade, deep-fried.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80" },
  { id: 2,   name: "CHILLI PANEER",          category: "veg-starters", price: 220, isVeg: true,  isBestseller: false, isPopular: true,  description: "Paneer cubes tossed with fresh bell peppers and onions in soya chili sauce.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80" },
  { id: 3,   name: "CHILLI MASHROOM",        category: "veg-starters", price: 210, isVeg: true,  isBestseller: false, isPopular: false, description: "Button mushrooms coated in spicy flour, fried and sautéed in chili sauce.", image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80" },
  { id: 4,   name: "MASHREEOM PEPPER DRY",   category: "veg-starters", price: 200, isVeg: true,  isBestseller: true,  isPopular: false, description: "Crispy mushrooms cooked with black pepper and curry leaves.", image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80" },
  { id: 5,   name: "GOBI MANCHURIAN",        category: "veg-starters", price: 180, isVeg: true,  isBestseller: false, isPopular: true,  description: "Cauliflower florets fried and tossed in hot Chinese Manchurian sauce.", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80" },
  { id: 6,   name: "BABYCORN MACHURIYAN",    category: "veg-starters", price: 180, isVeg: true,  isBestseller: false, isPopular: false, description: "Crispy baby corn tossed in soy-Manchurian glaze.", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80" },
  { id: 7,   name: "CRISPY SWEET CORN",      category: "veg-starters", price: 150, isVeg: true,  isBestseller: false, isPopular: true,  description: "Golden fried sweet corn kernels tossed with spices and fresh herbs.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" },
  { id: 8,   name: "KAJU FRY",               category: "veg-starters", price: 220, isVeg: true,  isBestseller: true,  isPopular: true,  description: "Rich cashews roasted with spices and fresh curry leaves.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" },

  // ==================== RICE ITEMS ====================
  { id: 9,   name: "CHICKEN FRIED RICE",     category: "rice", price: 200, isVeg: false, isBestseller: true,  isPopular: true,  description: "Fluffy basmati rice tossed with shredded chicken, eggs, and veggies.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80" },
  { id: 10,  name: "EGG FRIED RICE",         category: "rice", price: 180, isVeg: false, isBestseller: false, isPopular: true,  description: "Basmati rice wok-tossed with scrambled egg and mild spices.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80" },
  { id: 11,  name: "VEG FRIED RICE",         category: "rice", price: 150, isVeg: true,  isBestseller: false, isPopular: false, description: "Basmati rice stir-fried with finely chopped fresh vegetables.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80" },
  { id: 12,  name: "JEERA RICE",             category: "rice", price: 150, isVeg: true,  isBestseller: false, isPopular: true,  description: "Basmati rice tempered with cumin seeds and pure ghee.", image: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&w=600&q=80" },
  { id: 13,  name: "KAJU FRIED RICE",        category: "rice", price: 220, isVeg: true,  isBestseller: true,  isPopular: false, description: "Basmati rice tossed with golden-fried whole cashews and ghee.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80" },
  { id: 14,  name: "GOBI FRIED RICE",        category: "rice", price: 180, isVeg: true,  isBestseller: false, isPopular: false, description: "Fragrant rice stir-fried with crispy Gobi Manchurian chunks.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80" },
  { id: 15,  name: "SPECIAL CURD RICE",      category: "rice", price: 100, isVeg: true,  isBestseller: false, isPopular: true,  description: "Creamy yogurt rice with mustard seeds, pomegranate, and dry fruits.", image: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&w=600&q=80" },
  { id: 16,  name: "WHITE RICE",             category: "rice", price: 70,  isVeg: true,  isBestseller: false, isPopular: false, description: "Steamed plain premium quality white rice.", image: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&w=600&q=80" },

  // ==================== NON-VEG GRAVY ====================
  { id: 17,  name: "CHICKEN CURRY (BONES)",  category: "non-veg-curry", price: 200, isVeg: false, isBestseller: false, isPopular: true,  description: "Traditional chicken curry cooked with bone in spicy Andhra style gravy.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 18,  name: "CHICKEN CURRY (BONELESS)",category: "non-veg-curry", price: 229, isVeg: false, isBestseller: true,  isPopular: true,  description: "Tender boneless chicken pieces simmered in rich spiced gravy.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 19,  name: "KADAI CHICKEN (BONE)",   category: "non-veg-curry", price: 300, isVeg: false, isBestseller: false, isPopular: false, description: "Chicken with bone cooked in a traditional Kadai with crushed spices.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 20,  name: "KADAI CHICKEN (BONELESS)",category: "non-veg-curry", price: 320, isVeg: false, isBestseller: false, isPopular: true,  description: "Boneless chicken simmered in rich bell pepper and onion kadai gravy.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 21,  name: "BUTTER CHICKEN",        category: "non-veg-curry", price: 320, isVeg: false, isBestseller: true,  isPopular: true,  description: "Juicy chicken tandoori chunks cooked in rich creamy tomato butter sauce.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 22,  name: "CHICKEN MOGALAL",        category: "non-veg-curry", price: 300, isVeg: false, isBestseller: false, isPopular: true,  description: "Rich and creamy Mughlai-style chicken curry topped with egg drops.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 23,  name: "MUTTON CURRY",          category: "non-veg-curry", price: 350, isVeg: false, isBestseller: true,  isPopular: true,  description: "Tender local mutton cooked in home-style spicy gravy.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 24,  name: "PRAWNS CURRY",          category: "non-veg-curry", price: 350, isVeg: false, isBestseller: false, isPopular: false, description: "Fresh prawns cooked in tangy and spicy coastal curry.", image: "https://images.unsplash.com/photo-1559737753-5e91666240f9?auto=format&fit=crop&w=600&q=80" },
  { id: 25,  name: "EGG CURRY",             category: "non-veg-curry", price: 150, isVeg: false, isBestseller: false, isPopular: true,  description: "Boiled eggs cooked in flavorful onion-tomato masala.", image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80" },
  { id: 26,  name: "EGG KEEMA CURRY",       category: "non-veg-curry", price: 150, isVeg: false, isBestseller: false, isPopular: false, description: "Minced eggs cooked with green peas and dry spices.", image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80" },

  // ==================== TANDOORI SECTION ====================
  { id: 27,  name: "TANGEDI KABAB",          category: "tandoori", price: 300, isVeg: false, isBestseller: true,  isPopular: true,  description: "Chicken drumsticks marinated in rich tandoori spices and grilled.", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80" },
  { id: 28,  name: "THANDOORI HALF CHICKEN", category: "tandoori", price: 300, isVeg: false, isBestseller: true,  isPopular: false, description: "Half chicken marinated in yogurt and hot tandoori spices.", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80" },
  { id: 29,  name: "THANDOORI FULL CHICKEN", category: "tandoori", price: 600, isVeg: false, isBestseller: false, isPopular: true,  description: "Whole chicken roasted in clay oven with traditional spices.", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80" },
  { id: 30,  name: "CHICKEN TIKKA",          category: "tandoori", price: 249, isVeg: false, isBestseller: false, isPopular: true,  description: "Spicy skewered chicken cubes grilled in tandoor.", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80" },
  { id: 31,  name: "PANEER TIKKA",          category: "tandoori", price: 249, isVeg: true,  isBestseller: false, isPopular: false, description: "Marinated cottage cheese cubes grilled to golden perfection.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80" },

  // ==================== INDIAN BREAD ====================
  { id: 32,  name: "BUTTER NAAN",           category: "bread", price: 45,  isVeg: true,  isBestseller: true,  isPopular: true,  description: "Leavened flatbread brushed with lots of fresh butter.", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80" },
  { id: 33,  name: "PLANE NAAN",            category: "bread", price: 35,  isVeg: true,  isBestseller: false, isPopular: true,  description: "Classic clay oven baked leavened flatbread.", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80" },
  { id: 34,  name: "BUTTER ROTI",           category: "bread", price: 30,  isVeg: true,  isBestseller: false, isPopular: false, description: "Whole wheat round bread baked in tandoor with butter.", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80" },
  { id: 35,  name: "ROTI",                  category: "bread", price: 25,  isVeg: true,  isBestseller: false, isPopular: false, description: "Tandoori roti made of whole wheat flour.", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80" },
  { id: 36,  name: "PULKA",                 category: "bread", price: 10,  isVeg: true,  isBestseller: false, isPopular: true,  description: "Soft, oil-free puffed flatbread.", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80" },

  // ==================== VEG GRAVY ====================
  { id: 37,  name: "KAJU MASALA",           category: "veg-curry", price: 220, isVeg: true,  isBestseller: true,  isPopular: true,  description: "Golden roasted cashews cooked in rich creamy onion gravy.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 38,  name: "KAJU PANEER",           category: "veg-curry", price: 220, isVeg: true,  isBestseller: true,  isPopular: true,  description: "Rich combination of roasted cashews and fresh cottage cheese.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 39,  name: "KAJU TOMOTO CURRY",     category: "veg-curry", price: 200, isVeg: true,  isBestseller: false, isPopular: false, description: "Cashews and tomatoes cooked together in a tangy curry.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 40,  name: "MASHROOM MASALA",       category: "veg-curry", price: 200, isVeg: true,  isBestseller: false, isPopular: true,  description: "Mushroom buttons simmered in thick onion-tomato gravy.", image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80" },
  { id: 41,  name: "MENTHI CHAMAN",         category: "veg-curry", price: 200, isVeg: true,  isBestseller: false, isPopular: false, description: "Grated paneer cooked with fresh fenugreek leaves and cream.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 42,  name: "PANEER BUTTER MASALA",  category: "veg-curry", price: 200, isVeg: true,  isBestseller: true,  isPopular: true,  description: "Soft cottage cheese cooked in creamy tomato butter gravy.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 43,  name: "PALAK PANNER",          category: "veg-curry", price: 200, isVeg: true,  isBestseller: false, isPopular: true,  description: "Paneer cubes cooked in a smooth spiced spinach purée.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 44,  name: "MIX VEG CURRY",         category: "veg-curry", price: 180, isVeg: true,  isBestseller: false, isPopular: false, description: "Fresh seasonal vegetables cooked in a spiced curry base.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 45,  name: "PLANE PALAK",           category: "veg-curry", price: 120, isVeg: true,  isBestseller: false, isPopular: false, description: "Fresh spinach purée cooked with traditional spices.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 46,  name: "TOMOTO CURRY",          category: "veg-curry", price: 120, isVeg: true,  isBestseller: false, isPopular: false, description: "Tangy tomato pieces cooked with spices.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 47,  name: "DAL FRY",               category: "veg-curry", price: 120, isVeg: true,  isBestseller: false, isPopular: true,  description: "Yellow lentils cooked with onions, tomatoes, and garlic.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 48,  name: "DAL TADKA",             category: "veg-curry", price: 120, isVeg: true,  isBestseller: false, isPopular: false, description: "Dal tempered with spices, ghee, and roasted cumin.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
  { id: 49,  name: "MALAI KOPTHA CURRY",    category: "veg-curry", price: 200, isVeg: true,  isBestseller: true,  isPopular: true,  description: "Crispy vegetable dumplings cooked in rich creamy spiced gravy.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },

  // ==================== DESERTS & DRINKS ====================
  { id: 50,  name: "AMUL ICE CREAM",        category: "drinks", price: 12,  isVeg: true,  isBestseller: false, isPopular: true,  description: "Rich premium scoop of Amul ice cream.", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80" },
  { id: 51,  name: "THUMBS UP",             category: "drinks", price: 25,  isVeg: true,  isBestseller: false, isPopular: true,  description: "Chilled Thumbs Up soft drink bottle.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
  { id: 52,  name: "GOLI SODA",             category: "drinks", price: 20,  isVeg: true,  isBestseller: false, isPopular: false, description: "Traditional sweet goli soda.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
  { id: 53,  name: "RED BULL",              category: "drinks", price: 125, isVeg: true,  isBestseller: false, isPopular: true,  description: "Red Bull energy drink.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
  { id: 54,  name: "BUDWEISER",             category: "drinks", price: 100, isVeg: true,  isBestseller: false, isPopular: false, description: "Budweiser non-alcoholic drink.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
  { id: 55,  name: "MONSTER",               category: "drinks", price: 120, isVeg: true,  isBestseller: false, isPopular: false, description: "Monster energy drink can.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
  { id: 56,  name: "WATER BOTTLE (SMALL)",  category: "drinks", price: 10,  isVeg: true,  isBestseller: false, isPopular: false, description: "Chilled mineral water bottle.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
  { id: 57,  name: "WATER BOTTLE (BIG)",    category: "drinks", price: 20,  isVeg: true,  isBestseller: false, isPopular: false, description: "Chilled mineral water bottle (1L).", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
  { id: 58,  name: "LASSI",                 category: "drinks", price: 40,  isVeg: true,  isBestseller: true,  isPopular: true,  description: "Creamy traditional sweet lassi.", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80" },

  // ==================== BIRYANI ITEMS ====================
  // Non-Veg Biryanis
  { id: 59,  name: "CHICKEN DUM BIRYANI",   category: "biryani", price: 210, isVeg: false, isBestseller: true,  isPopular: true,  description: "Slow-cooked chicken dum biryani with fragrant spices.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 60,  name: "SP CHICKEN BIRYANI",    category: "biryani", price: 220, isVeg: false, isBestseller: true,  isPopular: true,  description: "Special aromatic chicken biryani prepared freshly.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 61,  name: "CHICKEN FRY PIECE BIRYANI",category: "biryani", price: 210, isVeg: false, isBestseller: false, isPopular: true,  description: "Biryani rice served with crispy chicken fry pieces.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 62,  name: "LOLIPOP BIRYANI",       category: "biryani", price: 300, isVeg: false, isBestseller: true,  isPopular: false, description: "Biryani rice served with delicious chicken lollipops.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 63,  name: "MOGALAL BIRYANI",       category: "biryani", price: 320, isVeg: false, isBestseller: false, isPopular: false, description: "Rich royal Mughal-style aromatic biryani.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 64,  name: "MUTTON DUM BIRYANI",    category: "biryani", price: 350, isVeg: false, isBestseller: true,  isPopular: true,  description: "Slow cooked tender mutton dum biryani.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 65,  name: "MUTTON FRY PIECE BIRYANI",category: "biryani", price: 350, isVeg: false, isBestseller: false, isPopular: false, description: "Basmati rice served with spicy mutton fry pieces.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 66,  name: "PRAWN BIRYANI",         category: "biryani", price: 350, isVeg: false, isBestseller: false, isPopular: false, description: "Seafood biryani with sautéed prawns and spices.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 67,  name: "EGG BIRYANI",           category: "biryani", price: 190, isVeg: false, isBestseller: false, isPopular: true,  description: "Spiced biryani rice served with boiled eggs.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },

  // Veg Biryanis
  { id: 68,  name: "VEG BIRYANI",           category: "biryani", price: 180, isVeg: true,  isBestseller: false, isPopular: true,  description: "Fragrant rice cooked with garden-fresh veggies.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 69,  name: "PANEER BIRYANI",        category: "biryani", price: 200, isVeg: true,  isBestseller: false, isPopular: false, description: "Fragrant rice served with spiced paneer cubes.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 70,  name: "MASHROOM BIRYANI",      category: "biryani", price: 200, isVeg: true,  isBestseller: false, isPopular: false, description: "Aromatic biryani cooked with mushroom buttons.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 71,  name: "KAJU BIRYANI",          category: "biryani", price: 200, isVeg: true,  isBestseller: true,  isPopular: true,  description: "Biryani rice flavored with roasted cashews and ghee.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 72,  name: "PLANE BIRYANI",         category: "biryani", price: 150, isVeg: true,  isBestseller: false, isPopular: false, description: "Aromatic seasoned biryani rice.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },

  // Family Pack Biryanis
  { id: 73,  name: "CHICKEN BIRYANI",       category: "biryani", price: 600, isVeg: false, isBestseller: true,  isPopular: true,  description: "Large chicken biryani pack serving 3-4 people.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 74,  name: "SPL CHICKEN BIRYANI",   category: "biryani", price: 700, isVeg: false, isBestseller: true,  isPopular: false, description: "Premium special chicken biryani serving 3-4 people.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 75,  name: "BUCKET CHICKEN BIRYANI",category: "biryani", price: 900, isVeg: false, isBestseller: false, isPopular: true,  description: "Bucket of chicken biryani serving 5-6 people.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 76,  name: "MUTTON BIRYANI",        category: "biryani", price: 1000,isVeg: false, isBestseller: false, isPopular: false, description: "Large mutton dum biryani pack serving 3-4 people.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },

  // ==================== MANDI ====================
  { id: 77,  name: "Adhiratha Spl Mandi Biryani",category: "mandi", price: 900, isVeg: false, isBestseller: true,  isPopular: true,  description: "Signature smoked Mandi platter with special toppings.", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80" },
  { id: 78,  name: "Mixed Mandi Biryani",   category: "mandi", price: 1299,isVeg: false, isBestseller: true,  isPopular: true,  description: "Smoked Mandi rice platter served with mixed meats.", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80" },

  // ==================== SOUPS ====================
  { id: 79,  name: "SWEET CORN SOUP",       category: "soups", price: 79,  isVeg: true,  isBestseller: false, isPopular: false, description: "Warm sweet corn soup.", image: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?auto=format&fit=crop&w=600&q=80" },
  { id: 80,  name: "HOT & SOUR SOUP",       category: "soups", price: 79,  isVeg: true,  isBestseller: false, isPopular: false, description: "Tangy and hot veg clear soup.", image: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?auto=format&fit=crop&w=600&q=80" },
  { id: 81,  name: "CHICKEN CORN SOUP",     category: "soups", price: 119, isVeg: false, isBestseller: false, isPopular: true,  description: "Thick corn soup with shredded chicken.", image: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?auto=format&fit=crop&w=600&q=80" },
  { id: 82,  name: "CHICKEN HOT & SOUR SOUP",category: "soups", price: 119, isVeg: false, isBestseller: false, isPopular: true,  description: "Spicy chicken soup.", image: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?auto=format&fit=crop&w=600&q=80" },

  // ==================== FRY ITEMS ====================
  { id: 83,  name: "Chicken 65",             category: "fry-items", price: 300, isVeg: false, isBestseller: true,  isPopular: true,  description: "Spicy red fried chicken chunks.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 84,  name: "Chicken Lollipop Full",  category: "fry-items", price: 300, isVeg: false, isBestseller: true,  isPopular: true,  description: "Delicious fried chicken lollipops (Full portion).", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 85,  name: "Chicken Lollipop Half",  category: "fry-items", price: 180, isVeg: false, isBestseller: false, isPopular: false, description: "Fried chicken lollipops (Half portion).", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 86,  name: "Chicken 555",            category: "fry-items", price: 300, isVeg: false, isBestseller: false, isPopular: true,  description: "Spicy shredded chicken starter.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 87,  name: "Chilli Chicken",         category: "fry-items", price: 250, isVeg: false, isBestseller: false, isPopular: false, description: "Chilli seasoned chicken starter.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 88,  name: "Chicken Manchurian",     category: "fry-items", price: 300, isVeg: false, isBestseller: false, isPopular: false, description: "Wok-tossed sweet and sour chicken starter.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 89,  name: "Chicken Majestic",       category: "fry-items", price: 300, isVeg: false, isBestseller: false, isPopular: true,  description: "Dry fried strips of chicken coated with yoghurt-spice mix.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 90,  name: "Chicken RR",             category: "fry-items", price: 300, isVeg: false, isBestseller: false, isPopular: false, description: "Spicy Andhra-style red chicken dry starter.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 91,  name: "Pepper Chicken",         category: "fry-items", price: 320, isVeg: false, isBestseller: false, isPopular: false, description: "Chicken stir-fried with black pepper and spices.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 92,  name: "Chicken Fry",            category: "fry-items", price: 220, isVeg: false, isBestseller: false, isPopular: false, description: "Classic hot Andhra chicken fry.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 93,  name: "Chicken Wings Half",     category: "fry-items", price: 180, isVeg: false, isBestseller: false, isPopular: false, description: "Crispy chicken wings (Half).", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 94,  name: "Chicken Wings Full",     category: "fry-items", price: 300, isVeg: false, isBestseller: false, isPopular: false, description: "Crispy chicken wings (Full).", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 95,  name: "Dragon Chicken",         category: "fry-items", price: 350, isVeg: false, isBestseller: false, isPopular: false, description: "Spicy fried chicken strips tossed in sweet chili sauce.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 96,  name: "Chicken Mangoliya",      category: "fry-items", price: 320, isVeg: false, isBestseller: false, isPopular: false, description: "Mild, fragrant chicken tossed with spices.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },
  { id: 97,  name: "Mutton Fry",             category: "fry-items", price: 350, isVeg: false, isBestseller: true,  isPopular: true,  description: "Tender fried mutton pieces tossed in local spices.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80" },

  // ==================== FISH ====================
  { id: 98,  name: "Appolo Fish",            category: "fish", price: 400, isVeg: false, isBestseller: true,  isPopular: true,  description: "Batter-fried fish fillets tossed in rich spicy yoghurt sauce.", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },
  { id: 99,  name: "Fish Fry (3 Pcs)",       category: "fish", price: 200, isVeg: false, isBestseller: false, isPopular: true,  description: "Crispy tawa fried fish pieces with masala.", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },
  { id: 100, name: "SPL Fish Fry",           category: "fish", price: 220, isVeg: false, isBestseller: false, isPopular: false, description: "Special tawa fried fish fillet.", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },

  // ==================== PRAWNS ====================
  { id: 101, name: "Loose Prawn",            category: "prawns", price: 350, isVeg: false, isBestseller: true,  isPopular: true,  description: "Batter fried prawns tossed with onion, garlic, and chilies.", image: "https://images.unsplash.com/photo-1559737753-5e91666240f9?auto=format&fit=crop&w=600&q=80" },
  { id: 102, name: "Prawn Fry",              category: "prawns", price: 350, isVeg: false, isBestseller: false, isPopular: false, description: "Spicy fried coastal prawns dry.", image: "https://images.unsplash.com/photo-1559737753-5e91666240f9?auto=format&fit=crop&w=600&q=80" },

  // ==================== EGG ====================
  { id: 103, name: "Egg Chilli",             category: "egg", price: 150, isVeg: false, isBestseller: false, isPopular: false, description: "Fried eggs tossed in sweet and hot chili sauce.", image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80" },
  { id: 104, name: "Egg Bhurji",             category: "egg", price: 150, isVeg: false, isBestseller: false, isPopular: true,  description: "Scrambled eggs with onions, green chilies, and herbs.", image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80" },
  { id: 105, name: "Boiled Egg (2)",         category: "egg", price: 40,  isVeg: false, isBestseller: false, isPopular: false, description: "Freshly boiled eggs (two).", image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80" },
  { id: 106, name: "Egg Fry",                category: "egg", price: 150, isVeg: false, isBestseller: false, isPopular: false, description: "Boiled egg stir-fried with hot spices.", image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80" }
];

/* --------------------------------------------------------------------------
   Today's Specials (rotates or set by admin)
   -------------------------------------------------------------------------- */
const TODAYS_SPECIALS = [59, 77, 21, 83, 98, 58]; // item IDs

/* --------------------------------------------------------------------------
   Offers
   -------------------------------------------------------------------------- */
const OFFERS = [
  {
    id: 1,
    title: "20% OFF on First Order!",
    description: "Use code WELCOME20 and get 20% off on your first order. Min order ₹300.",
    code: "WELCOME20",
    badge: "New User",
    gradient: "linear-gradient(135deg, #d4a843, #f5c518)"
  },
  {
    id: 2,
    title: "Family Biryani Combo",
    description: "Order Family Biryani + 2 Starters at just ₹699. Save ₹150!",
    code: "FAMILY50",
    badge: "Combo",
    gradient: "linear-gradient(135deg, #e74c3c, #c0392b)"
  },
  {
    id: 3,
    title: "Free Delivery Above ₹500",
    description: "No delivery charge on orders above ₹500. Order now!",
    code: null,
    badge: "Free Delivery",
    gradient: "linear-gradient(135deg, #2ecc71, #27ae60)"
  }
];

/* --------------------------------------------------------------------------
   Sample Reviews (pre-seeded)
   -------------------------------------------------------------------------- */
const SAMPLE_REVIEWS = [
  { id: 1, name: "Ramesh Kumar",      rating: 5, comment: "Best biryani in Pamuru! The chicken dum biryani is absolutely delicious. Will definitely order again.", date: "2026-06-15", avatar: "RK" },
  { id: 2, name: "Priya Reddy",       rating: 4, comment: "Loved the ambiance and AC seating. Paneer butter masala was excellent. Slightly delayed delivery though.", date: "2026-06-20", avatar: "PR" },
  { id: 3, name: "Venkat Rao",        rating: 5, comment: "Mutton mandi is out of this world! Authentic Arabian flavor. Family loved it. Highly recommend!", date: "2026-06-25", avatar: "VR" },
  { id: 4, name: "Lakshmi Devi",      rating: 5, comment: "Wonderful family restaurant. Kids enjoyed the ice cream and mocktails. Great service!", date: "2026-07-01", avatar: "LD" },
  { id: 5, name: "Mohammed Shaik",    rating: 4, comment: "Good food quality and reasonable prices. Fish fry and prawns curry were amazing!", date: "2026-07-03", avatar: "MS" },
  { id: 6, name: "Srinivas Reddy",    rating: 5, comment: "Tandoori chicken is the best I've had in this area. The staff is very friendly and courteous.", date: "2026-07-05", avatar: "SR" }
];

/* --------------------------------------------------------------------------
   Helper Functions
   -------------------------------------------------------------------------- */
function getItemById(id) {
  return MENU_ITEMS.find(item => item.id === id);
}

function getItemsByCategory(categoryId) {
  return MENU_ITEMS.filter(item => item.category === categoryId);
}

function getBestsellers() {
  return MENU_ITEMS.filter(item => item.isBestseller);
}

function getPopularItems() {
  return MENU_ITEMS.filter(item => item.isPopular);
}

function searchMenu(query) {
  const q = query.toLowerCase().trim();
  return MENU_ITEMS.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  );
}

function getCategoryName(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  return cat ? cat.name : categoryId;
}

function getTodaysSpecials() {
  return TODAYS_SPECIALS.map(id => getItemById(id)).filter(Boolean);
}

function validateCoupon(code, subtotal) {
  const coupon = COUPONS.find(c => c.code === code.toUpperCase() && c.active);
  if (!coupon) return { valid: false, message: "Invalid coupon code" };
  if (subtotal < coupon.minOrder) return { valid: false, message: `Minimum order ₹${coupon.minOrder} required` };
  const discount = Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount);
  return { valid: true, discount, coupon, message: `${coupon.description} — You save ₹${discount}!` };
}

/* --------------------------------------------------------------------------
   Generate placeholder food image (SVG fallback)
   -------------------------------------------------------------------------- */
function getFoodPlaceholder(name, emoji) {
  const colors = ['#d4a843', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'];
  const color = colors[name.length % colors.length];
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#1a1a1a"/>
      <rect x="0" y="0" width="400" height="300" fill="${color}" opacity="0.15"/>
      <text x="200" y="130" font-size="60" text-anchor="middle">${emoji || '🍽️'}</text>
      <text x="200" y="190" font-family="Arial" font-size="16" fill="#d4a843" text-anchor="middle" font-weight="bold">${name}</text>
      <text x="200" y="215" font-family="Arial" font-size="12" fill="#888" text-anchor="middle">ADHIRATHA RESTAURANT</text>
    </svg>
  `)}`;
}
