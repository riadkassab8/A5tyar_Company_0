import type { ComponentType } from 'react';

export type Category = 'أساسيات البيت' | 'عسل النحل' | 'منتجات الألبان' | 'منتجات السمسم' | 'المربيات';

export type Variant = {
  id: string;
  size: string;
  price: number | null;
  discountEligible: boolean;
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  variants: Variant[];
  accent: string;
  imageUrl: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number | null;
  discountEligible: boolean;
  quantity: number;
};

export type CatalogRow = readonly [string, string, number | null];
export type ProductSeed = Omit<Product, 'accent' | 'icon' | 'imageUrl'>;

export const categories = ['الكل', 'عسل النحل', 'منتجات الألبان', 'منتجات السمسم', 'أساسيات البيت', 'المربيات'] as const;
