import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Category, Product, Variant } from '@/types/store';
import { displayPrice, formatPrice, PRODUCT_IMAGES } from '@/data/products';
import { Hero3DBackground } from '@/components/Hero3DScene';
import { ProductCard } from '@/components/products/ProductCard';

interface HomePageProps {
  onSelectCategory: (cat: Category) => void;
  onBrowse: () => void;
  filteredProducts: Product[];
  onOpenProduct: (p: Product) => void;
  onAdd: (p: Product, v: Variant) => void;
  addedId?: string | null;
}

export function HomePage({
  onSelectCategory,
  onBrowse,
  filteredProducts,
  onOpenProduct,
  onAdd,
  addedId,
}: HomePageProps) {
  const featuredProduct = filteredProducts[0];

  return (
    <main className="store-shell py-8 space-y-16">
      {/* 2026 Hero Section: Massive Headlines & Photography Editorial Focus */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#F7F4EA] border border-[#E8E4D9] p-8 sm:p-12 lg:p-16">
        <Hero3DBackground />

        <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E5E2D8] px-4 py-1.5 text-xs font-black text-[#0B4A3D] shadow-2xs">
              <Sparkles size={14} className="text-[#E3B33C]" /> خير مصري أصيل 100%
            </span>

            <h1 className="font-display mt-6 text-5xl sm:text-7xl lg:text-8xl font-black text-[#0B4A3D] leading-[1.04] tracking-tight">
              اختيارك <br />
              <span className="text-[#D9A52E]">الطبيعي لأجود</span> <br />
              المنتجات.
            </h1>

            <p className="mt-6 text-sm sm:text-base text-[#5C726F] font-medium leading-relaxed max-w-lg">
              رزق وبركة .. من قلب الطبيعة والمزارع إلى مائدتك مباشرة، بجودة نضمنها لك.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBrowse}
                className="uiverse-btn-primary text-base"
              >
                تسوق الآن <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={onBrowse}
                className="uiverse-btn-secondary text-sm"
              >
                اكتشف المنتجات
              </button>
            </div>
          </div>

          {/* Hero Product Photography */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border border-[#E5E2D8] group">
              <img
                src={featuredProduct?.imageUrl || PRODUCT_IMAGES['عسل نحل طبيعي']}
                alt="منتجات أختيار الطبيعية"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-4 right-4 bg-[#E3B33C] text-[#0B4A3D] text-[0.62rem] font-black px-3 py-1 rounded-full shadow-md">
                ⭐ خصم 10%
              </span>
              <div className="absolute bottom-5 right-5 left-5 text-white">
                <span className="block text-[0.65rem] font-bold text-amber-300">الأكثر مبيعاً هذا الأسبوع</span>
                <span className="font-display font-black text-lg leading-tight">{featuredProduct?.name || 'عسل نحل طبيعي'}</span>
                <span className="block text-sm font-black text-amber-300 mt-0.5">{formatPrice(featuredProduct ? (displayPrice(featuredProduct.variants[0]) as number) : 135)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Benefits Bar */}
      <section className="grid gap-4 sm:grid-cols-3 text-center">
        <div className="rounded-2xl border border-[#E5E2D8] bg-white p-6 shadow-2xs flex flex-col items-center hover:border-[#0B4A3D] transition-colors">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#F4F0E6] text-2xl">
            🌿
          </div>
          <h4 className="font-extrabold text-base text-[#0B4A3D]">منتجات مختارة بعناية</h4>
          <p className="text-xs text-slate-500 font-medium mt-1">من أفضل المصادر والمزارع الطبيعية</p>
        </div>
        <div className="rounded-2xl border border-[#E5E2D8] bg-white p-6 shadow-2xs flex flex-col items-center hover:border-[#0B4A3D] transition-colors">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#FEF3C7] text-2xl">
            🏷️
          </div>
          <h4 className="font-extrabold text-base text-[#0B4A3D]">أسعار واضحة ومحددة</h4>
          <p className="text-xs text-slate-500 font-medium mt-1">بدون أي مفاجآت عند التوصيل</p>
        </div>
        <div className="rounded-2xl border border-[#E5E2D8] bg-white p-6 shadow-2xs flex flex-col items-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#F4F0E6] text-[#0B4A3D]">
            <MessageCircle size={24} />
          </div>
          <h4 className="font-extrabold text-base text-[#0B4A3D]">اطلب مباشرة عبر واتساب</h4>
          <p className="text-xs text-slate-500 font-medium mt-1">بكل سهولة وسرعة وأمان</p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-2xl text-[#0B4A3D]">منتجاتنا المميزة</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">مختارة بعناية يفضلها عملاؤنا</p>
          </div>
          <button onClick={onBrowse} className="text-xs font-black text-[#0B4A3D] hover:underline flex items-center gap-1">
            عرض الكل <ArrowLeft size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.slice(0, 4).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              addedId={addedId}
              onOpen={() => onOpenProduct(product)}
              onAdd={onAdd}
            />
          ))}
        </div>
      </section>

      {/* Weekly Offer Deal Section */}
      <section className="mt-10 mb-6">
        <div className="relative rounded-[2.5rem] bg-[#0B4A3D] overflow-hidden border border-[#07382e] shadow-2xl group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E3B33C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#E3B33C 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            <div className="w-full lg:w-1/2 text-center lg:text-right space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E3B33C] px-4 py-1.5 text-xs font-black text-[#0B4A3D] shadow-lg animate-pulse">
                🔥 عرض الأسبوع المحدود
              </div>
              <h3 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
                خصم حصري على <span className="text-[#E3B33C]">تشكيلة العسل</span>
              </h3>
              <p className="text-sm text-[#C2DFDB] font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                استمتع بطعم الطبيعة الأصلي مع عسل أختيار. احصل الآن على خصم 5 جنيهات على كل عبوة من جميع أنواع العسل لدينا لفترة محدودة.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-2">
                <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-center px-3">
                    <span className="block text-2xl font-black text-white">03</span>
                    <span className="text-[0.65rem] text-[#C2DFDB] font-bold">أيام</span>
                  </div>
                  <div className="text-2xl font-black text-[#E3B33C] mb-3">:</div>
                  <div className="text-center px-3">
                    <span className="block text-2xl font-black text-white">14</span>
                    <span className="text-[0.65rem] text-[#C2DFDB] font-bold">ساعة</span>
                  </div>
                  <div className="text-2xl font-black text-[#E3B33C] mb-3">:</div>
                  <div className="text-center px-3">
                    <span className="block text-2xl font-black text-white">59</span>
                    <span className="text-[0.65rem] text-[#C2DFDB] font-bold">دقيقة</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => onSelectCategory('عسل النحل')}
                  className="uiverse-btn-primary bg-[#E3B33C] text-[#0B4A3D] hover:bg-[#D9A52E] shadow-[0_0_20px_rgba(227,179,60,0.4)] border-none"
                >
                  <ArrowLeft size={18} /> تصفح تشكيلة العسل
                </button>
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-400/80">توفير</span>
                  <span className="text-3xl font-black text-[#E3B33C]">-5 ج.م</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative h-64 sm:h-80 lg:h-96 perspective-1000">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                className="absolute left-1/4 lg:left-10 top-10 w-32 sm:w-44 aspect-square rounded-[2rem] bg-white/10 backdrop-blur-md p-2 shadow-2xl border border-white/20 z-10 rotate-[-12deg]"
              >
                <img src={PRODUCT_IMAGES['عسل نحل زهرة موالح']} alt="عسل نحل" className="w-full h-full object-cover rounded-xl" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-1/4 lg:right-10 top-4 w-28 sm:w-40 aspect-square rounded-[2rem] bg-white/10 backdrop-blur-md p-2 shadow-2xl border border-white/20 z-10 rotate-[8deg]"
              >
                <img src={PRODUCT_IMAGES['عسل نحل سدر جبلي']} alt="عسل سدر" className="w-full h-full object-cover rounded-xl bg-white" />
              </motion.div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-40 sm:w-56 aspect-[4/5] rounded-[2rem] bg-white p-3 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-4 border-[#E3B33C] z-20 group-hover:scale-105 transition-transform duration-500"
              >
                <img src={PRODUCT_IMAGES['عسل نحل طبيعي']} alt="عسل نحل" className="w-full h-full object-cover rounded-xl" />
                <span className="absolute -top-4 -right-4 bg-[#E3B33C] text-[#0B4A3D] font-black text-xs px-3 py-2 rounded-full shadow-lg transform rotate-12">
                  طبيعي 💯
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
