import { Award, Leaf, ShieldCheck, Sparkles, Star, Users } from 'lucide-react';
import { PRODUCT_IMAGES } from '@/data/products';

export function AboutPage() {
  return (
    <main className="store-shell py-12 space-y-24">
      {/* 1. About Hero */}
      <section className="relative rounded-[3rem] bg-[#7B694D] overflow-hidden flex flex-col md:flex-row items-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#E3B33C 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 w-full md:w-1/2 p-10 sm:p-16 text-center md:text-right">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-black text-[#E3B33C] mb-6 shadow-2xs backdrop-blur-sm">
            <Sparkles size={14} className="text-[#E3B33C]" /> قصة أختيار
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-6">
            من قلب الطبيعة <br />
            <span className="text-[#E3B33C]">إلى مائدتك.</span>
          </h1>
          <p className="text-[#FAF7F0] text-sm sm:text-base font-medium leading-relaxed max-w-md mx-auto md:mx-0">
            بدأت رحلتنا بشغف البحث عن الطعم الأصيل والجودة التي لا تقبل المساومة. في أختيار، نحن لا نبيع مجرد منتجات، بل نقدم تجربة طبيعية خالصة تعيد إليك ذكريات "أيام زمان".
          </p>
        </div>
        
        <div className="relative z-10 w-full md:w-1/2 h-64 md:h-full min-h-[400px]">
          <img 
            src={PRODUCT_IMAGES['عسل نحل زهرة موالح']} 
            alt="منتجات أختيار الطبيعية" 
            className="absolute inset-0 w-full h-full object-cover object-center rounded-bl-[3rem] md:rounded-l-[3rem] md:rounded-bl-none md:rounded-br-[3rem]"
          />
        </div>
      </section>

      {/* 2. Core Pillars */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#7B694D] uppercase tracking-wider">قيمنا الجوهرية</span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#7B694D]">لماذا تختار "أختيار"؟</h2>
          <p className="text-slate-500 text-sm font-medium">نلتزم بأعلى معايير النقاء والجودة في كل قطرة وحبة نقدمها لك.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-[#E5E2D8] shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F4EA] grid place-items-center text-[#7B694D]">
              <Leaf size={28} />
            </div>
            <h3 className="font-display text-xl font-extrabold text-[#7B694D]">طبيعي 100% بدون إضافات</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              جميع منتجاتنا خالية تماماً من المواد الحافظة، الألوان الصناعية، أو أي إضافات كيميائية. نضمن لك المنتج في صورته الخام الأصلية.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E5E2D8] shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] grid place-items-center text-[#D9A52E]">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-display text-xl font-extrabold text-[#7B694D]">فحص وجودة صارمة</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              تخضع شحناتنا لاختبارات دقيقة للتأكد من المكونات والنقاء، خصوصاً عسل النحل والزيوت والمكسرات المستخف منها الطحينة.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E5E2D8] shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7EFE9] grid place-items-center text-[#7B694D]">
              <Award size={28} />
            </div>
            <h3 className="font-display text-xl font-extrabold text-[#7B694D]">مصدر موثوق من المزارع</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              نتعامل مباشرة مع مناحل ومزارع مصرية عريقة تلتزم بالرعي الطبيعي والزراعة النظيفة المستدامة.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Numbers & Stats */}
      <section className="rounded-3xl bg-[#F7F4EA] border border-[#E8E4D9] p-8 sm:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center text-[#7B694D] mb-2"><Users size={28} /></div>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#7B694D]">+10,000</div>
            <div className="text-xs font-bold text-slate-500">عميل يثق بنا</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center text-[#7B694D] mb-2"><Leaf size={28} /></div>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#7B694D]">100%</div>
            <div className="text-xs font-bold text-slate-500">منتجات طبيعية</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center text-[#7B694D] mb-2"><Star size={28} /></div>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#7B694D]">4.9 / 5</div>
            <div className="text-xs font-bold text-slate-500">تقييم الجودة</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center text-[#7B694D] mb-2"><Award size={28} /></div>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#7B694D]">15+</div>
            <div className="text-xs font-bold text-slate-500">سنة خبرة</div>
          </div>
        </div>
      </section>
    </main>
  );
}
