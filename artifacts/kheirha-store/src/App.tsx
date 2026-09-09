import { useMemo, useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Droplets,
  FileText,
  Heart,
  Minus,
  Package,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Wheat,
  X,
  MessageCircle,
  Home,
  Menu,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Router as WouterRouter, useLocation } from 'wouter';

type Category = 'أساسيات البيت' | 'عسل النحل' | 'منتجات الألبان' | 'منتجات السمسم' | 'المربيات';
type Variant = {
  id: string;
  size: string;
  price: number | null;
  discountEligible: boolean;
};
type Product = {
  id: string;
  name: string;
  category: Category;
  variants: Variant[];
  accent: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};
type CartItem = {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number | null;
  discountEligible: boolean;
  quantity: number;
};
type CatalogRow = readonly [string, string, number | null];
type ProductSeed = Omit<Product, 'accent' | 'icon'>;

const WHATSAPP_URL = 'https://wa.me/201100808082';
const money = new Intl.NumberFormat('ar-EG');
const categories = ['الكل', 'أساسيات البيت', 'عسل النحل', 'منتجات الألبان', 'منتجات السمسم', 'المربيات'] as const;

const groupRows = (
  rows: readonly CatalogRow[],
  category: Category,
  prefix: string,
  discountNames: (name: string) => boolean = () => false,
): ProductSeed[] => {
  const grouped = new Map<string, ProductSeed>();
  rows.forEach(([name, size, price], index) => {
    const variant: Variant = {
      id: `${prefix}-variant-${index}`,
      size,
      price,
      discountEligible: discountNames(name),
    };
    const current = grouped.get(name);
    if (current) {
      current.variants.push(variant);
    } else {
      grouped.set(name, {
        id: `${prefix}-${grouped.size}`,
        name,
        category,
        variants: [variant],
      });
    }
  });
  return [...grouped.values()];
};

const pantry = groupRows([
  ['سكر', '١ كيلو', 25], ['دقيق', '١ كيلو', 21], ['ارز ابيض عريض الحبة', '١ كيلو', 31],
  ['ارز ابيض رفيع الحبة', '١ كيلو', 26], ['ارز ابيض رفيع الحبة', '٣ كيلو', 75],
  ['ارز ابيض رفيع الحبة', '٥ كيلو', 125], ['زيت', '١ لتر', 70], ['زيت', '٩٠٠ مل', 64],
  ['زيت', '٧٠٠ مل', 50], ['خل', '١ لتر', 12], ['فول بلدي', '½ كيلو', 25],
  ['عدس اصفر', '½ كيلو', 25], ['عدس بجبة', '½ كيلو', 23], ['لوبيا', '½ كيلو', 28],
  ['فاصوليا بيضاء', '½ كيلو', 30], ['ذرة فشار', '½ كيلو', 21], ['حمص الشام', '½ كيلو', 32],
] as CatalogRow[], 'أساسيات البيت', 'pantry');

const honey = groupRows([
  ['عسل نحل نوارة برسيم', '٥٠٠ جرام', 75], ['عسل نحل نوارة برسيم', '١ كجم', 145],
  ['عسل نحل زهرة موالح', '٥٠٠ جرام', 100], ['عسل نحل زهرة موالح', '١ كجم', 190],
  ['عسل نحل حبة البركة', '٥٠٠ جرام', 95], ['عسل نحل حبة البركة', '١ كجم', 180],
  ['عسل نحل حبة بردقوش', '٥٠٠ جرام', 95], ['عسل نحل حبة بردقوش', '١ كجم', 180],
  ['عسل نحل كافور', '٥٠٠ جرام', 95], ['عسل نحل كافور', '١ كجم', 180],
  ['عسل نحل سدر جبلي', '٥٠٠ جرام', 200], ['عسل نحل سدر جبلي', '١ كجم', 380],
  ['شمع عسل', '٢٥٠ جرام', 63], ['شمع عسل', '٥٠٠ جرام', 125],
  ['عسل أسود', '٥٠٠ جرام', 35], ['عسل أسود', '١ كجم', 65],
] as CatalogRow[], 'عسل النحل', 'honey', (name) => name.startsWith('عسل نحل') || name === 'شمع عسل');

const dairy = groupRows([
  ['زبد بقري قشطة جاهزة', '١ كجم', 160], ['زبد جاموسي قشطة جاهزة', '١ كجم', 180],
  ['زبد بقري خليط', '١ كجم', 205], ['زبد جاموسي خليط', '١ كجم', 225],
  ['زبد بقري طبيعي', '١ كجم', 320], ['زبد جاموسي طبيعي', '١ كجم', 340],
  ['سمن بقري طبيعي', '٥٥٠ جرام', 210], ['سمن بقري طبيعي', '١ كجم', 380],
  ['سمن جاموسي طبيعي', '٥٥٠ جرام', 220], ['سمن جاموسي طبيعي', '١ كجم', 410],
] as CatalogRow[], 'منتجات الألبان', 'dairy');

const sesame = groupRows([
  ['طحينة صافي', '٩٠٠ جرام', 150], ['حلاوة بلدي سادة', '٥٥٠ جرام', 150], ['حلاوة بلدي فستق', '٥٥٠ جرام', 150],
] as CatalogRow[], 'منتجات السمسم', 'sesame');

const jams = groupRows([
  ['مربى فراولة سبيريد', '١ كجم', null], ['مربى فراولة قطع', '١ كجم', null], ['مربى تين سبيريد', '١ كجم', null],
  ['مربى تين قطع', '١ كجم', null], ['مربى جزر مهروس', '١ كجم', null], ['مربى جزر مبشور', '١ كجم', null],
  ['مربى قرع مهروس', '١ كجم', null], ['مربى قرع مبشور', '١ كجم', null], ['مربى تفاح', '١ كجم', null],
  ['مربى طماطم', '١ كجم', null], ['مربى كمكوات', '١ كجم', null], ['مربى بلح', '١ كجم', null],
] as CatalogRow[], 'المربيات', 'jams');

