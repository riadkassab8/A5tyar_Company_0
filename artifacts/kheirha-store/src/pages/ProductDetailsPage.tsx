import { useState } from 'react';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product, Variant } from '@/types/store';
import { displayPrice, formatPrice } from '@/data/products';

interface ProductDetailsPageProps {
  product: Product;
  addedId: string | null;
  onBack: () => void;
  onAdd: (product: Product, variant: Variant) => void;
  onOpenCart: () => void;
}

export function ProductDetailsPage({
  product,
  addedId,
  onBack,
  onAdd,
}: ProductDetailsPageProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const price = displayPrice(selectedVariant);

  return (
    <main className="store-shell py-8 space-y-8">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B4A3D]">
        <ArrowRight size={16} /> الرجوع إلى المنتجات
      </button>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative aspect-square w-full rounded-3xl bg-[#F7F4EA] border border-[#E5E2D8] overflow-hidden shadow-sm">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-8"
            loading="lazy"
          />
          {selectedVariant.discountEligible && (
            <span className="absolute top-4 right-4 rounded-full bg-[#E3B33C] px-3.5 py-1 text-xs font-black text-[#0B4A3D]">
              خصم 10%
            </span>
          )}
        </div>

        <div className="space-y-5">
          <span className="text-xs font-black text-[#0B4A3D]">{product.category}</span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#0B4A3D]">{product.name}</h1>
          <p className="text-xs font-bold text-slate-500">{selectedVariant.size}</p>

          <p className="text-xs text-[#5C726F] font-medium leading-relaxed">
            منتج بلدي طبيعي 100% من أجود الأنواع غني بالمنافع الغذائية ومناسب للاستخدام اليومي.
          </p>

          <div className="flex items-baseline gap-2 pt-2">
            {selectedVariant.discountEligible && <del className="text-xs text-slate-400">{formatPrice(selectedVariant.price as number)}</del>}
            <motion.span
              key={price}
              initial={{ scale: 1.15, color: '#E3B33C' }}
              animate={{ scale: 1, color: '#0B4A3D' }}
              className="text-3xl font-black"
            >
              {price === null ? 'السعر عند الطلب' : formatPrice(price)}
            </motion.span>
          </div>

          {/* Variant Picker */}
          {product.variants.length > 1 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-extrabold text-[#0B4A3D]">اختر الحجم:</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`rounded-2xl border px-5 py-2.5 text-xs font-bold transition-all ${
                      selectedVariant.id === v.id
                        ? 'border-[#0B4A3D] bg-[#0B4A3D] text-white'
                        : 'border-[#E5E2D8] bg-white text-slate-700'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart CTA */}
          {(() => {
            const isAdded = addedId === selectedVariant.id;
            return (
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => onAdd(product, selectedVariant)}
                  className={`uiverse-btn-primary w-full py-4 text-base transition-all duration-300 ${
                    isAdded ? '!bg-emerald-600 !text-white shadow-lg shadow-emerald-900/30' : ''
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={22} className="text-white animate-bounce" /> تمت الإضافة للسلة ✓
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} /> أضف إلى السلة
                    </>
                  )}
                </button>
              </div>
            );
          })()}

          {/* Trust Perks */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E5E2D8] text-center text-[0.68rem] font-extrabold text-slate-700">
            <div className="rounded-2xl bg-white border border-[#E5E2D8] p-3">من مصادر موثوقة</div>
            <div className="rounded-2xl bg-white border border-[#E5E2D8] p-3">جودة مضمونة</div>
            <div className="rounded-2xl bg-white border border-[#E5E2D8] p-3">طبيعي 100%</div>
          </div>
        </div>
      </div>
    </main>
  );
}
