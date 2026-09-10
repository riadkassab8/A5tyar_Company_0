import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product, Variant } from '@/types/store';
import { displayPrice, formatPrice } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
  addedId?: string | null;
  onOpen: () => void;
  onAdd: (p: Product, v: Variant) => void;
}

export function ProductCard({ product, index, addedId, onOpen, onAdd }: ProductCardProps) {
  const firstVariant = product.variants[0];
  const price = displayPrice(firstVariant);
  const isDiscounted = firstVariant.discountEligible;
  const [imgLoaded, setImgLoaded] = useState(false);
  const isAdded = addedId === firstVariant.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="product-card group relative flex flex-col justify-between rounded-3xl border border-[#E5E2D8] bg-white p-4 text-right shadow-2xs hover:shadow-md transition-all overflow-hidden"
    >
      {/* Discount Ribbon Badge */}
      {isDiscounted && (
        <span className="absolute top-4 right-4 z-10 rounded-full bg-[#E3B33C] px-3 py-1 text-[0.65rem] font-black text-[#0B4A3D] shadow-2xs">
          خصم 10%
        </span>
      )}

      {/* Product Image — tall 4:5 ratio, object-contain, transparent bg */}
      <button
        type="button"
        onClick={onOpen}
        className="w-full aspect-[4/5] rounded-2xl bg-transparent overflow-hidden mb-4 relative block flex items-center justify-center"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton rounded-2xl" />
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`product-photo h-full w-full object-contain transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          draggable={false}
        />
      </button>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <button
            type="button"
            onClick={onOpen}
            className="w-full bg-transparent border-0 outline-none font-display font-extrabold text-sm sm:text-base text-[#0B4A3D] leading-snug hover:text-[#07382e] text-right p-0 cursor-pointer"
          >
            {product.name}
          </button>
          <p className="text-[0.68rem] text-slate-500 font-bold mt-1">{firstVariant.size}</p>
        </div>

        <div className="mt-4">
          {price === null ? (
            <span className="text-xs font-bold text-amber-700">السعر عند الطلب</span>
          ) : (
            <div className="flex items-baseline gap-1.5">
              {isDiscounted && <del className="text-[0.68rem] text-slate-400 font-normal">{formatPrice(firstVariant.price as number)}</del>}
              <span className="text-base font-black text-[#0B4A3D]">{formatPrice(price)}</span>
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product, firstVariant);
            }}
            className={`uiverse-btn-add-cart mt-3 text-xs transition-all duration-300 ${
              isAdded ? 'btn-success !bg-emerald-600 !text-white scale-95 shadow-md shadow-emerald-900/20' : ''
            }`}
          >
            {isAdded ? (
              <>
                <Check size={16} className="text-white animate-bounce" /> تمت الإضافة ✓
              </>
            ) : (
              <>
                <ShoppingBag size={15} /> أضف إلى السلة
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
