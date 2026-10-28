export type PickleWeight = '250g' | '500g' | '1kg';

export type ProductCategory = 'veg-pickles' | 'non-veg-pickles' | 'snacks';

export type DietaryType = 'veg' | 'non-veg';

export interface ProductPricing {
  '250g': number;
  '500g': number;
  '1kg': number;
}

export type SpiceLevel = 'Mild' | 'Medium' | 'Fiery' | 'Extra Fiery';

export interface Product {
  id: string;
  name: string;
  regionalName: string;
  category: ProductCategory;
  dietaryType: DietaryType;
  shortDescription: string;
  detailedDescription: string;
  ingredients: string[];
  imageUrl: string;
  pricing: ProductPricing;
  isAvailable: boolean;
  spiceLevel: SpiceLevel;
  highlightNote?: string;
  isSampleData: boolean;
}

export interface CartItem {
  id: string; // unique key combining product.id and weight, e.g. "mango-avakaya-500g"
  product: Product;
  selectedWeight: PickleWeight;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
