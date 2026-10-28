import { Product } from '../types/product';

// Veg pickle images
import imgMango from '../assets/images/pickle_mango_avakaya_1793172291198.jpg';
import imgRedChilli from '../assets/images/pickle_red_chilli_1793172292271.jpg';
import imgGongura from '../assets/images/pickle_andhra_gongura_1793172292859.jpg';
import imgLemon from '../assets/images/pickle_lemon_nimma_1793172292897.jpg';
import imgTomato from '../assets/images/pickle_tomato_tamata_1793172307574.jpg';
import imgMixedVeg from '../assets/images/pickle_mixed_veggie_1793172308770.jpg';

// Non-veg pickle images
import imgBonelessChicken from '../assets/images/pickle_boneless_chicken_1793173074637.jpg';
import imgMutton from '../assets/images/pickle_mutton_1793173075352.jpg';
import imgFish from '../assets/images/pickle_fish_1793173076292.jpg';
import imgCrab from '../assets/images/pickle_crab_1793173076335.jpg';
import imgGonguraChicken from '../assets/images/pickle_gongura_chicken_1793173077655.jpg';
import imgChickenKeema from '../assets/images/pickle_chicken_keema_1793173117478.jpg';

// Snack images
import imgChegodilu from '../assets/images/snack_chegodilu_1793173096907.jpg';
import imgPappuChekkalu from '../assets/images/snack_pappu_chekkalu_1793173097157.jpg';
import imgChakralu from '../assets/images/snack_chakralu_1793173097423.jpg';
import imgBeetrootChekkalu from '../assets/images/snack_beetroot_chekkalu_1793173097654.jpg';
import imgBeetrootChakralu from '../assets/images/snack_beetroot_chakralu_1793173116405.jpg';

/**
 * Isolated Product Database
 * Grouped into 3 main categories: Veg Pickles, Non-Veg Pickles, Snacks.
 * Includes category and dietaryType ('veg' | 'non-veg') for filtering and future DB integration.
 * Sample prices and stock statuses are for demonstration purposes until updated by the owner.
 */
