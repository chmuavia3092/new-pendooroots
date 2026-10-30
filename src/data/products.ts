/**
 * PENDOOROOTS — Product Catalog
 * Source of truth for all product data
 */

export interface Product {
  id: number;
  slug: string;
  name: string;
  variant: string;
  category: string;
  collection: 'kitchen' | 'rose' | 'aloe' | 'premium';
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  image: string;
  images: string[];
  description: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  sizes: string[];
  relatedIds: number[];
}

export const products: Product[] = [
  {
    id: 1,
    slug: 'lemoo-washer',
    name: 'LEMOO Washer',
    variant: '500ml',
    category: 'Kitchen Care',
    collection: 'kitchen',
    price: 320,
    oldPrice: 400,
    rating: 4.9,
    reviews: 892,
    stock: 150,
    badge: 'Hero Product',
    image: '/images/lemoo-washer.png',
    images: ['/images/lemoo-washer.png'],
    description: 'The LEMOO Washer — Make Every Dish Shine. Our signature dish wash combines the power of natural lemon extract with gentle botanical surfactants. Grease lifter, skin friendly, and delivers perfect shine. Every purchase donates Rs.20 to #saveGAZAmovement.',
    ingredients: ['Lemon Extract', 'Coconut-derived Surfactant', 'Aloe Vera', 'Vitamin E', 'Citronella Essential Oil'],
    benefits: ['Grease Lifting Power', 'Skin Friendly', 'Perfect Shine', 'Natural Lemon Fragrance', 'Eco-Friendly Formula'],
    howToUse: 'Apply a small amount to sponge or directly on dishes. Lather and rinse thoroughly. A little goes a long way.',
    sizes: ['500ml', '1L'],
    relatedIds: [2, 13, 15]
  },
  {
    id: 2,
    slug: 'lemoo-washer-large',
    name: 'LEMOO Washer',
    variant: '1L Family Pack',
    category: 'Kitchen Care',
    collection: 'kitchen',
    price: 500,
    oldPrice: 600,
    rating: 4.9,
    reviews: 612,
    stock: 95,
    badge: 'Best Value',
    image: '/images/lemoo-washer-family-pack.webp',
    images: ['/images/lemoo-washer-family-pack.webp'],
    description: 'The larger size of our hero LEMOO Washer. Perfect for families who value clean ingredients and sparkling dishes. Grease lifter, skin friendly, perfect shine.',
    ingredients: ['Lemon Extract', 'Coconut-derived Surfactant', 'Aloe Vera', 'Vitamin E', 'Citronella Essential Oil'],
    benefits: ['Economical Family Size', 'Grease Lifting Power', 'Skin Friendly', 'Natural Lemon Fragrance', 'Eco-Friendly'],
    howToUse: 'Apply a small amount to sponge or directly on dishes. Lather and rinse thoroughly.',
    sizes: ['500ml', '1L'],
    relatedIds: [1, 13, 14]
  },
  {
    id: 3,
    slug: 'rose-hand-wash',
    name: 'Rose Petal Hand Wash',
    variant: '250ml',
    category: 'Hand Care',
    collection: 'rose',
    price: 450,
    oldPrice: null,
    rating: 4.7,
    reviews: 189,
    stock: 73,
    badge: 'New',
    image: '/images/rose-hand-wash.jpg',
    images: ['/images/rose-hand-wash.jpg'],
    description: 'Enriched with real rose petal extract, this luxurious hand wash transforms hand washing into a sensory ritual. Gentle enough for frequent use.',
    ingredients: ['Rosa Damascena Extract', 'Glycerin', 'Aloe Vera', 'Vitamin E', 'Rose Essential Oil'],
    benefits: ['Moisturizing Formula', 'Natural Rose Fragrance', 'Gentle on Skin', 'Antibacterial', 'Paraben Free'],
    howToUse: 'Wet hands, apply a pump, lather for 20 seconds, and rinse. Follow with PendooRoots hand cream.',
    sizes: ['250ml', '500ml'],
    relatedIds: [4, 6, 8]
  },
  {
    id: 4,
    slug: 'aloe-vera-hand-wash',
    name: 'Aloe Vera Hand Wash',
    variant: '250ml',
    category: 'Hand Care',
    collection: 'aloe',
    price: 450,
    oldPrice: null,
    rating: 4.8,
    reviews: 267,
    stock: 91,
    badge: null,
    image: '/images/aloe-hand-wash.jpg',
    images: ['/images/aloe-hand-wash.jpg'],
    description: 'Pure aloe vera hand wash that cleanses and soothes simultaneously. Perfect for sensitive skin and frequent hand washers.',
    ingredients: ['Aloe Barbadensis Leaf Juice', 'Coconut-derived Surfactant', 'Glycerin', 'Vitamin E', 'Chamomile Extract'],
    benefits: ['Soothes Irritated Skin', 'Deeply Moisturizing', 'pH Balanced', 'Hypoallergenic', 'Cruelty Free'],
    howToUse: 'Wet hands, apply a pump, lather gently, and rinse. Safe for all ages.',
    sizes: ['250ml', '500ml'],
    relatedIds: [3, 5, 7]
  },
  {
    id: 5,
    slug: 'rose-body-wash',
    name: 'Rose Body Wash',
    variant: '400ml',
    category: 'Body Care',
    collection: 'rose',
    price: 650,
    oldPrice: 750,
    rating: 4.9,
    reviews: 345,
    stock: 48,
    badge: 'Popular',
    image: '/images/rose-body-wash.jpg',
    images: ['/images/rose-body-wash.jpg'],
    description: 'A shower experience fit for royalty. Infused with real rose extract and enriched with shea butter for skin that feels petal-soft.',
    ingredients: ['Rosa Damascena Extract', 'Shea Butter', 'Coconut Oil', 'Glycerin', 'Rose Essential Oil'],
    benefits: ['Luxurious Lather', 'Deep Hydration', 'Natural Rose Scent', 'Sulfate Free', 'Long-Lasting Fragrance'],
    howToUse: 'Apply to wet skin, massage in circular motions, rinse. For best results, follow with PendooRoots body lotion.',
    sizes: ['200ml', '400ml'],
    relatedIds: [6, 3, 8]
  },
  {
    id: 6,
    slug: 'aloe-vera-body-wash',
    name: 'Aloe Vera Body Wash',
    variant: '400ml',
    category: 'Body Care',
    collection: 'aloe',
    price: 650,
    oldPrice: null,
    rating: 4.7,
    reviews: 198,
    stock: 56,
    badge: null,
    image: '/images/aloe-hand-wash.jpg',
    images: ['/images/aloe-hand-wash.jpg'],
    description: 'Cool, refreshing, and deeply nourishing. Our aloe vera body wash turns your daily shower into a spa-like escape.',
    ingredients: ['Aloe Barbadensis Leaf Juice', 'Cucumber Extract', 'Vitamin E', 'Coconut-derived Surfactant', 'Green Tea Extract'],
    benefits: ['Cooling Sensation', 'Soothes Sun-Exposed Skin', 'Lightweight Formula', 'Refreshing Aroma', 'Dermatologically Tested'],
    howToUse: 'Apply to wet skin, gently lather, and rinse. Enjoy the cooling sensation.',
    sizes: ['200ml', '400ml'],
    relatedIds: [5, 4, 7]
  },
  {
    id: 7,
    slug: 'luxury-shampoo',
    name: 'Botanical Luxury Shampoo',
    variant: '300ml',
    category: 'Hair Care',
    collection: 'premium',
    price: 780,
    oldPrice: 880,
    rating: 4.9,
    reviews: 456,
    stock: 34,
    badge: "Editor's Pick",
    image: '/images/luxury-shampoo.webp',
    images: ['/images/luxury-shampoo.webp'],
    description: 'Our premium shampoo formulated with rare botanical extracts. Repairs, strengthens, and adds brilliant shine to every strand.',
    ingredients: ['Argan Oil', 'Keratin', 'Biotin', 'Rosemary Extract', 'Green Tea', 'Coconut Milk'],
    benefits: ['Deep Repair', 'Adds Shine', 'Reduces Frizz', 'Sulfate Free', 'Color Safe', 'Volumizing'],
    howToUse: 'Wet hair thoroughly, apply shampoo, massage into scalp and lengths, leave for 2 minutes, rinse. Follow with conditioner.',
    sizes: ['200ml', '300ml'],
    relatedIds: [8, 5, 6]
  },
  {
    id: 8,
    slug: 'herbal-conditioner',
    name: 'Herbal Conditioner',
    variant: '300ml',
    category: 'Hair Care',
    collection: 'premium',
    price: 750,
    oldPrice: null,
    rating: 4.8,
    reviews: 321,
    stock: 41,
    badge: null,
    image: '/images/herbal-conditioner.jpg',
    images: ['/images/herbal-conditioner.jpg'],
    description: 'Silky smooth conditioning with herbal intelligence. Detangles, nourishes, and protects without weighing hair down.',
    ingredients: ['Hibiscus Extract', 'Fenugreek', 'Amla', 'Coconut Oil', 'Shea Butter', 'Vitamin E'],
    benefits: ['Deep Nourishment', 'Easy Detangling', 'Lightweight Formula', 'Adds Volume', 'Herbal Formula'],
    howToUse: 'After shampooing, apply from mid-lengths to ends. Leave for 3 minutes, rinse with cool water.',
    sizes: ['200ml', '300ml'],
    relatedIds: [7, 5, 3]
  },
  {
    id: 9,
    slug: 'soap-rose',
    name: 'Natural Rose Soap',
    variant: '100g',
    category: 'Soaps',
    collection: 'rose',
    price: 250,
    oldPrice: null,
    rating: 4.6,
    reviews: 567,
    stock: 120,
    badge: null,
    image: '/images/soap-rose.jpg',
    images: ['/images/soap-rose.jpg'],
    description: 'Handcrafted with real rose petals and cold-pressed oils. A bar of pure luxury that pampers your skin with every use.',
    ingredients: ['Rose Petal Powder', 'Coconut Oil', 'Olive Oil', 'Shea Butter', 'Glycerin', 'Vitamin E'],
    benefits: ['Gentle Exfoliation', 'Natural Moisturizing', 'Artisan Crafted', 'No Artificial Colors', 'Long-Lasting Bar'],
    howToUse: 'Lather between wet hands or on a washcloth. Apply to skin, rinse thoroughly.',
    sizes: ['100g'],
    relatedIds: [10, 11, 3]
  },
  {
    id: 10,
    slug: 'soap-aloe',
    name: 'Natural Aloe Vera Soap',
    variant: '100g',
    category: 'Soaps',
    collection: 'aloe',
    price: 250,
    oldPrice: null,
    rating: 4.7,
    reviews: 489,
    stock: 110,
    badge: null,
    image: '/images/soap-aloe.jpg',
    images: ['/images/soap-aloe.jpg'],
    description: 'Cool, soothing, and refreshing. Made with pure aloe vera gel for skin that feels calm and deeply hydrated.',
    ingredients: ['Aloe Barbadensis Gel', 'Coconut Oil', 'Jojoba Oil', 'Glycerin', 'Vitamin E', 'Neem Extract'],
    benefits: ['Soothes Sensitive Skin', 'Deep Hydration', 'Natural Antibacterial', 'pH Balanced', 'Gentle Daily Use'],
    howToUse: 'Lather between wet hands or on a washcloth. Apply to skin, rinse thoroughly.',
    sizes: ['100g'],
    relatedIds: [9, 11, 4]
  },
  {
    id: 11,
    slug: 'soap-charcoal',
    name: 'Charcoal Detox Soap',
    variant: '100g',
    category: 'Soaps',
    collection: 'premium',
    price: 280,
    oldPrice: null,
    rating: 4.8,
    reviews: 345,
    stock: 78,
    badge: 'Trending',
    image: '/images/soap-charcoal.jpg',
    images: ['/images/soap-charcoal.jpg'],
    description: 'Activated bamboo charcoal draws out impurities while tea tree oil fights bacteria. Deep clean for troubled skin.',
    ingredients: ['Activated Bamboo Charcoal', 'Tea Tree Oil', 'Coconut Oil', 'Shea Butter', 'Eucalyptus Oil', 'Glycerin'],
    benefits: ['Deep Pore Cleansing', 'Oil Control', 'Antibacterial', 'Detoxifying', 'Refreshing Scent'],
    howToUse: 'Lather between wet hands. Apply to face or body, massage gently, rinse. Use 2-3 times per week.',
    sizes: ['100g'],
    relatedIds: [12, 9, 10]
  },
  {
    id: 12,
    slug: 'soap-lavender',
    name: 'Lavender Dream Soap',
    variant: '100g',
    category: 'Soaps',
    collection: 'premium',
    price: 300,
    oldPrice: 350,
    rating: 4.9,
    reviews: 623,
    stock: 65,
    badge: 'Bestseller',
    image: '/images/soap-lavender.jpg',
    images: ['/images/soap-lavender.jpg'],
    description: 'Calming lavender from the fields of Provence meets nourishing butters. A spa-like experience in every lather.',
    ingredients: ['Lavender Essential Oil', 'French Clay', 'Shea Butter', 'Olive Oil', 'Vitamin E', 'Oat Extract'],
    benefits: ['Calming Aroma', 'Gentle Cleansing', 'Stress Relief', 'Suitable for Sensitive Skin', 'Handcrafted'],
    howToUse: 'Lather between wet hands. Apply to skin, breathe in the calming scent, rinse.',
    sizes: ['100g'],
    relatedIds: [9, 11, 7]
  },
  {
    id: 13,
    slug: 'neem-face-wash',
    name: 'Neem Purifying Face Wash',
    variant: '150ml',
    category: 'Skin Care',
    collection: 'premium',
    price: 420,
    oldPrice: null,
    rating: 4.6,
    reviews: 178,
    stock: 89,
    badge: null,
    image: '/images/neem-face-wash.jpg',
    images: ['/images/neem-face-wash.jpg'],
    description: 'Powerful neem extracts purify pores without stripping moisture. Ideal for oily and combination skin types.',
    ingredients: ['Neem Leaf Extract', 'Tea Tree Oil', 'Salicylic Acid', 'Green Tea', 'Witch Hazel', 'Aloe Vera'],
    benefits: ['Controls Excess Oil', 'Prevents Breakouts', 'Deep Cleansing', 'Tightens Pores', 'Gentle Formula'],
    howToUse: 'Wet face, apply a small amount, massage in circular motions for 60 seconds, rinse. Use morning and evening.',
    sizes: ['100ml', '150ml'],
    relatedIds: [14, 1, 11]
  },
  {
    id: 14,
    slug: 'rose-face-wash',
    name: 'Rose Brightening Face Wash',
    variant: '150ml',
    category: 'Skin Care',
    collection: 'rose',
    price: 450,
    oldPrice: null,
    rating: 4.8,
    reviews: 256,
    stock: 72,
    badge: 'New',
    image: '/images/rose-face-wash.jpg',
    images: ['/images/rose-face-wash.jpg'],
    description: 'Rose water and vitamin C work together to brighten dull skin and even out tone. A gentle daily luxury.',
    ingredients: ['Rose Water', 'Vitamin C', 'Hyaluronic Acid', 'Niacinamide', 'Glycerin', 'Aloe Vera'],
    benefits: ['Brightens Complexion', 'Evens Skin Tone', 'Hydrating Formula', 'Anti-Aging Properties', 'Dermatologically Tested'],
    howToUse: 'Wet face, apply a small amount, massage gently, rinse. Use morning and evening for best results.',
    sizes: ['100ml', '150ml'],
    relatedIds: [13, 3, 5]
  },
  {
    id: 15,
    slug: 'kitchen-cleaner',
    name: 'Natural Kitchen Cleaner',
    variant: '500ml',
    category: 'Kitchen Care',
    collection: 'kitchen',
    price: 420,
    oldPrice: null,
    rating: 4.7,
    reviews: 198,
    stock: 94,
    badge: null,
    image: '/images/kitchen-cleaner.jpg',
    images: ['/images/kitchen-cleaner.jpg'],
    description: 'Cuts through kitchen grease and grime with the power of nature. Safe for all kitchen surfaces.',
    ingredients: ['Citric Acid', 'Coconut-derived Surfactant', 'Lemon Essential Oil', 'Tea Tree Oil', 'Rosemary Extract'],
    benefits: ['Powerful Degreaser', 'Natural Antibacterial', 'Safe on All Surfaces', 'Pleasant Citrus Scent', 'Non-Toxic'],
    howToUse: 'Spray directly on surface, wipe with a clean cloth. For tough stains, let sit for 2 minutes before wiping.',
    sizes: ['500ml', '1L'],
    relatedIds: [16, 17, 1]
  },
  {
    id: 16,
    slug: 'glass-cleaner',
    name: 'Streak-Free Glass Cleaner',
    variant: '500ml',
    category: 'Kitchen Care',
    collection: 'kitchen',
    price: 390,
    oldPrice: null,
    rating: 4.8,
    reviews: 312,
    stock: 87,
    badge: null,
    image: '/images/glass-cleaner.jpg',
    images: ['/images/glass-cleaner.jpg'],
    description: 'Crystal-clear results on glass, mirrors, and screens. Vinegar-based formula leaves absolutely no streaks.',
    ingredients: ['White Vinegar', 'Cornstarch', 'Lemon Essential Oil', 'Purified Water', 'Plant-based Surfactant'],
    benefits: ['Streak-Free Finish', 'Natural Formula', 'Multi-Surface', 'Fast Drying', 'Ammonia Free'],
    howToUse: 'Spray 6-8 inches from surface. Wipe with a microfiber cloth in circular motions for best results.',
    sizes: ['500ml', '1L'],
    relatedIds: [15, 17, 2]
  },
  {
    id: 17,
    slug: 'floor-cleaner',
    name: 'Herbal Floor Cleaner',
    variant: '1L',
    category: 'Kitchen Care',
    collection: 'kitchen',
    price: 550,
    oldPrice: 620,
    rating: 4.7,
    reviews: 156,
    stock: 68,
    badge: null,
    image: '/images/floor-cleaner.jpg',
    images: ['/images/floor-cleaner.jpg'],
    description: 'Neem and eucalyptus combine to clean floors while leaving a fresh herbal scent that lasts for hours.',
    ingredients: ['Neem Extract', 'Eucalyptus Oil', 'Coconut-derived Surfactant', 'Citric Acid', 'Tea Tree Oil'],
    benefits: ['Antibacterial Protection', 'Long-Lasting Fresh Scent', 'Safe for All Floor Types', 'Natural Formula', 'Economical'],
    howToUse: 'Dilute 2 capfuls in 4 liters of water. Mop floor as usual. No rinsing required.',
    sizes: ['500ml', '1L', '2L'],
    relatedIds: [15, 16, 18]
  },
  {
    id: 18,
    slug: 'fabric-wash',
    name: 'Gentle Fabric Wash',
    variant: '1L',
    category: 'Home Care',
    collection: 'kitchen',
    price: 650,
    oldPrice: null,
    rating: 4.8,
    reviews: 234,
    stock: 55,
    badge: 'Premium',
    image: '/images/fabric-wash.jpg',
    images: ['/images/fabric-wash.jpg'],
    description: 'Plant-based formula that cares for your fabrics as much as you do. Gentle on colors, tough on stains.',
    ingredients: ['Coconut-derived Surfactant', 'Aloe Vera', 'Lavender Essential Oil', 'Enzyme Complex', 'Plant-based Softener'],
    benefits: ['Color Safe', 'Gentle on Fabrics', 'Effective Stain Removal', 'Natural Softening', 'Hypoallergenic'],
    howToUse: 'Add 1-2 capfuls to washing machine. Suitable for hand wash and machine wash. Follow garment care labels.',
    sizes: ['500ml', '1L'],
    relatedIds: [19, 17, 15]
  },
  {
    id: 19,
    slug: 'multipurpose-cleaner',
    name: 'All-Purpose Cleaner',
    variant: '500ml',
    category: 'Home Care',
    collection: 'kitchen',
    price: 580,
    oldPrice: 650,
    rating: 4.6,
    reviews: 187,
    stock: 71,
    badge: null,
    image: '/images/multipurpose-cleaner.jpg',
    images: ['/images/multipurpose-cleaner.jpg'],
    description: 'One bottle for every surface in your home. From countertops to bathroom tiles, this cleaner does it all naturally.',
    ingredients: ['Citric Acid', 'Coconut-derived Surfactant', 'Lemon Essential Oil', 'Thyme Extract', 'Purified Water'],
    benefits: ['Multi-Surface Use', 'Natural Disinfectant', 'Pleasant Citrus Scent', 'Eco-Friendly', 'Concentrated Formula'],
    howToUse: 'Spray on surface, wipe clean. For disinfecting, let sit for 5 minutes before wiping.',
    sizes: ['500ml', '1L'],
    relatedIds: [15, 16, 17]
  }
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCollection(collection: Product['collection']): Product[] {
  return products.filter(p => p.collection === collection);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.slice(0, limit);
}

export function getBestSellers(limit = 4): Product[] {
  return products
    .filter(p => p.rating >= 4.8)
    .slice(0, limit);
}

export function getRelatedProducts(productId: number, limit = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return product.relatedIds
    .map(id => getProductById(id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, limit);
}

export function getHeroProduct(): Product | undefined {
  return products.find(p => p.badge === 'Hero Product') || products[0];
}

export function formatPrice(price: number): string {
  return 'Rs.' + new Intl.NumberFormat('en-PK').format(price);
}