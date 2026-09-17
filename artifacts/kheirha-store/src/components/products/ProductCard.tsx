import { useState } from 'react';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CartItem, Product, Variant } from '@/types/store';
import { displayPrice, formatPrice } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
  addedId?: string | null;
  cart?: CartItem[];
  onOpen: () => void;
  onAdd: (p: Product, v: Variant, qty?: number) => void;
  onUpdateQuantity?: (id: string, amount: number) => void;
}

export function ProductCard({
  product,
  index,
  addedId,
  cart = [],
  onOpen,
  onAdd,
}: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const price = displayPrice(selectedVariant);
  const isDiscounted = selectedVariant.discountEligible;
  const [imgLoaded, setImgLoaded] = useState(false);
  const isAdded = addedId === selectedVariant.id;

  const cartItemId = `${product.id}:${selectedVariant.id}`;
  const cartItem = cart.find((item) => item.id === cartItemId);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="product-card group relative flex flex-col justify-between rounded-3xl border border-[#E5E2D8] bg-white p-4 text-right shadow-2xs hover:shadow-md transition-all overflow-hidden"
    >
      {/* Discount Ribbon Badge */}
      {isDiscounted && (
        <span className="absolute top-4 right-4 z-10 rounded-full bg-[#E3B33C] px-3 py-1 text-[0.65rem] font-black text-[#7B694D] shadow-2xs">
          خصم 10%
        </span>
      )}

      {/* Product Image — tall 4:5 ratio, object-contain, transparent bg */}
      <button
        type="button"
        onClick={onOpen}
        className="w-full aspect-[4/5] rounded-2xl bg-transparent overflow-hidden mb-3 relative flex items-center justify-center cursor-pointer"
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
            className="w-full bg-transparent border-0 outline-none font-display font-extrabold text-sm sm:text-base text-[#7B694D] leading-snug hover:text-[#61523B] text-right p-0 cursor-pointer"
          >
            {product.name}
          </button>

          {/* Size Variant Selector (Pills for 500g vs 1kg) */}
          {product.variants.length > 1 ? (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariantIndex(idx);
                    setQty(1);
                  }}
                  className={`text-[0.65rem] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    selectedVariantIndex === idx
                      ? 'bg-[#7B694D] text-white border-[#7B694D] shadow-2xs'
                      : 'bg-[#F9F7F1] text-slate-600 border-[#E5E2D8] hover:border-[#7B694D]'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[0.68rem] text-slate-500 font-bold mt-1">{selectedVariant.size}</p>
          )}
        </div>

        <div className="mt-3 space-y-2">
          {/* Price & In-Cart Badge */}
          <div className="flex items-center justify-between gap-1 flex-wrap">
            {price === null ? (
              <span className="text-xs font-bold text-amber-700">السعر عند الطلب</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                {isDiscounted && <del className="text-[0.68rem] text-slate-400 font-normal">{formatPrice(selectedVariant.price as number)}</del>}
                <span className="text-base font-black text-[#7B694D]">{formatPrice(price)}</span>
              </div>
            )}

            {inCartQty > 0 && (
              <span className="text-[0.62rem] font-black text-[#7B694D] bg-[#F4F0E8] px-2 py-0.5 rounded-full border border-[#7B694D]/20">
                في السلة: {inCartQty}
              </span>
            )}
          </div>

          {/* Quantity Selector Stepper (Above Add to Cart Button) */}
          <div className="flex items-center justify-between bg-[#F7F4EA] border border-[#E5E2D8] rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQty((prev) => Math.max(1, prev - 1));
              }}
              disabled={qty <= 1}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shadow-2xs ${
                qty <= 1
                  ? 'bg-transparent text-slate-300 cursor-not-allowed'
                  : 'bg-white text-[#7B694D] border border-[#E5E2D8] hover:bg-[#7B694D] hover:text-white cursor-pointer'
              }`}
              title="إنقاص الكمية"
            >
              <Minus size={13} />
            </button>

            <div className="flex items-center gap-1">
              <span className="text-[0.68rem] text-slate-500 font-bold">العدد:</span>
              <span className="font-black text-sm text-[#7B694D] px-1">{qty}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQty((prev) => prev + 1);
              }}
              className="w-7 h-7 rounded-lg bg-white text-[#7B694D] border border-[#E5E2D8] flex items-center justify-center hover:bg-[#7B694D] hover:text-white transition-colors cursor-pointer shadow-2xs"
              title="زيادة الكمية"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product, selectedVariant, qty);
            }}
            className={`uiverse-btn-add-cart text-xs transition-all duration-300 w-full ${
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