export const SAMPLE_PRODUCTS: Product[] = [
  // ==========================================
  // A. VEG PICKLES
  // ==========================================
  {
    id: 'andhra-avakaya-mango',
    name: 'Andhra Avakaya Mango Pickle',
    regionalName: 'మామిడికాయ ఆవకాయ',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Tender raw mango pieces pickled with mustard paste, Guntur red chilli, and wood-pressed sesame oil.',
    detailedDescription: 'The crown jewel of Andhra homes. Handcrafted with crunchy raw mango pieces (with hard shell intact), blended with stone-ground mustard powder (aava pindi), pure fenugreek, and cold-pressed sesame oil. Matured gently in ceramic jaadi jars for authentic pungency.',
    ingredients: ['Raw Country Mangoes', 'Mustard Seed Powder', 'Guntur Red Chilli', 'Cold-Pressed Sesame Oil', 'Sea Salt', 'Fenugreek Seeds', 'Turmeric'],
    imageUrl: imgMango,
    pricing: {
      '250g': 180,
      '500g': 340,
      '1kg': 650,
    },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Signature Heritage Recipe',
    isSampleData: true,
  },
  {
    id: 'pandu-mirapakaya',
    name: 'Pandu Mirapakaya Pickle',
    regionalName: 'పండు మిరపకాయ పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Ripe red peppers stone-pounded with country tamarind, garlic pods, and roasted methi essence.',
    detailedDescription: 'Crafted from winter-harvest ripe red chillies stone-pounded with tart native tamarind, whole fried garlic cloves, and fragrant roasted fenugreek powder. A bold, fiery kick with comforting sour undertones.',
    ingredients: ['Fresh Ripe Red Chillies', 'Country Tamarind Pulp', 'Garlic Pods', 'Cold-Pressed Sesame Oil', 'Fenugreek Powder', 'Rock Salt', 'Mustard Tempering'],
    imageUrl: imgRedChilli,
    pricing: {
      '250g': 175,
      '500g': 330,
      '1kg': 620,
    },
    isAvailable: true,
    spiceLevel: 'Extra Fiery',
    highlightNote: 'Fiery Guntur Chillies',
    isSampleData: true,
  },
  {
    id: 'andhra-gongura',
    name: 'Andhra Gongura Pickle',
    regionalName: 'గోంగూర పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Fresh sorrel leaves slow-cooked and tempered with roasted cumin, whole red chillies, and garlic.',
    detailedDescription: 'The legendary taste of Telugu kitchens. Freshly harvested sour gongura leaves slow-sautéed in sesame oil until silky, pounded with dry red chillies, crushed garlic, and cumin-mustard tempering.',
    ingredients: ['Fresh Gongura Leaves', 'Dry Red Chillies', 'Garlic Cloves', 'Sesame Oil', 'Cumin & Mustard Seeds', 'Sea Salt', 'Turmeric'],
    imageUrl: imgGongura,
    pricing: {
      '250g': 190,
      '500g': 360,
      '1kg': 690,
    },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Tangy Andhra Heritage',
    isSampleData: true,
  },
  {
    id: 'lemon-pickle',
    name: 'Lemon Pickle',
    regionalName: 'నిమ్మకాయ నిల్వ పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Sun-cured thin-skinned Kagzi lemons steeped in sea salt, mild turmeric, and compounded hing.',
    detailedDescription: 'Prepared using traditional natural sunlight curing over several weeks until the lemon peel softens to melt-in-the-mouth tenderness. Gently spiced with freshly roasted methi, red chilli, and fragrant hing.',
    ingredients: ['Kagzi Lemons', 'Sea Salt', 'Red Chilli Powder', 'Pure Asafoetida (Hing)', 'Turmeric', 'Fenugreek Seeds'],
    imageUrl: imgLemon,
    pricing: {
      '250g': 160,
      '500g': 300,
      '1kg': 580,
    },
    isAvailable: true,
    spiceLevel: 'Medium',
    highlightNote: 'Naturally Sun-Fermented',
    isSampleData: true,
  },
  {
    id: 'tomato-pickle',
    name: 'Tomato Pickle',
    regionalName: 'టమోటా పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Country tomatoes slow-simmered with tamarind, golden garlic cloves, and fresh curry leaves.',
    detailedDescription: 'Farm-fresh country tomatoes slow-simmered patiently to eliminate excess moisture, concentrating their natural sweet-tangy flavor. Tempered with fried garlic, whole mustard seeds, and garden curry leaves.',
    ingredients: ['Country Tomatoes', 'Tamarind Pulp', 'Garlic Cloves', 'Fresh Curry Leaves', 'Cold-Pressed Oil', 'Red Chilli Powder', 'Mustard & Fenugreek'],
    imageUrl: imgTomato,
    pricing: {
      '250g': 170,
      '500g': 320,
      '1kg': 600,
    },
    isAvailable: true,
    spiceLevel: 'Medium',
    highlightNote: 'Rich & Versatile',
    isSampleData: true,
  },
  {
    id: 'mixed-vegetable-pickle',
    name: 'Mixed Vegetable Pickle',
    regionalName: 'కూరగాయల పచ్చడి',
    category: 'veg-pickles',
    dietaryType: 'veg',
    shortDescription: 'Crunchy cauliflower florets, carrots, and green mango cubes in aromatic yellow mustard marinade.',
    detailedDescription: 'A classic celebratory mixed pickle. Crisp cauliflower florets, tender carrot batons, and tart raw mango cubes briefly sun-dried to preserve crunch, then blended into an aromatic yellow mustard and fenugreek marinade.',
    ingredients: ['Cauliflower', 'Carrot Batons', 'Raw Mango', 'Yellow Mustard Paste', 'Cold-Pressed Oil', 'Sea Salt', 'Red Chilli Powder'],
    imageUrl: imgMixedVeg,
    pricing: {
      '250g': 180,
      '500g': 340,
      '1kg': 640,
    },
    isAvailable: false, // Sample unavailable product for stock validation
    spiceLevel: 'Mild',
    highlightNote: 'Restocking Soon',
    isSampleData: true,
  },

  // ==========================================
  // B. NON-VEG PICKLES
  // ==========================================
  {
    id: 'mutton-pickle',
    name: 'Mutton Pickle',
    regionalName: 'మటన్ పచ్చడి (మేక మాంసం)',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Succulent tender mutton pieces slow-cooked and steeped in aromatic Andhra clove and cinnamon spiced oil.',
    detailedDescription: 'Handcrafted using fresh prime tender mutton pieces, pressure-braised to tenderness, crisp-fried in cold-pressed oil, and marinated with hand-roasted clove, cinnamon, ginger-garlic, and Guntur red chilli powder.',
    ingredients: ['Prime Tender Mutton', 'Fresh Ginger-Garlic Paste', 'Guntur Red Chilli', 'Garam Masala Spices', 'Wood-Pressed Sesame Oil', 'Sea Salt', 'Lemon Juice'],
    imageUrl: imgMutton,
    pricing: {
      '250g': 340,
      '500g': 650,
      '1kg': 1250,
    },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Rich Andhra Spices',
    isSampleData: true,
  },
  {
    id: 'fish-pickle',
    name: 'Fish Pickle',
    regionalName: 'చేపల పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Crisp-fried boneless coastal fish fillets preserved in spicy mustard, fenugreek, and tangy garlic masala.',
    detailedDescription: 'Fresh coastal fish steaks cleaned, marinated with turmeric and salt, crisp-fried, and infused in hot spiced sesame oil with stone-ground mustard, fenugreek, garlic, and vinegar-tamarind balance.',
    ingredients: ['Fresh Fish Fillets', 'Mustard Paste', 'Fenugreek Powder', 'Crushed Garlic', 'Red Chilli Powder', 'Cold-Pressed Oil', 'Curry Leaves', 'Sea Salt'],
    imageUrl: imgFish,
    pricing: {
      '250g': 260,
      '500g': 500,
      '1kg': 950,
    },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Coastal Andhra Specialty',
    isSampleData: true,
  },
  {
    id: 'crab-pickle',
    name: 'Crab Pickle',
    regionalName: 'పీతల పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Sweet coastal crab meat seasoned in rich fiery Andhra pepper, garlic, and curry leaf marinade.',
    detailedDescription: 'A rare and treasured coastal Andhra delicacy. Fresh sea crab carefully cleaned, spiced with roasted coriander, black pepper, red chilli, and garlic pods, slow-cooked to seal in the seafood sweetness.',
    ingredients: ['Fresh Coastal Crab', 'Ginger-Garlic Paste', 'Black Pepper', 'Red Chilli', 'Cold-Pressed Sesame Oil', 'Curry Leaves', 'Sea Salt'],
    imageUrl: imgCrab,
    pricing: {
      '250g': 320,
      '500g': 620,
      '1kg': 1180,
    },
    isAvailable: true,
    spiceLevel: 'Extra Fiery',
    highlightNote: 'Rare Coastal Delicacy',
    isSampleData: true,
  },
  {
    id: 'boneless-chicken-pickle',
    name: 'Boneless Chicken Pickle',
    regionalName: 'బోన్ లెస్ చికెన్ పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Juicy bite-sized chicken cubes fried to golden perfection and tossed in authentic Andhra spicy gravy.',
    detailedDescription: 'Tender boneless chicken cubes marinated with natural spices, crisp-fried in cold-pressed oil, and steeped in an aromatic red chilli and roasted coriander gravy with crisp fried curry leaves.',
    ingredients: ['Boneless Farm Chicken', 'Ginger-Garlic Paste', 'Guntur Red Chilli', 'Cold-Pressed Oil', 'Fresh Curry Leaves', 'Roasted Spices', 'Sea Salt'],
    imageUrl: imgBonelessChicken,
    pricing: {
      '250g': 250,
      '500g': 480,
      '1kg': 920,
    },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Top Customer Favorite',
    isSampleData: true,
  },
  {
    id: 'mutton-bone-pickle',
    name: 'Mutton Bone Pickle',
    regionalName: 'మటన్ బోన్ పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Bone-in juicy mutton cuts releasing deep marrow richness into spicy clove and ginger-garlic oil.',
    detailedDescription: 'Prepared using bone-in tender mutton cuts that impart rich marrow flavor into the pickling oil. Slow-simmered with whole cloves, star anise, garlic cloves, and fiery red chillies for intense savoriness.',
    ingredients: ['Bone-in Prime Mutton', 'Bone Marrow Infusion', 'Ginger-Garlic', 'Guntur Red Chilli', 'Garam Masala', 'Sesame Oil', 'Sea Salt'],
    imageUrl: imgMutton,
    pricing: {
      '250g': 320,
      '500g': 620,
      '1kg': 1200,
    },
    isAvailable: true,
    spiceLevel: 'Extra Fiery',
    highlightNote: 'Bone Marrow Richness',
    isSampleData: true,
  },
  {
    id: 'chicken-keema-pickle',
    name: 'Chicken Keema Pickle',
    regionalName: 'చికెన్ కీమా పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Fine-minced chicken roasted with roasted fennel, peppercorns, and fiery garlic oil.',
    detailedDescription: 'Fresh minced chicken slowly roasted on low heat until dry and golden, then immersed in a hot spiced tempering of fennel seeds, black pepper, red chilli flakes, and roasted garlic. Perfect with rice, dosas, and parathas.',
    ingredients: ['Fresh Minced Chicken', 'Roasted Fennel Seeds', 'Crushed Peppercorns', 'Garlic Pods', 'Wood-Pressed Oil', 'Red Chilli', 'Sea Salt'],
    imageUrl: imgChickenKeema,
    pricing: {
      '250g': 240,
      '500g': 460,
      '1kg': 880,
    },
    isAvailable: true,
    spiceLevel: 'Medium',
    highlightNote: 'Easy to Spread & Mix',
    isSampleData: true,
  },
  {
    id: 'gongura-chicken-pickle',
    name: 'Gongura Chicken Pickle',
    regionalName: 'గోంగూర చికెన్ పచ్చడి',
    category: 'non-veg-pickles',
    dietaryType: 'non-veg',
    shortDescription: 'Tangy Andhra gongura sorrel leaves blended with succulent roasted chicken chunks.',
    detailedDescription: 'A match made in Andhra food heaven. Tart sorrel leaves cooked down to a silky paste and blended with tender fried chicken pieces, whole dried chillies, and garlic cloves in wood-pressed oil.',
    ingredients: ['Fresh Gongura (Sorrel) Leaves', 'Boneless Chicken Chunks', 'Whole Red Chillies', 'Garlic Cloves', 'Wood-Pressed Sesame Oil', 'Cumin & Mustard', 'Sea Salt'],
    imageUrl: imgGonguraChicken,
    pricing: {
      '250g': 270,
      '500g': 520,
      '1kg': 990,
    },
    isAvailable: true,
    spiceLevel: 'Fiery',
    highlightNote: 'Tangy & Savory Blend',
    isSampleData: true,
  },

  // ==========================================
  // C. SNACKS
  // ==========================================
  {
    id: 'snack-chegodilu',
    name: 'Chegodilu',
    regionalName: 'చెగోడీలు (చేగోడీలు)',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Crunchy golden ring-shaped Andhra savouries made with rice flour, roasted sesame, and cumin seeds.',
    detailedDescription: 'Classic Andhra festive crunchy ring snacks. Hand-rolled using premium steamed rice flour, studded generously with white sesame seeds, cumin (jeera), and a pinch of asafoetida. Deep-fried in fresh groundnut oil to a satisfying golden crunch.',
    ingredients: ['Rice Flour', 'White Sesame Seeds', 'Cumin (Jeera) Seeds', 'Fresh Groundnut Oil', 'Hing (Asafoetida)', 'Sea Salt'],
    imageUrl: imgChegodilu,
    pricing: {
      '250g': 120,
      '500g': 230,
      '1kg': 440,
    },
    isAvailable: true,
    spiceLevel: 'Mild',
    highlightNote: 'Crispy Teatime Ring Snack',
    isSampleData: true,
  },
  {
    id: 'snack-pappu-chekkalu',
    name: 'Pappu Chekkalu',
    regionalName: 'పప్పు చెక్కలు (నిప్పట్లు)',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Crispy flat round rice crackers studded with golden soaked chana dal and fresh curry leaves.',
    detailedDescription: 'Traditional South Indian crispy flat discs crafted from rice dough kneaded with softened Bengal gram (chana dal), green chillies, ginger, and finely chopped curry leaves. Irresistibly crisp with a nutty bite.',
    ingredients: ['Rice Flour', 'Chana Dal (Bengal Gram)', 'Fresh Curry Leaves', 'Green Chillies', 'Ginger', 'Groundnut Oil', 'Salt'],
    imageUrl: imgPappuChekkalu,
    pricing: {
      '250g': 130,
      '500g': 250,
      '1kg': 480,
    },
    isAvailable: true,
    spiceLevel: 'Medium',
    highlightNote: 'Nutty & Crunchy Bite',
    isSampleData: true,
  },
  {
    id: 'snack-chakralu',
    name: 'Chakralu',
    regionalName: 'చక్రాలు (జంతికలు / మురుకులు)',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Golden spiral murukku coils made from seasoned rice and roasted gram flour with ajwain.',
    detailedDescription: 'Also celebrated as Jantikalu or Murukku. Pressed through traditional brass moulds into golden coils. Flavored with roasted gram flour, carom seeds (vaamu/ajwain), and pure butter for a delicate, melt-in-the-mouth crispness.',
    ingredients: ['Fine Rice Flour', 'Roasted Gram Flour', 'Carom Seeds (Ajwain/Vaamu)', 'Desi Butter', 'Groundnut Oil', 'Sea Salt'],
    imageUrl: imgChakralu,
    pricing: {
      '250g': 125,
      '500g': 240,
      '1kg': 460,
    },
    isAvailable: true,
    spiceLevel: 'Mild',
    highlightNote: 'Golden Spiral Murukku',
    isSampleData: true,
  },
  {
    id: 'snack-beetroot-chekkalu',
    name: 'Beetroot Chekkalu',
    regionalName: 'బీట్‌రూట్ చెక్కలు',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Vibrant ruby-red flat crackers naturally infused with fresh beetroot juice, chana dal, and sesame.',
    detailedDescription: 'A wholesome, colorful twist on traditional chekkalu. Made by kneading rice dough with fresh, pure strained beetroot juice, providing a stunning natural ruby hue and subtle earthy sweetness balanced by chana dal, cumin, and sea salt.',
    ingredients: ['Rice Flour', 'Pure Fresh Beetroot Extract', 'Chana Dal', 'White Sesame Seeds', 'Cumin Seeds', 'Groundnut Oil', 'Sea Salt'],
    imageUrl: imgBeetrootChekkalu,
    pricing: {
      '250g': 140,
      '500g': 270,
      '1kg': 520,
    },
    isAvailable: true,
    spiceLevel: 'Mild',
    highlightNote: 'Naturally Colorful & Nutritious',
    isSampleData: true,
  },
  {
    id: 'snack-beetroot-chakralu',
    name: 'Beetroot Chakralu',
    regionalName: 'బీట్‌రూట్ చక్రాలు',
    category: 'snacks',
    dietaryType: 'veg',
    shortDescription: 'Eye-catching crispy ruby spirals infused with pure beetroot juice, ajwain, and roasted gram.',
    detailedDescription: 'Handcrafted spiral murukku coils infused with natural beetroot reduction and mild carom seeds. Crunchy, visually delightful, and made completely without artificial food coloring.',
    ingredients: ['Rice Flour', 'Pure Beetroot Juice', 'Roasted Gram Flour', 'Ajwain (Vaamu)', 'Groundnut Oil', 'Sea Salt'],
    imageUrl: imgBeetrootChakralu,
    pricing: {
      '250g': 140,
      '500g': 270,
      '1kg': 520,
    },
    isAvailable: true,
    spiceLevel: 'Mild',
    highlightNote: 'All-Natural Ruby Murukku',
    isSampleData: true,
  },
];
