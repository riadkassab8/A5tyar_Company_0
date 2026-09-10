import { Search } from 'lucide-react';
import type { Category, Product, Variant } from '@/types/store';
import { categories } from '@/types/store';
import { ProductCard } from '@/components/products/ProductCard';

interface CatalogPageProps {
  activeCategory: (typeof categories)[number];
  setActiveCategory: (cat: (typeof categories)[number]) => void;
  search: string;
  setSearch: (val: string) => void;
  filteredProducts: Product[];
  onOpenProduct: (p: Product) => void;
  onAdd: (p: Product, v: Variant) => void;
  addedId?: string | null;
}

export function CatalogPage({
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
  filteredProducts,
  onOpenProduct,
  onAdd,
  addedId,
}: CatalogPageProps) {
  return (
    <main className="store-shell py-8 space-y-8">
      <div className="text-center sm:text-right">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#0B4A3D]">كل منتجات أختيار</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">من أجود المزارع المصرية .. بجودة عالية وطعم أصيل</p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto sm:mx-0">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full rounded-full border border-[#E5E2D8] bg-white py-3 pr-11 pl-4 text-xs font-semibold text-[#0B4A3D] outline-none focus:border-[#0B4A3D] shadow-2xs"
        />
        <Search size={18} className="absolute right-4 top-3.5 text-slate-400" />
      </div>

      {/* Horizontal Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-sm sm:text-base font-extrabold transition-all ${
              activeCategory === category
                ? 'bg-[#0B4A3D] text-white shadow-md'
                : 'bg-white text-slate-600 border-2 border-[#E5E2D8] hover:border-[#0B4A3D] hover:text-[#0B4A3D]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} addedId={addedId} onOpen={() => onOpenProduct(product)} onAdd={onAdd} />
        ))}
      </div>
    </main>
  );
}