const productData: Product[] = [...pantry, ...honey, ...dairy, ...sesame, ...jams].map((product) => ({
  ...product,
  accent: product.category === 'عسل النحل' ? 'honey' : product.category === 'أساسيات البيت' ? 'grain' : product.category === 'منتجات الألبان' ? 'dairy' : product.category === 'منتجات السمسم' ? 'sesame' : 'jam',
  icon: product.category === 'عسل النحل' ? Droplets : product.category === 'أساسيات البيت' ? Wheat : product.category === 'منتجات الألبان' ? PackageCheck : product.category === 'منتجات السمسم' ? CircleHelp : Heart,
}));

const displayPrice = (variant: Pick<Variant, 'price' | 'discountEligible'>) => variant.price === null ? null : variant.discountEligible ? variant.price - 5 : variant.price;
const formatPrice = (price: number) => `${money.format(price)} ج.م`;

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary>
            <Storefront />
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function HeroCarousel({ onSelectCategory, onBrowse }: { onSelectCategory: (cat: Category) => void; onBrowse: () => void }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'honey-offer',
      badge: '🍯 عرض خاص لفترة محدودة',
      title: 'حلاوة العسل تزيد،',
      highlightTitle: 'وسعرها يقل 5 جنيه.',
      desc: 'الخصم مطبق على جميع أنواع عسل النحل الطبيعي والنقي 100%. أطلب عسلك البلدي الآن واستفد من الخصم المباشر.',
      ctaText: 'تصفح عسل النحل',
      category: 'عسل النحل' as Category,
      tagBg: 'bg-[#f4c842] text-[#174d45]',
      cardBg: 'bg-gradient-to-br from-[#174d45] via-[#1e584f] to-[#123e37]',
      accentBg: 'bg-[#b8543d]',
      badgeText: 'خصم ٥ ج لكل عبوة',
      badgeTitle: 'عسل نحل طبيعي',
      icon: Droplets,
    },
    {
      id: 'pantry-essentials',
      badge: '🌾 مونة البيت المصرية',
      title: 'أساسيات المطبخ،',
      highlightTitle: 'على أصولها وبسعر عادل.',
      desc: 'السكر، الدقيق، الأرز البقوليات والزيوت. مونتك كاملة جاهزة للطلب ونوصلها لك حتى باب البيت بسهولة.',
      ctaText: 'تصفح أساسيات البيت',
      category: 'أساسيات البيت' as Category,
      tagBg: 'bg-[#efe4c6] text-[#174d45]',
      cardBg: 'bg-gradient-to-br from-[#274c44] via-[#2e5950] to-[#1c3a33]',
      accentBg: 'bg-[#f4c842]',
      badgeText: 'أسعار واضحة ومحدثة',
      badgeTitle: 'مونة البيت اليومية',
      icon: Wheat,
    },
    {
      id: 'dairy-ghee',
      badge: '🧈 طعم بلدي أصيل',
      title: 'سمن وزبد بلدي،',
      highlightTitle: 'من خير طبيعتنا 100%.',
      desc: 'سمن وبقري وجاموسي طبيعي خالص، طعم ورائحة الزبد البلدي التي تذكرك بطبخ البيت الأصيل.',
      ctaText: 'تصفح منتجات الألبان',
      category: 'منتجات الألبان' as Category,
      tagBg: 'bg-[#f9dc77] text-[#174d45]',
      tagColor: 'text-[#174d45]',
      cardBg: 'bg-gradient-to-br from-[#2a4e47] via-[#174d45] to-[#113831]',
      accentBg: 'bg-[#997840]',
      badgeText: 'طبيعي 100%',
      badgeTitle: 'سمن وزبد أختيار',
      icon: PackageCheck,
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const active = slides[current];
  const Icon = active.icon;

  return (
    <section
      className="store-shell py-6"
      aria-label="عرض العروض الرئيسية"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`relative overflow-hidden rounded-[2.2rem] ${active.cardBg} p-6 text-[#fffaf0] shadow-[0_15px_40px_-15px_#174d4540] transition-all duration-700 sm:p-10 lg:p-12`}>
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#ffffff]/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#f4c842]/10 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div className="animate-float-in">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold shadow-sm ${active.tagBg}`}>
              {active.badge}
            </span>

            <h1 className="font-display mt-5 text-3xl font-extrabold leading-[1.25] text-[#fffaf0] sm:text-5xl lg:text-6xl">
              {active.title}
              <br />
              <span className="text-[#f4c842]">{active.highlightTitle}</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm font-semibold leading-8 text-[#e3f0ec] sm:text-base">
              {active.desc}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(active.category);
                  onBrowse();
                }}
                className="group flex items-center gap-3 rounded-full bg-[#f4c842] px-6 py-3.5 text-sm font-extrabold text-[#174d45] shadow-[0_6px_0_#b88a0e] transition-all hover:-translate-y-1 hover:bg-[#fff0a3] active:translate-y-0.5 active:shadow-[0_2px_0_#b88a0e]"
                data-testid="button-hero-carousel-cta"
              >
                {active.ctaText}
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border-2 border-[#fffaf0]/30 bg-[#fffaf0]/10 px-5 py-3.5 text-sm font-extrabold text-[#fffaf0] backdrop-blur-sm transition-all hover:bg-[#fffaf0]/20"
                data-testid="button-hero-carousel-whatsapp"
              >
                <MessageCircle size={18} />
                طلب مباشر عبر واتساب
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="grain relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-[#fffaf0]/30 bg-[#fffaf0]/10 backdrop-blur-md shadow-2xl sm:h-72 sm:w-72">
              <div className="relative z-10 flex flex-col items-center text-center p-6">
                <div className={`mb-4 grid h-20 w-20 place-items-center rounded-3xl ${active.accentBg} text-[#fffaf0] shadow-lg`}>
                  <Icon size={40} strokeWidth={2} />
                </div>
                <span className="font-display text-2xl font-extrabold text-[#fffaf0]">{active.badgeTitle}</span>
                <span className="mt-1.5 rounded-full bg-[#fffaf0]/20 px-3 py-1 text-xs font-bold text-[#f9dc77]">{active.badgeText}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex items-center justify-between border-t border-[#fffaf0]/15 pt-5">
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-[#f4c842]' : 'w-2.5 bg-[#fffaf0]/30 hover:bg-[#fffaf0]/60'}`}
                aria-label={`الانتقال للعرض ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#fffaf0]/25 bg-[#fffaf0]/10 text-[#fffaf0] backdrop-blur-sm transition-all hover:bg-[#fffaf0]/30"
              aria-label="العرض السابق"
            >
              <ChevronRight size={20} />
            </button>
            <button
              type="button"
              onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#fffaf0]/25 bg-[#fffaf0]/10 text-[#fffaf0] backdrop-blur-sm transition-all hover:bg-[#fffaf0]/30"
              aria-label="العرض التالي"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileNavDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-nav-title">
      <div className="absolute inset-0 bg-[#174d45]/50 backdrop-blur-xs" onClick={onClose} />
      <aside className="animate-float-in absolute right-0 top-0 bottom-0 flex w-[82%] max-w-xs flex-col border-l border-[#d9c99d] bg-[#fffaf0] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#ded2b5] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f4c842] text-[#174d45] shadow-[2px_2px_0_#174d45]">
              <ShoppingBag size={21} strokeWidth={2.2} />
            </span>
            <span>
              <span className="font-display block text-lg font-extrabold text-[#174d45]">أختيار</span>
              <span className="block text-[.6rem] font-bold text-[#997840]">مونة البيت المصرية</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-[#d9c99d] text-[#174d45] transition-colors hover:bg-[#efe4c6]"
            aria-label="إغلاق القائمة"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-3">
          <a
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl bg-[#efe4c6]/60 px-4 py-3.5 text-sm font-extrabold text-[#174d45] transition-colors hover:bg-[#174d45] hover:text-[#fffaf0]"
          >
            <Home size={19} className="text-[#b8543d]" />
            <span>الرئيسية</span>
          </a>
          <a
            href="/products"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl bg-[#efe4c6]/60 px-4 py-3.5 text-sm font-extrabold text-[#174d45] transition-colors hover:bg-[#174d45] hover:text-[#fffaf0]"
          >
            <ShoppingBag size={19} className="text-[#b8543d]" />
            <span>منتجات أختيار</span>
          </a>
          <a
            href="#our-story"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl bg-[#efe4c6]/60 px-4 py-3.5 text-sm font-extrabold text-[#174d45] transition-colors hover:bg-[#174d45] hover:text-[#fffaf0]"
          >
            <FileText size={19} className="text-[#b8543d]" />
            <span>عن أختيار</span>
          </a>
        </nav>

        <div className="mt-auto border-t border-[#ded2b5] pt-5">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-xs font-extrabold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle size={18} />
            <span>تواصل مباشرة عبر واتساب</span>
          </a>
        </div>
      </aside>
    </div>
  );
}

function Storefront() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('الكل');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => productData.filter((product) => {
    const inCategory = activeCategory === 'الكل' || product.category === activeCategory;
    const searchMatch = `${product.name} ${product.variants.map((variant) => variant.size).join(' ')}`.includes(search.trim());
    return inCategory && searchMatch;
  }), [activeCategory, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (displayPrice(item) ?? 0) * item.quantity, 0);
  const inquiryCount = cart.filter((item) => item.price === null).reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, variant: Variant) => {
    const cartItemId = `${product.id}:${variant.id}`;
    setCart((current) => {
      const found = current.find((item) => item.id === cartItemId);
      return found
        ? current.map((item) => item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          size: variant.size,
          price: variant.price,
          discountEligible: variant.discountEligible,
          quantity: 1,
        }];
    });
    setAddedId(variant.id);
    window.setTimeout(() => setAddedId(null), 1100);
  };

  const updateQuantity = (id: string, amount: number) => setCart((current) => current.flatMap((item) => {
    if (item.id !== id) return [item];
    const quantity = item.quantity + amount;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  }));

  const removeFromCart = (id: string) => setCart((current) => current.filter((item) => item.id !== id));

  const checkout = () => {
    if (!cart.length) return;
    const lines = cart.map((item) => {
      const price = displayPrice(item);
      return `- ${item.name} (${item.size}) × ${item.quantity}: ${price === null ? 'السعر عند الطلب' : formatPrice(price * item.quantity)}`;
    });
    const summary = [
      'مرحباً أختيار، أريد تأكيد هذا الطلب:',
      ...lines,
      `الإجمالي: ${formatPrice(subtotal)}${inquiryCount ? ' + منتجات بسعر عند الطلب' : ''}`,
      '',
      'من فضلكم تواصلوا معي لتأكيد الطلب والتفاصيل.',
    ].join('\n');
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(summary)}`, '_blank', 'noopener,noreferrer');
  };

  const scrollToProducts = () => {
    setLocation('/products');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (location === '/products' || location.startsWith('/products/')) {
    const detailId = location.startsWith('/products/') ? location.split('/')[2] : null;
    const selectedProduct = detailId ? productData.find((product) => product.id === detailId) ?? null : null;
    return (
      <ProductsPage
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
        filteredProducts={filteredProducts}
        selectedProduct={selectedProduct}
        addedId={addedId}
        cart={cart}
        cartCount={cartCount}
        cartOpen={cartOpen}
        subtotal={subtotal}
        inquiryCount={inquiryCount}
        onOpenProduct={(product) => {
          setLocation(`/products/${product.id}`);
          window.scrollTo({ top: 0, behavior: 'auto' });
        }}
        onBack={() => {
          setLocation('/products');
          window.scrollTo({ top: 0, behavior: 'auto' });
        }}
        onAdd={addToCart}
        onOpenCart={() => setCartOpen(true)}
        onCloseCart={() => setCartOpen(false)}
        onUpdate={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={checkout}
      />
    );
  }

  return (
    <main className="min-h-[100dvh] overflow-x-hidden">
      <div className="bg-[#174d45] px-4 py-2 text-center text-xs font-bold tracking-wide text-[#f9dc77]" data-testid="promo-strip">
        خصم 5 جنيه على منتجات عسل النحل لفترة محدودة
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-[#ded2b5]/80 bg-[#fffaf0]/90 backdrop-blur-md shadow-[0_4px_20px_-10px_#174d4520] transition-all duration-300" data-testid="header-store">
        <div className="store-shell flex items-center justify-between gap-4 py-3.5">
          <a href="/" className="group flex items-center gap-3" data-testid="link-brand">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4c842] text-[#174d45] shadow-[3px_3px_0_#174d45] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
              <ShoppingBag size={23} strokeWidth={2.4} />
            </span>
            <span>
              <span className="font-display block text-[1.4rem] font-extrabold leading-none text-[#174d45]">أختيار</span>
              <span className="mt-1 block text-[.68rem] font-bold tracking-[.13em] text-[#997840]">مونة البيت المصرية</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-2 rounded-full border border-[#ded2b5]/80 bg-[#efe4c6]/50 p-1.5" aria-label="التنقل الرئيسي">
            <a href="/" className="flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-extrabold text-[#174d45] transition-all hover:bg-[#174d45] hover:text-[#fffaf0]" data-testid="link-home">
              الرئيسية
            </a>
            <a href="/products" className="flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-extrabold text-[#174d45] transition-all hover:bg-[#174d45] hover:text-[#fffaf0]" data-testid="link-products">
              المنتجات
            </a>
            <a href="#our-story" className="flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-extrabold text-[#174d45] transition-all hover:bg-[#174d45] hover:text-[#fffaf0]" data-testid="link-story">
              عن أختيار
            </a>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button onClick={() => setCartOpen(true)} className="group relative flex h-11 items-center gap-2.5 rounded-full border-2 border-[#174d45] bg-[#fffaf0] px-4 py-2 text-sm font-extrabold text-[#174d45] shadow-[3px_3px_0_#174d45] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#174d45] active:translate-y-0 active:shadow-[1px_1px_0_#174d45]" aria-label="فتح سلة المشتريات" data-testid="button-open-cart">
              <ShoppingBag size={20} strokeWidth={2.2} />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#b8543d] px-1.5 text-xs font-bold text-[#fffaf0]" data-testid="text-cart-count">{money.format(cartCount)}</span>}
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#174d45] bg-[#fffaf0] text-[#174d45] shadow-[3px_3px_0_#174d45] transition-transform hover:-translate-y-0.5 md:hidden"
              aria-label="فتح قائمة الموبايل"
              data-testid="button-open-mobile-menu"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      <HeroCarousel onSelectCategory={setActiveCategory} onBrowse={scrollToProducts} />

      <section className="bg-[#174d45] py-5 text-[#fffaf0]" aria-label="مميزات أختيار">
        <div className="store-shell grid gap-4 text-sm font-bold sm:grid-cols-3">
          <div className="flex items-center gap-3"><PackageCheck className="text-[#f4c842]" size={21} /><span>مونة مختارة للبيت</span></div>
          <div className="flex items-center gap-3"><Wheat className="text-[#f4c842]" size={21} /><span>قائمة أسعار واضحة ومحدثة</span></div>
          <div className="flex items-center gap-3"><MessageCircle className="text-[#f4c842]" size={21} /><span>اطلب مباشرة على واتساب</span></div>
        </div>
      </section>

      <section id="our-story" className="border-y border-[#ded2b5] bg-[#efe4c6]/60 py-14 lg:py-20">
        <div className="store-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rotate-3 rounded-[2rem] border-2 border-[#b8543d]/30" />
            <div className="relative rounded-[1.5rem] border-4 border-[#174d45] bg-[#fffaf0] p-7 shadow-[8px_8px_0_#174d45]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4c842] text-[#174d45] shadow-[3px_3px_0_#174d45]">
                <ShoppingBag size={30} strokeWidth={2.2} />
              </div>
              <span className="font-display text-2xl font-extrabold text-[#174d45]">منتجات أختيار الأصيلة</span>
              <p className="mt-2 text-xs font-bold leading-6 text-[#70877f]">
                جودة عالية وسعر عادل لكل منتجات المطبخ والعسل البلدي والألبان والمربيات.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#efe4c6] px-3 py-1 text-[.7rem] font-extrabold text-[#174d45]">عسل نحل طبيعي</span>
                <span className="rounded-full bg-[#efe4c6] px-3 py-1 text-[.7rem] font-extrabold text-[#174d45]">سمن وزبد بلدي</span>
                <span className="rounded-full bg-[#efe4c6] px-3 py-1 text-[.7rem] font-extrabold text-[#174d45]">مونة البيت</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-[#f4c842] px-4 py-3 text-xs font-extrabold text-[#174d45] shadow-md">جودة وضمان أختيار</div>
          </div>
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-extrabold tracking-[.14em] text-[#b8543d]"><FileText size={16} /> من قائمتنا إلى سلتك</div>
            <h2 className="font-display max-w-xl text-3xl font-extrabold leading-[1.45] text-[#174d45] sm:text-4xl">أختيار، لأن المونة الحلوة تبدأ من <span className="text-[#b8543d]">اختيار صح.</span></h2>
            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-[#58736d]">نحن نرتب لك احتياجات المطبخ كما تحبها: واضحة، معروفة، ومن غير لف كتير. شوف السعر، اختار الكمية، وابعت طلبك في رسالة واحدة.</p>
            <div className="mt-7 grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#d5c49e] bg-[#fffaf0] p-4"><Wheat size={22} className="mb-3 text-[#b8543d]" /><h3 className="font-bold text-[#174d45]">مونة كل يوم</h3><p className="mt-1 text-xs font-semibold leading-5 text-[#70877f]">سكر، دقيق، رز، بقوليات وأكثر.</p></div>
              <div className="rounded-2xl border border-[#d5c49e] bg-[#fffaf0] p-4"><MessageCircle size={22} className="mb-3 text-[#b8543d]" /><h3 className="font-bold text-[#174d45]">طلب من غير تعقيد</h3><p className="mt-1 text-xs font-semibold leading-5 text-[#70877f]">سلتك جاهزة في رسالة واتساب.</p></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#174d45] py-10 text-[#fffaf0]" data-testid="footer-store">
        <div className="store-shell flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4c842] text-[#174d45]"><ShoppingBag size={20} /></span><span className="font-display text-2xl font-extrabold">أختيار</span></div>
            <p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-[#bad0c5]">مونة البيت المصرية، بشكل أسهل وأقرب.</p>
          </div>
          <div className="flex flex-col items-start gap-3 text-sm font-bold sm:items-end">
            <span className="text-[#f9dc77]">للطلب والاستفسار</span>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-lg transition-colors hover:text-[#f4c842]" data-testid="link-footer-whatsapp"><MessageCircle size={19} /> 01100808082</a>
          </div>
        </div>
        <div className="store-shell mt-8 border-t border-[#4d776e] pt-5 text-xs font-semibold text-[#9bb9ae]">© أختيار — أسعار ومنتجات البيت بعناية.</div>
      </footer>

      {cartCount > 0 && <button onClick={() => setCartOpen(true)} className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-2xl bg-[#f4c842] px-5 py-3.5 text-sm font-extrabold text-[#174d45] shadow-[0_8px_25px_#174d4540] md:hidden" data-testid="button-mobile-cart"><span className="flex items-center gap-2"><ShoppingBag size={19} /> السلة ({money.format(cartCount)})</span><span>{formatPrice(subtotal)} <ArrowLeft className="mr-1 inline" size={16} /></span></button>}

      {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} inquiryCount={inquiryCount} onClose={() => setCartOpen(false)} onUpdate={updateQuantity} onRemove={removeFromCart} onCheckout={checkout} />}
    </main>
  );
}

function ProductsPage({ activeCategory, setActiveCategory, search, setSearch, filteredProducts, selectedProduct, addedId, cart, cartCount, cartOpen, subtotal, inquiryCount, onOpenProduct, onBack, onAdd, onOpenCart, onCloseCart, onUpdate, onRemove, onCheckout }: {
  activeCategory: (typeof categories)[number];
  setActiveCategory: (category: (typeof categories)[number]) => void;
  search: string;
  setSearch: (value: string) => void;
  filteredProducts: Product[];
  selectedProduct: Product | null;
  addedId: string | null;
  cart: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  subtotal: number;
  inquiryCount: number;
  onOpenProduct: (product: Product) => void;
  onBack: () => void;
  onAdd: (product: Product, variant: Variant) => void;
  onOpenCart: () => void;
  onCloseCart: () => void;
  onUpdate: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <main className="min-h-[100dvh] overflow-x-hidden">
      {selectedProduct ? (
        <ProductDetails product={selectedProduct} addedId={addedId} cartCount={cartCount} onBack={onBack} onAdd={onAdd} onOpenCart={onOpenCart} />
      ) : (
        <>
          <div className="bg-[#174d45] px-4 py-2 text-center text-xs font-bold tracking-wide text-[#f9dc77]" data-testid="promo-strip-products">
            خصم 5 جنيه على منتجات عسل النحل لفترة محدودة
          </div>
          <header className="sticky top-0 z-40 w-full border-b border-[#ded2b5]/80 bg-[#fffaf0]/90 backdrop-blur-md shadow-[0_4px_20px_-10px_#174d4520] transition-all duration-300" data-testid="header-products-page">
            <div className="store-shell flex items-center justify-between gap-4 py-3.5">
              <a href="/" className="group flex items-center gap-3" data-testid="link-products-brand">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4c842] text-[#174d45] shadow-[3px_3px_0_#174d45] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"><ShoppingBag size={23} strokeWidth={2.4} /></span>
                <span><span className="font-display block text-[1.4rem] font-extrabold leading-none text-[#174d45]">أختيار</span><span className="mt-1 block text-[.68rem] font-bold tracking-[.13em] text-[#997840]">مونة البيت المصرية</span></span>
              </a>

              <nav className="hidden md:flex items-center gap-2 rounded-full border border-[#ded2b5]/80 bg-[#efe4c6]/50 p-1.5" aria-label="التنقل في صفحة المنتجات">
                <a href="/" className="flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-extrabold text-[#174d45] transition-all hover:bg-[#174d45] hover:text-[#fffaf0]" data-testid="link-home-nav">
                  <Home size={16} className="text-[#b8543d]" />
                  الرئيسية
                </a>
                <a href="/products" className="flex items-center gap-1.5 rounded-full bg-[#174d45] px-5 py-2 text-sm font-extrabold text-[#fffaf0]" data-testid="link-products-nav">
                  المنتجات
                </a>
              </nav>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <button type="button" onClick={onOpenCart} className="group relative flex h-11 items-center gap-2.5 rounded-full border-2 border-[#174d45] bg-[#fffaf0] px-4 py-2 text-sm font-extrabold text-[#174d45] shadow-[3px_3px_0_#174d45] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#174d45] active:translate-y-0 active:shadow-[1px_1px_0_#174d45]" aria-label="فتح سلة المشتريات" data-testid="button-open-products-cart">
                  <ShoppingBag size={20} strokeWidth={2.2} /><span className="hidden sm:inline">السلة</span>{cartCount > 0 && <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#b8543d] px-1.5 text-xs font-bold text-[#fffaf0]">{money.format(cartCount)}</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                  className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#174d45] bg-[#fffaf0] text-[#174d45] shadow-[3px_3px_0_#174d45] transition-transform hover:-translate-y-0.5 md:hidden"
                  aria-label="فتح قائمة الموبايل"
                  data-testid="button-open-mobile-menu-products"
                >
                  <Menu size={21} />
                </button>
              </div>
            </div>
          </header>

          <MobileNavDrawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

          <section id="products" className="store-shell scroll-mt-4 pb-14 pt-7 lg:pb-20 lg:pt-12" aria-labelledby="products-title">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-extrabold tracking-[.14em] text-[#b8543d]"><span className="h-px w-8 bg-[#b8543d]" /> اختار اللي ناقصك</div>
                <h1 id="products-title" className="font-display text-4xl font-extrabold text-[#174d45] sm:text-5xl">كل منتجات أختيار</h1>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-7 text-[#70877f]">كل منتج في بطاقة واحدة، اختار الحجم من صفحة التفاصيل وأضفه للسلة بسهولة.</p>
              </div>
              <label className="flex w-full items-center gap-2 rounded-full border border-[#d9c99d] bg-[#fffaf0] px-4 py-3 text-sm text-[#70877f] shadow-sm md:max-w-xs">
                <Search size={18} aria-hidden="true" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن منتج..." className="w-full bg-transparent font-semibold outline-none placeholder:text-[#a5aa9d]" aria-label="البحث في المنتجات" data-testid="input-product-search" />
              </label>
            </div>
            <div className="sticky top-[61px] z-30 -mx-4 mb-9 flex gap-2 overflow-x-auto bg-[#fffaf0]/95 px-4 py-3.5 backdrop-blur-md border-y border-[#ded2b5]/60 shadow-sm no-scrollbar sm:mx-0 sm:rounded-2xl sm:border sm:px-4" role="tablist" aria-label="أقسام المنتجات">
              {categories.map((category) => (
                <button type="button" key={category} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category} className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-extrabold transition-all ${activeCategory === category ? 'border-[#174d45] bg-[#174d45] text-[#fffaf0] shadow-[3px_3px_0_#f4c842]' : 'border-[#d9c99d] bg-[#fffaf0] text-[#537169] hover:border-[#b8543d] hover:text-[#b8543d]'}`} data-testid={`tab-category-${category}`}>
                  {category}
                </button>
              ))}
            </div>
            {filteredProducts.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onOpen={() => onOpenProduct(product)} />)}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#cbbd98] bg-[#fffaf0] px-6 py-16 text-center" data-testid="empty-product-search">
                <Search size={30} className="mx-auto mb-4 text-[#b8543d]" />
                <h2 className="font-display text-xl font-extrabold text-[#174d45]">مفيش منتج بالاسم ده</h2>
                <p className="mt-2 text-sm font-semibold text-[#70877f]">جرب كلمة أبسط أو اختار قسم تاني.</p>
              </div>
            )}
          </section>
          <section className="store-shell pt-10 pb-14 lg:pt-14 lg:pb-20">
            <div className="grain relative overflow-hidden rounded-[2rem] bg-[#b8543d] px-6 py-10 text-[#fffaf0] shadow-[10px_10px_0_#f4c842] sm:px-12 sm:py-12 lg:flex lg:items-center lg:justify-between">
              <div className="relative z-10 max-w-xl"><div className="mb-4 flex items-center gap-2 text-xs font-extrabold tracking-[.12em] text-[#f9dc77]"><Clock3 size={15} /> عرض لفترة محدودة</div><h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">حلاوة العسل تزيد،<br />وسعرها يقل 5 جنيه.</h2><p className="mt-3 max-w-md text-sm font-semibold leading-7 text-[#ffe5cf]">الخصم مطبق على منتجات عسل النحل فقط. السعر الأصلي ظاهر لك جنب السعر بعد الخصم.</p></div>
              <div className="relative z-10 mt-8 flex items-end gap-3 lg:mt-0" aria-hidden="true"><div className="h-28 w-20 rotate-[-8deg] rounded-t-2xl border-4 border-[#174d45] bg-[#f4c842] shadow-[6px_6px_0_#174d45]"><div className="mt-9 border-y-2 border-[#174d45] py-1 text-center text-[.55rem] font-extrabold text-[#174d45]">عسل</div></div><div className="h-40 w-28 rotate-[6deg] rounded-t-3xl border-4 border-[#174d45] bg-[#f7e8b5] shadow-[6px_6px_0_#174d45]"><div className="mt-14 border-y-2 border-[#174d45] py-2 text-center text-xs font-extrabold text-[#174d45]">أختيار</div></div><div className="absolute -right-5 -top-5 grid h-16 w-16 rotate-12 place-items-center rounded-full border-4 border-[#174d45] bg-[#f4c842] text-center text-[.65rem] font-extrabold leading-4 text-[#174d45]">خصم<br />٥ ج</div></div>
            </div>
          </section>
          <footer className="bg-[#174d45] py-10 text-[#fffaf0]" data-testid="footer-products">
            <div className="store-shell flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4c842] text-[#174d45]"><ShoppingBag size={20} /></span><span className="font-display text-2xl font-extrabold">أختيار</span></div><p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-[#bad0c5]">مونة البيت المصرية، بشكل أسهل وأقرب.</p></div><div className="flex flex-col items-start gap-3 text-sm font-bold sm:items-end"><span className="text-[#f9dc77]">للطلب والاستفسار</span><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-lg transition-colors hover:text-[#f4c842]"><MessageCircle size={19} /> 01100808082</a></div></div>
            <div className="store-shell mt-8 border-t border-[#4d776e] pt-5 text-xs font-semibold text-[#9bb9ae]">© أختيار — أسعار ومنتجات البيت بعناية.</div>
          </footer>
        </>
      )}
      {cartCount > 0 && <button type="button" onClick={onOpenCart} className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-2xl bg-[#f4c842] px-5 py-3.5 text-sm font-extrabold text-[#174d45] shadow-[0_8px_25px_#174d4540] md:hidden" data-testid="button-mobile-cart"><span className="flex items-center gap-2"><ShoppingBag size={19} /> السلة ({money.format(cartCount)})</span><span>{formatPrice(subtotal)} <ArrowLeft className="mr-1 inline" size={16} /></span></button>}
      {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} inquiryCount={inquiryCount} onClose={onCloseCart} onUpdate={onUpdate} onRemove={onRemove} onCheckout={onCheckout} />}
    </main>
  );
}

function ProductCard({ product, index, onOpen }: { product: Product; index: number; onOpen: () => void }) {
  const Icon = product.icon;
  const isDiscounted = product.variants.some((variant) => variant.discountEligible);
  const priceVariants = product.variants.filter((variant) => variant.price !== null);
  const lowestPrice = priceVariants.length ? Math.min(...priceVariants.map((variant) => displayPrice(variant) as number)) : null;
  return (
    <button type="button" onClick={onOpen} className={`product-card animate-float-in delay-${Math.min((index % 3) + 1, 3)} group w-full overflow-hidden rounded-[1.25rem] border border-[#ded2b5] bg-[#fffaf0] p-3 text-right shadow-sm sm:p-4`} data-testid={`card-product-${product.id}`}>
      <div className={`product-art relative mb-4 flex h-28 items-center justify-center overflow-hidden rounded-xl ${product.accent === 'honey' ? 'bg-[#f9dda0]' : product.accent === 'grain' ? 'bg-[#ead4a2]' : product.accent === 'dairy' ? 'bg-[#d7e3d3]' : product.accent === 'sesame' ? 'bg-[#dec4a0]' : 'bg-[#e4c9b7]'}`}>
        <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-[#fffaf0]/40" />
        <div className="relative grid h-16 w-16 place-items-center rounded-[1.35rem] border-2 border-[#174d45] bg-[#fffaf0]/80 text-[#174d45] shadow-[4px_4px_0_#174d45] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3">
          <Icon size={29} strokeWidth={1.8} />
        </div>
        {isDiscounted && <span className="absolute right-2 top-2 rounded-full bg-[#b8543d] px-2 py-1 text-[.59rem] font-extrabold text-[#fffaf0]">خصم ٥ ج</span>}
      </div>
      <div className="min-h-[92px]">
        <h3 className="text-sm font-extrabold leading-6 text-[#174d45]" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
        <p className="mt-2 text-xs font-semibold text-[#8b9481]" data-testid={`text-product-size-${product.id}`}>{product.variants.length === 1 ? product.variants[0].size : `${product.variants.length} أحجام متاحة`}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#eadfc7] pt-3">
        <div>
          {lowestPrice === null ? <span className="text-[.7rem] font-extrabold text-[#b8543d]" data-testid={`text-product-inquiry-${product.id}`}>السعر عند الطلب</span> : (
            <span className="text-sm font-extrabold text-[#174d45]" data-testid={`text-product-price-${product.id}`}>يبدأ من {formatPrice(lowestPrice)}</span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-extrabold text-[#b8543d]">التفاصيل <ChevronRight size={15} /></span>
      </div>
    </button>
  );
}

function ProductDetails({ product, addedId, cartCount, onBack, onAdd, onOpenCart }: {
  product: Product;
  addedId: string | null;
  cartCount: number;
  onBack: () => void;
  onAdd: (product: Product, variant: Variant) => void;
  onOpenCart: () => void;
}) {
  const Icon = product.icon;
  const isHoneyOffer = product.variants.some((variant) => variant.discountEligible);
  return (
    <div className="min-h-[100dvh]">
      <div className="bg-[#174d45] px-4 py-2 text-center text-xs font-bold tracking-wide text-[#f9dc77]">
        خصم 5 جنيه على منتجات عسل النحل لفترة محدودة
      </div>
      <header className="sticky top-0 z-40 w-full border-b border-[#ded2b5]/80 bg-[#fffaf0]/90 backdrop-blur-md shadow-[0_4px_20px_-10px_#174d4520] transition-all duration-300">
        <div className="store-shell flex items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 rounded-full border-2 border-[#174d45] bg-[#fffaf0] px-4 py-2 text-sm font-extrabold text-[#174d45] shadow-[3px_3px_0_#174d45] transition-all hover:-translate-y-0.5 hover:bg-[#174d45] hover:text-[#fffaf0]">
              <Home size={17} className="text-[#b8543d]" />
              <span>الرئيسية</span>
            </a>
            <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-full border border-[#d9c99d] bg-[#fffaf0] px-4 py-2 text-sm font-extrabold text-[#174d45] shadow-sm transition-transform hover:-translate-y-0.5" aria-label="العودة إلى المنتجات">
              <ChevronRight size={18} /> كل المنتجات
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onOpenCart} className="group relative flex h-11 items-center gap-2.5 rounded-full border-2 border-[#174d45] bg-[#fffaf0] px-4 py-2 text-sm font-extrabold text-[#174d45] shadow-[3px_3px_0_#174d45] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#174d45] active:translate-y-0 active:shadow-[1px_1px_0_#174d45]" aria-label="فتح سلة المشتريات" data-testid="button-open-cart-details">
              <ShoppingBag size={20} strokeWidth={2.2} /><span className="hidden sm:inline">السلة</span>{cartCount > 0 && <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#b8543d] px-1.5 text-xs font-bold text-[#fffaf0]">{money.format(cartCount)}</span>}
            </button>
            <a href="/" className="group flex items-center gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4c842] text-[#174d45] shadow-[3px_3px_0_#174d45] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"><ShoppingBag size={22} /></span>
              <span className="hidden sm:block"><span className="font-display block text-[1.3rem] font-extrabold leading-none text-[#174d45]">أختيار</span><span className="mt-1 block text-[.66rem] font-bold tracking-[.13em] text-[#997840]">مونة البيت المصرية</span></span>
            </a>
          </div>
        </div>
      </header>
      <section className="store-shell pb-16 pt-5 lg:pb-24 lg:pt-10">
        <div className="mb-6 flex items-center gap-2 text-xs font-extrabold text-[#b8543d]"><button type="button" onClick={onBack} className="hover:underline">المنتجات</button><ChevronLeft size={14} /><span>{product.name}</span></div>
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:gap-14">
          <div className={`product-art relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[2rem] ${product.accent === 'honey' ? 'bg-[#f9dda0]' : product.accent === 'grain' ? 'bg-[#ead4a2]' : product.accent === 'dairy' ? 'bg-[#d7e3d3]' : product.accent === 'sesame' ? 'bg-[#dec4a0]' : 'bg-[#e4c9b7]'}`}>
            <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[#fffaf0]/50" />
            <div className="relative grid h-36 w-36 place-items-center rounded-[2.5rem] border-4 border-[#174d45] bg-[#fffaf0]/85 text-[#174d45] shadow-[9px_9px_0_#174d45]"><Icon size={64} strokeWidth={1.3} /></div>
            {isHoneyOffer && <span className="absolute right-5 top-5 rounded-full bg-[#b8543d] px-4 py-2 text-xs font-extrabold text-[#fffaf0]">خصم ٥ جنيه</span>}
          </div>
          <div>
            <span className="inline-flex rounded-full bg-[#efe4c6] px-3 py-1.5 text-xs font-extrabold text-[#b8543d]">{product.category}</span>
            <h1 className="font-display mt-4 text-3xl font-extrabold leading-[1.35] text-[#174d45] sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-[#70877f]">اختار الحجم المناسب لك، وشوف السعر النهائي بعد الخصم إن وُجد، ثم أضفه إلى سلتك لإرسال الطلب على واتساب.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {product.variants.map((variant) => {
                const price = displayPrice(variant);
                return <div key={variant.id} className="rounded-2xl border border-[#d9c99d] bg-[#fffaf0] p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-xs font-bold text-[#8b9481]">حجم العبوة</p><p className="mt-1 text-base font-extrabold text-[#174d45]">{variant.size}</p></div>
                    {variant.discountEligible && <span className="rounded-full bg-[#f9dc77] px-2 py-1 text-[.62rem] font-extrabold text-[#174d45]">خصم ٥ ج</span>}
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    {price === null ? <span className="text-sm font-extrabold text-[#b8543d]">السعر عند الطلب</span> : <div className="leading-none">{variant.discountEligible && <del className="mb-1 block text-xs font-bold text-[#9e9a87]">{formatPrice(variant.price as number)}</del>}<span className="text-lg font-extrabold text-[#174d45]">{formatPrice(price)}</span></div>}
                    <button type="button" onClick={() => onAdd(product, variant)} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition-all ${addedId === variant.id ? 'bg-[#174d45] text-[#f4c842]' : 'bg-[#f4c842] text-[#174d45] hover:-translate-y-0.5'}`} data-testid={`button-add-variant-${variant.id}`}>
                      {addedId === variant.id ? <Check size={15} /> : <Plus size={15} />} {addedId === variant.id ? 'تمت الإضافة' : 'أضف للسلة'}
                    </button>
                  </div>
                </div>;
              })}
            </div>
            <div className="mt-7 rounded-2xl border border-[#ded2b5] bg-[#efe4c6]/60 p-4 text-sm font-semibold leading-7 text-[#58736d]">بعد اختيار الحجم والكمية، افتح السلة لإرسال طلبك كاملًا برسالة جاهزة إلى واتساب: <strong className="text-[#174d45]">01100808082</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CartDrawer({ cart, subtotal, inquiryCount, onClose, onUpdate, onRemove, onCheckout }: { cart: CartItem[]; subtotal: number; inquiryCount: number; onClose: () => void; onUpdate: (id: string, amount: number) => void; onRemove: (id: string) => void; onCheckout: () => void }) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button className="absolute inset-0 h-full w-full cursor-default bg-[#174d45]/45 backdrop-blur-[2px]" onClick={onClose} aria-label="إغلاق السلة" data-testid="button-close-cart-backdrop" />
      <aside className="animate-float-in absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-[#d9c99d] bg-[#fffaf0] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[#ded2b5] px-5 py-5">
          <div><p className="text-xs font-bold text-[#b8543d]">طلبك الحالي</p><h2 id="cart-title" className="font-display mt-1 text-2xl font-extrabold text-[#174d45]">سلة أختيار</h2></div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-[#d9c99d] text-[#174d45] transition-colors hover:bg-[#efe4c6]" aria-label="إغلاق السلة" data-testid="button-close-cart"><X size={20} /></button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center" data-testid="empty-cart">
              <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-[#efe4c6] text-[#b8543d]"><ShoppingBag size={34} strokeWidth={1.5} /></div>
              <h3 className="font-display text-xl font-extrabold text-[#174d45]">السلة لسه فاضية</h3>
              <p className="mt-2 max-w-[230px] text-sm font-semibold leading-6 text-[#70877f]">اختار مونة البيت اللي ناقصاك، وهتظهر هنا.</p>
              <button onClick={onClose} className="mt-6 rounded-full bg-[#174d45] px-5 py-3 text-sm font-extrabold text-[#fffaf0]" data-testid="button-empty-cart-browse">ابدأ التسوق</button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const price = displayPrice(item);
                return <div key={item.id} className="rounded-2xl border border-[#ded2b5] bg-[#fffdf7] p-3" data-testid={`row-cart-${item.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-sm font-extrabold leading-6 text-[#174d45]">{item.name}</h3><p className="text-xs font-semibold text-[#8b9481]">{item.size}</p></div>
                    <button onClick={() => onRemove(item.id)} className="text-[#a18d7c] transition-colors hover:text-[#b8543d]" aria-label={`حذف ${item.name}`} data-testid={`button-remove-cart-${item.id}`}><Trash2 size={17} /></button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#174d45]">{price === null ? 'السعر عند الطلب' : formatPrice(price * item.quantity)}</span>
                    <div className="flex items-center gap-2 rounded-full bg-[#efe4c6] p-1">
                      <button onClick={() => onUpdate(item.id, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#fffaf0] text-[#174d45] shadow-sm" aria-label="زيادة الكمية" data-testid={`button-increase-cart-${item.id}`}><Plus size={14} /></button>
                      <span className="min-w-5 text-center text-xs font-extrabold text-[#174d45]" data-testid={`text-cart-quantity-${item.id}`}>{money.format(item.quantity)}</span>
                      <button onClick={() => onUpdate(item.id, -1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#fffaf0] text-[#174d45] shadow-sm" aria-label="تقليل الكمية" data-testid={`button-decrease-cart-${item.id}`}><Minus size={14} /></button>
                    </div>
                  </div>
                </div>;
              })}
            </div>
          )}
        </div>
        {cart.length > 0 && <footer className="border-t border-[#ded2b5] bg-[#f7efd9] px-5 py-5">
          <div className="flex items-center justify-between text-sm font-bold text-[#70877f]"><span>المجموع الفرعي</span><strong className="text-lg text-[#174d45]" data-testid="text-cart-subtotal">{formatPrice(subtotal)}</strong></div>
          {inquiryCount > 0 && <p className="mt-2 text-xs font-semibold leading-5 text-[#b8543d]">يوجد {money.format(inquiryCount)} منتج بسعر عند الطلب — نؤكده لك عبر واتساب.</p>}
          <button onClick={onCheckout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#174d45] py-3.5 text-sm font-extrabold text-[#fffaf0] shadow-[0_5px_0_#0d302b] transition-all hover:-translate-y-0.5 active:translate-y-1 active:shadow-none" data-testid="button-checkout-whatsapp"><MessageCircle size={19} /> إتمام الطلب عبر واتساب</button>
          <p className="mt-3 text-center text-[.68rem] font-semibold text-[#8b9481]">ستُفتح رسالة جاهزة بالتفاصيل على 01100808082</p>
        </footer>}
      </aside>
    </div>
  );
}

export default App;