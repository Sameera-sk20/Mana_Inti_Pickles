import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBy4LTB1bYjx7Pxq5P9TiOnxSqH2opCUeY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'mana-inti-pickles.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'mana-inti-pickles',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'mana-inti-pickles.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '795128976148',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:795128976148:web:9ab095f466a68469492801',
};

// 16 products to add (excluding 'andhra avakaya' and 'tomato pickle' which are already in Firestore)
const MISSING_PRODUCTS = [
  // 1. Veg Pickles (remaining)
  {
    name: 'Pandu Mirapakaya Pickle',
    regionalName: 'పండు మిరపకాయ పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Ripe red peppers stone-pounded with country tamarind, garlic pods, and roasted methi essence.',
    detailedDescription: 'Crafted from winter-harvest ripe red chillies stone-pounded with tart native tamarind, whole fried garlic cloves, and fragrant roasted fenugreek powder. A bold, fiery kick with comforting sour undertones.',
    ingredients: ['Fresh Ripe Red Chillies', 'Country Tamarind Pulp', 'Garlic Pods', 'Cold-Pressed Sesame Oil', 'Fenugreek Powder', 'Rock Salt', 'Mustard Tempering'],
    imageUrl: '/src/assets/images/pickle_red_chilli_1793172292271.jpg',
    pricing: { '250g': 175, '500g': 330, '1kg': 620 },
    isAvailable: true,
    spiceLevel: 'Extra Fiery',
    highlightNote: 'Fiery Guntur Chillies',
  },
  {
    name: 'Andhra Gongura Pickle',
    regionalName: 'గోంగూర పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Fresh sorrel leaves slow-cooked and tempered with roasted cumin, whole red chillies, and garlic.',
    detailedDescription: 'The legendary taste of Telugu kitchens. Freshly harvested sour gongura leaves slow-sautéed in sesame oil until silky, pounded with dry red chillies, crushed garlic, and cumin-mustard tempering.',
    ingredients: ['Fresh Gongura Leaves', 'Dry Red Chillies', 'Garlic Cloves', 'Sesame Oil', 'Cumin & Mustard Seeds', 'Sea Salt', 'Turmeric'],
    imageUrl: '/src/assets/images/pickle_andhra_gongura_1793172292859.jpg',
    pricing: { '250g': 190, '500g': 360, '1kg': 690 },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Tangy Andhra Heritage',
  },
  {
    name: 'Lemon Pickle',
    regionalName: 'నిమ్మకాయ నిల్వ పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Sun-cured thin-skinned Kagzi lemons steeped in sea salt, mild turmeric, and compounded hing.',
    detailedDescription: 'Prepared using traditional natural sunlight curing over several weeks until the lemon peel softens to melt-in-the-mouth tenderness. Gently spiced with freshly roasted methi, red chilli, and fragrant hing.',
    ingredients: ['Kagzi Lemons', 'Sea Salt', 'Red Chilli Powder', 'Pure Asafoetida (Hing)', 'Turmeric', 'Fenugreek Seeds'],
    imageUrl: '/src/assets/images/pickle_lemon_nimma_1793172292897.jpg',
    pricing: { '250g': 160, '500g': 300, '1kg': 580 },
    isAvailable: true,
    spiceLevel: 'Medium',
    highlightNote: 'Naturally Sun-Fermented',
  },
  {
    name: 'Mixed Vegetable Pickle',
    regionalName: 'కూరగాయల పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Crunchy cauliflower florets, carrots, and green mango cubes in aromatic yellow mustard marinade.',
    detailedDescription: 'A classic celebratory mixed pickle. Crisp cauliflower florets, tender carrot batons, and tart raw mango cubes briefly sun-dried to preserve crunch, then blended into an aromatic yellow mustard and fenugreek marinade.',
    ingredients: ['Cauliflower', 'Carrot Batons', 'Raw Mango', 'Yellow Mustard Paste', 'Cold-Pressed Oil', 'Sea Salt', 'Red Chilli Powder'],
    imageUrl: '/src/assets/images/pickle_mixed_veggie_1793172308770.jpg',
    pricing: { '250g': 180, '500g': 340, '1kg': 640 },
    isAvailable: true,
    spiceLevel: 'Medium',
    highlightNote: 'Festive Season Special',
  },

  // 2. Non-Veg Pickles (all 7)
  {
    name: 'Mutton Pickle',
    regionalName: 'మటన్ పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Tender boneless mutton pieces slow-fried in gingelly oil with roasted whole spices and native tamarind.',
    detailedDescription: 'Rich, authentic Andhra-style meat pickle. Fresh tender mutton cubes marinated in stone-pounded ginger-garlic paste, crisped gently in pure sesame oil, then coated with freshly ground clove, cardamom, cinnamon, and red chilli masala.',
    ingredients: ['Tender Fresh Mutton Cubes', 'Cold-Pressed Sesame Oil', 'Ginger-Garlic Paste', 'Guntur Red Chilli', 'Cloves & Cinnamon', 'Tamarind Pulp', 'Sea Salt'],
    imageUrl: '/src/assets/images/pickle_mutton_1793173075352.jpg',
    pricing: { '250g': 350, '500g': 680, '1kg': 1300 },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Royal Feast Recipe',
  },
  {
    name: 'Fish Pickle',
    regionalName: 'చేపల పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Crispy fried boneless coastal fish fillets preserved in spicy mustard-fenugreek sesame oil gravy.',
    detailedDescription: 'Fresh coastal seer fish fillets cut into tender bites, flash-fried to retain juiciness while ensuring preservation, then folded into aromatic Telugu pickle gravy with garlic cloves and sun-dried chillies.',
    ingredients: ['Seer Fish Fillets', 'Cold-Pressed Sesame Oil', 'Garlic Pods', 'Ground Mustard', 'Fenugreek Seeds', 'Turmeric & Chilli Powder', 'Sea Salt'],
    imageUrl: '/src/assets/images/pickle_fish_1793173076292.jpg',
    pricing: { '250g': 320, '500g': 620, '1kg': 1200 },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Coastal Andhra Freshness',
  },
  {
    name: 'Crab Pickle',
    regionalName: 'పీతల పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Succulent sea crab meat delicately prepared in coastal Andhra spices with lemon and sesame oil.',
    detailedDescription: 'A rare coastal delicacy. Cleaned, succulent crab meat slow-simmered in aromatic spices, fried garlic, lemon juice, and sesame oil until richly infused with spicy coastal gravy.',
    ingredients: ['Fresh Cleaned Crab Meat', 'Cold-Pressed Sesame Oil', 'Crushed Garlic', 'Guntur Red Chilli', 'Fresh Lemon Juice', 'Coriander Seed Powder', 'Sea Salt'],
    imageUrl: '/src/assets/images/pickle_crab_1793173076335.jpg',
    pricing: { '250g': 380, '500g': 720, '1kg': 1400 },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Rare Coastal Delicacy',
  },
  {
    name: 'Boneless Chicken Pickle',
    regionalName: 'బోన్‌లెస్ చికెన్ పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Bite-sized country chicken morsels crisped in sesame oil with freshly ground garam masala.',
    detailedDescription: 'Crisp outside, juicy inside. Tender boneless chicken cubes marinated with ginger-garlic paste and sea salt, deep-braised in sesame oil, and spiced with our secret homemade garam masala and lime juice.',
    ingredients: ['Farm Fresh Boneless Chicken', 'Cold-Pressed Sesame Oil', 'Ginger-Garlic Paste', 'Guntur Chilli Powder', 'Whole Spices', 'Lemon Juice', 'Salt'],
    imageUrl: '/src/assets/images/pickle_boneless_chicken_1793173074637.jpg',
    pricing: { '250g': 280, '500g': 540, '1kg': 1050 },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Best Seller Meat Pickle',
  },
  {
    name: 'Mutton Bone Pickle',
    regionalName: 'మటన్ బోన్ పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Traditional bone-in mutton chops and succulent ribs infused with slow-simmered spicy gravy.',
    detailedDescription: 'For true meat connoisseurs. Bone-in mutton cuts infused with rich marrow flavor, pan-roasted patiently in pure gingelly oil and seasoned with Guntur red chillies and toasted spices.',
    ingredients: ['Bone-In Mutton Ribs & Chops', 'Gingelly Oil', 'Ginger-Garlic Cloves', 'Stone-Ground Chilli', 'Coriander Seeds', 'Lime Juice', 'Salt'],
    imageUrl: '/src/assets/images/pickle_mutton_1793173075352.jpg',
    pricing: { '250g': 330, '500g': 640, '1kg': 1220 },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Deep Marrow Flavour',
  },
  {
    name: 'Chicken Keema Pickle',
    regionalName: 'చికెన్ కీమా పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Minced chicken keema slow-roasted with fried onions, crushed garlic, and tangy lemon oil.',
    detailedDescription: 'Fine hand-minced chicken browned uniformly in pure gingelly oil with crunchy garlic bits, aromatic cloves, and tart lemon. Pairs heavenly with hot rice, rotis, or dosas.',
    ingredients: ['Minced Chicken Breast', 'Cold-Pressed Sesame Oil', 'Curry Leaves', 'Garlic Pods', 'Red Chilli Powder', 'Cumin & Coriander', 'Lemon Juice'],
    imageUrl: '/src/assets/images/pickle_chicken_keema_1793173117478.jpg',
    pricing: { '250g': 290, '500g': 560, '1kg': 1080 },
    isAvailable: true,
    spiceLevel: 'Medium',
    highlightNote: 'Easy Spreading Texture',
  },
  {
    name: 'Gongura Chicken Pickle',
    regionalName: 'గోంగూర చికెన్ పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Juicy fried chicken cubes melded with authentic sour sorrel leaf (gongura) paste and garlic.',
    detailedDescription: 'The ultimate culinary marriage of Andhra: tart gongura greens sautéed into a velvety paste and combined with golden fried chicken bites, seasoned with whole garlic and dry red chillies.',
    ingredients: ['Boneless Chicken Cubes', 'Fresh Gongura Greens', 'Cold-Pressed Sesame Oil', 'Garlic Pods', 'Guntur Chillies', 'Turmeric', 'Sea Salt'],
    imageUrl: '/src/assets/images/pickle_gongura_chicken_1793173077655.jpg',
    pricing: { '250g': 310, '500g': 590, '1kg': 1140 },
    isAvailable: true,
    spiceLevel: 'Extra Fiery',
    highlightNote: 'Iconic Andhra Fusion',
  },

  // 3. Snacks (all 5)
  {
    name: 'Chegodilu',
    regionalName: 'సాంప్రదాయ చేగోడీలు',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Golden crunchy circular rice flour rings infused with soaked moong dal, cumin, and ajwain.',
    detailedDescription: 'A teatime nostalgia favorite across Andhra and Telangana. Crispy, golden bite-sized rings made with steamed rice flour dough studded with yellow moong dal, ajwain seeds, and crushed cumin.',
    ingredients: ['Rice Flour', 'Yellow Moong Dal', 'Cumin Seeds', 'Ajwain (Carom Seeds)', 'Cold-Pressed Peanut Oil', 'Hing', 'Sea Salt'],
    imageUrl: '/src/assets/images/snack_chegodilu_1793173096907.jpg',
    pricing: { '250g': 140, '500g': 270, '1kg': 520 },
    isAvailable: true,
    spiceLevel: 'Mild',
    highlightNote: 'Crispy Teatime Classic',
  },
  {
    name: 'Pappu Chekkalu',
    regionalName: 'పప్పు చెక్కలు',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Thin, crispy savory rice crackers studded with chana dal, fresh green chillies, and curry leaves.',
    detailedDescription: 'Hand-pressed wafer-thin savory crackers fried to a delicate, satisfying crunch. Packed with soaked chana dal, finely chopped green chillies, fresh curry leaves, and butter for melt-in-mouth crispness.',
    ingredients: ['Raw Rice Flour', 'Bengal Gram (Chana Dal)', 'Fresh Curry Leaves', 'Green Chillies', 'Pure Butter', 'Peanut Oil', 'Sea Salt'],
    imageUrl: '/src/assets/images/snack_pappu_chekkalu_1793173097157.jpg',
    pricing: { '250g': 140, '500g': 270, '1kg': 520 },
    isAvailable: true,
    spiceLevel: 'Medium',
    highlightNote: 'Handmade Crisp Crackers',
  },
  {
    name: 'Chakralu',
    regionalName: 'మురుకులు / చక్రాలు',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Spiral murukku crisps made from roasted gram and rice flour seasoned with white sesame and cumin.',
    detailedDescription: 'Traditional spiral savoury snack extruded through authentic brass presses. Made with a fine blend of roasted gram (putnala pappu) and rice flour, laced with nutty sesame and butter.',
    ingredients: ['Rice Flour', 'Roasted Gram Flour', 'White Sesame Seeds', 'Cumin Seeds', 'Pure Butter', 'Refined Sunflower Oil', 'Salt'],
    imageUrl: '/src/assets/images/snack_chakralu_1793173097423.jpg',
    pricing: { '250g': 130, '500g': 250, '1kg': 480 },
    isAvailable: true,
    spiceLevel: 'Mild',
    highlightNote: 'Melt-in-Mouth Spiral Murukku',
  },
  {
    name: 'Beetroot Chekkalu',
    regionalName: 'బీట్‌రూట్ చెక్కలు',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Artisanal ruby-hued crispy crackers made with fresh pureed beetroot, chana dal, and roasted sesame.',
    detailedDescription: 'A vibrant, wholesome twist on the heritage chekkalu. Natural sweetness of farm-fresh beetroot pureed directly into the rice dough with crunchy chana dal, white sesame seeds, and garden herbs.',
    ingredients: ['Farm Fresh Beetroot Puree', 'Rice Flour', 'Chana Dal', 'White Sesame Seeds', 'Curry Leaves', 'Cold-Pressed Peanut Oil', 'Sea Salt'],
    imageUrl: '/src/assets/images/snack_beetroot_chekkalu_1793173097654.jpg',
    pricing: { '250g': 150, '500g': 290, '1kg': 560 },
    isAvailable: true,
    spiceLevel: 'Mild',
    highlightNote: 'Nutritious Beetroot Infusion',
  },
  {
    name: 'Beetroot Chakralu',
    regionalName: 'బీట్‌రూట్ చక్రాలు',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Delicate spirals with vibrant natural beetroot color, roasted gram flour, and carom seed crunch.',
    detailedDescription: 'Vibrant natural ruby spirals crafted without artificial coloring. Made with antioxidant-rich fresh beetroot puree, roasted dal, and fragrant ajwain, fried to feather-light crunchiness.',
    ingredients: ['Natural Beetroot Extract', 'Rice & Roasted Gram Flour', 'Carom Seeds (Ajwain)', 'White Sesame', 'Pure Butter', 'Oil', 'Rock Salt'],
    imageUrl: '/src/assets/images/snack_beetroot_chakralu_1793173116405.jpg',
    pricing: { '250g': 150, '500g': 290, '1kg': 560 },
    isAvailable: true,
    spiceLevel: 'Mild',
    highlightNote: 'Natural Ruby Colour',
  },
];

async function seedMissing() {
  console.log('Connecting to Firestore...');
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);

  const existingDocs = await getDocs(collection(db, 'products'));
  const existingNames: string[] = [];
  existingDocs.forEach((d) => {
    const data = d.data();
    if (data.name) {
      existingNames.push(data.name.toLowerCase().trim());
      console.log(`Existing Doc: [${d.id}] "${data.name}" (isAvailable: ${data.isAvailable})`);
    }
  });

  console.log(`\nExisting doc count: ${existingDocs.size}`);
  let addedCount = 0;

  for (const item of MISSING_PRODUCTS) {
    const isAlreadyPresent = existingNames.some((en) =>
      en.includes(item.name.toLowerCase().trim()) || item.name.toLowerCase().trim().includes(en)
    );

    if (isAlreadyPresent) {
      console.log(`- Skipping "${item.name}" (already present in Firestore)`);
      continue;
    }

    const docRef = await addDoc(collection(db, 'products'), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`+ Added "${item.name}" as [${docRef.id}]`);
    addedCount++;
  }

  console.log(`\nDone! Successfully added ${addedCount} products.`);
  const finalDocs = await getDocs(collection(db, 'products'));
  console.log(`Total Firestore products now: ${finalDocs.size}`);
  process.exit(0);
}

seedMissing().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
