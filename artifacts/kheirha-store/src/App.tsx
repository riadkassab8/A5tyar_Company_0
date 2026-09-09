import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Droplets,
  FileText,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Wheat,
  X,
  MessageCircle,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Router as WouterRouter, useLocation } from 'wouter';
import pantryReference from '@assets/WhatsApp_Image_2026-09-09_at_7.28.33_PM_1788972019491.jpeg';
import honeyReference from '@assets/image_1788972021911.png';

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

const WHATSAPP_URL = 'https://wa.me/201098277229';
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

function Storefront() {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('الكل');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
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
      'مرحباً خيرها، أريد تأكيد هذا الطلب:',
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

      <header className="store-shell relative z-20 flex items-center justify-between gap-4 py-5" data-testid="header-store">
          <a href="/" className="flex items-center gap-3" data-testid="link-brand">
          <span className="grid h-12 w-12 place-items-center rounded-[1.25rem] bg-[#f4c842] text-[#174d45] shadow-[4px_4px_0_#174d45]">
            <ShoppingBag size={25} strokeWidth={2.4} />
          </span>
          <span>
            <span className="font-display block text-[1.35rem] font-extrabold leading-none text-[#174d45]">خيرها</span>
            <span className="mt-1 block text-[.67rem] font-bold tracking-[.13em] text-[#997840]">مونة البيت المصرية</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-bold text-[#315e56] md:flex" aria-label="التنقل الرئيسي">
           <a href="/products" className="transition-colors hover:text-[#b8543d]" data-testid="link-products">المنتجات</a>
          <a href="#our-story" className="transition-colors hover:text-[#b8543d]" data-testid="link-story">عن خيرها</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-[#b8543d]" data-testid="link-whatsapp">
            <MessageCircle size={17} />
            01098277229
          </a>
        </nav>
        <button onClick={() => setCartOpen(true)} className="relative flex h-11 items-center gap-2 rounded-full border border-[#d9c99d] bg-[#fffaf0] px-4 text-sm font-extrabold text-[#174d45] shadow-sm transition-transform hover:-translate-y-0.5" aria-label="فتح سلة المشتريات" data-testid="button-open-cart">
          <ShoppingBag size={19} />
          <span className="hidden sm:inline">السلة</span>
          {cartCount > 0 && <span className="grid min-h-6 min-w-6 place-items-center rounded-full bg-[#b8543d] px-1 text-xs text-[#fffaf0]" data-testid="text-cart-count">{money.format(cartCount)}</span>}
        </button>
      </header>

      <section id="top" className="store-shell grid gap-8 pb-12 pt-5 lg:grid-cols-[1.04fr_.96fr] lg:items-center lg:gap-12 lg:pb-20 lg:pt-12" aria-labelledby="hero-title">
        <div className="animate-float-in">
          <div className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.13em] text-[#b8543d]">
            <span className="h-2 w-2 rounded-full bg-[#b8543d]" />
            من خيرها لبيتك
          </div>
          <h1 id="hero-title" className="font-display max-w-2xl text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold leading-[1.12] tracking-[-.06em] text-[#174d45]">
            مونة البيت،<br /><span className="text-[#b8543d]">على أصولها.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base font-semibold leading-8 text-[#58736d] sm:text-lg">
            أساسيات مختارة بعناية، عسل من خير أرضنا، وطعم يفتكر البيت. اطلب احتياجاتك بسهولة ونجهزها لك عبر واتساب.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={scrollToProducts} className="group flex items-center gap-3 rounded-full bg-[#b8543d] px-6 py-3.5 text-sm font-extrabold text-[#fffaf0] shadow-[0_8px_0_#893e32] transition-all hover:-translate-y-1 hover:shadow-[0_10px_0_#893e32] active:translate-y-1 active:shadow-[0_4px_0_#893e32]" data-testid="button-browse-products">
              تصفح المنتجات
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </button>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-extrabold text-[#174d45] transition-colors hover:bg-[#eaddbb]" data-testid="link-hero-whatsapp">
              <MessageCircle size={19} />
              كلمنا على واتساب
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 border-t border-[#ded2b5] pt-5 text-xs font-bold text-[#70877f]">
            <span className="flex items-center gap-2"><Check size={15} className="text-[#b8543d]" /> أسعار واضحة</span>
            <span className="flex items-center gap-2"><Check size={15} className="text-[#b8543d]" /> طلب مباشر</span>
          </div>
        </div>
        <div className="relative min-h-[350px] animate-float-in delay-2 lg:min-h-[500px]">
          <div className="absolute -left-3 top-6 z-10 w-36 -rotate-6 overflow-hidden rounded-xl border-[6px] border-[#fffaf0] bg-[#fffaf0] shadow-[0_20px_30px_-15px_#174d4566] sm:w-48 lg:left-2 lg:top-10">
            <img src={honeyReference} alt="قائمة أسعار منتجات العسل والألبان من خيرها" className="h-56 w-full object-cover object-left sm:h-72 lg:h-80" data-testid="img-honey-reference" />
            <span className="block bg-[#174d45] px-2 py-2 text-center text-[.62rem] font-bold text-[#f9dc77]">قائمة خيرها</span>
          </div>
          <div className="absolute right-1 top-0 h-[75%] w-[75%] rounded-[45%_45%_22%_22%] bg-[#d99a4e] opacity-25 blur-2xl" />
          <div className="grain absolute right-3 top-8 flex h-[88%] w-[78%] items-end justify-center overflow-hidden rounded-[46%_46%_18%_18%] bg-[#f4c842] shadow-[18px_24px_0_#174d45] sm:right-8">
            <div className="absolute inset-x-10 top-8 h-16 rounded-full border-2 border-dashed border-[#fff3b1] opacity-70" />
            <div className="absolute bottom-24 h-44 w-44 rounded-full border-[18px] border-[#fff6c7]/60" />
            <div className="relative z-10 mb-12 rotate-[-5deg] rounded-2xl border-4 border-[#174d45] bg-[#fffaf0] px-6 py-7 text-center shadow-[8px_8px_0_#b8543d] sm:px-10">
              <span className="block text-[.7rem] font-extrabold tracking-[.2em] text-[#b8543d]">خيرها</span>
              <span className="font-display mt-2 block text-3xl font-extrabold text-[#174d45]">عسل نحل</span>
              <span className="mt-2 block text-xs font-bold text-[#997840]">من خير الطبيعة</span>
            </div>
          </div>
          <div className="absolute bottom-1 right-0 z-20 flex rotate-3 items-center gap-3 rounded-2xl bg-[#174d45] px-4 py-3 text-[#fffaf0] shadow-xl sm:right-8">
            <Droplets size={22} className="text-[#f4c842]" />
            <span className="text-xs font-bold leading-5">طعم يفتكر<br />البيت</span>
          </div>
        </div>
      </section>

      <section className="bg-[#174d45] py-5 text-[#fffaf0]" aria-label="مميزات خيرها">
        <div className="store-shell grid gap-4 text-sm font-bold sm:grid-cols-3">
          <div className="flex items-center gap-3"><PackageCheck className="text-[#f4c842]" size={21} /><span>مونة مختارة للبيت</span></div>
          <div className="flex items-center gap-3"><Wheat className="text-[#f4c842]" size={21} /><span>قائمة أسعار واضحة ومحدثة</span></div>
          <div className="flex items-center gap-3"><MessageCircle className="text-[#f4c842]" size={21} /><span>اطلب مباشرة على واتساب</span></div>
        </div>
      </section>

      <section className="store-shell pt-10 pb-14 lg:pt-14 lg:pb-20">
        <div className="grain relative overflow-hidden rounded-[2rem] bg-[#b8543d] px-6 py-10 text-[#fffaf0] shadow-[10px_10px_0_#f4c842] sm:px-12 sm:py-12 lg:flex lg:items-center lg:justify-between">
          <div className="relative z-10 max-w-xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-extrabold tracking-[.12em] text-[#f9dc77]"><Clock3 size={15} /> عرض لفترة محدودة</div>
            <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">حلاوة العسل تزيد،<br />وسعرها يقل 5 جنيه.</h2>
            <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-[#ffe5cf]">الخصم مطبق على منتجات عسل النحل فقط. السعر الأصلي ظاهر لك جنب السعر بعد الخصم.</p>
          </div>
          <div className="relative z-10 mt-8 flex items-end gap-3 lg:mt-0" aria-hidden="true">
            <div className="h-28 w-20 rotate-[-8deg] rounded-t-2xl border-4 border-[#174d45] bg-[#f4c842] shadow-[6px_6px_0_#174d45]"><div className="mt-9 border-y-2 border-[#174d45] py-1 text-center text-[.55rem] font-extrabold text-[#174d45]">عسل</div></div>
            <div className="h-40 w-28 rotate-[6deg] rounded-t-3xl border-4 border-[#174d45] bg-[#f7e8b5] shadow-[6px_6px_0_#174d45]"><div className="mt-14 border-y-2 border-[#174d45] py-2 text-center text-xs font-extrabold text-[#174d45]">خيرها</div></div>
            <div className="absolute -right-5 -top-5 grid h-16 w-16 rotate-12 place-items-center rounded-full border-4 border-[#174d45] bg-[#f4c842] text-center text-[.65rem] font-extrabold leading-4 text-[#174d45]">خصم<br />٥ ج</div>
          </div>
        </div>
      </section>

      <section id="our-story" className="border-y border-[#ded2b5] bg-[#efe4c6]/60 py-14 lg:py-20">
        <div className="store-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rotate-3 rounded-[2rem] border-2 border-[#b8543d]/30" />
            <img src={pantryReference} alt="قائمة أسعار أساسيات البيت من خيرها" className="relative h-80 w-full rounded-[1.5rem] object-cover object-top shadow-[8px_8px_0_#174d45] sm:h-96" data-testid="img-pantry-reference" />
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-[#f4c842] px-4 py-3 text-xs font-extrabold text-[#174d45] shadow-md">قائمة الأسعار الأصلية</div>
          </div>
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-extrabold tracking-[.14em] text-[#b8543d]"><FileText size={16} /> من قائمتنا إلى سلتك</div>
            <h2 className="font-display max-w-xl text-3xl font-extrabold leading-[1.45] text-[#174d45] sm:text-4xl">خيرها، لأن المونة الحلوة تبدأ من <span className="text-[#b8543d]">اختيار صح.</span></h2>
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
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4c842] text-[#174d45]"><ShoppingBag size={20} /></span><span className="font-display text-2xl font-extrabold">خيرها</span></div>
            <p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-[#bad0c5]">مونة البيت المصرية، بشكل أسهل وأقرب.</p>
          </div>
          <div className="flex flex-col items-start gap-3 text-sm font-bold sm:items-end">
            <span className="text-[#f9dc77]">للطلب والاستفسار</span>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-lg transition-colors hover:text-[#f4c842]" data-testid="link-footer-whatsapp"><MessageCircle size={19} /> 01098277229</a>
          </div>
        </div>
        <div className="store-shell mt-8 border-t border-[#4d776e] pt-5 text-xs font-semibold text-[#9bb9ae]">© خيرها — أسعار ومنتجات البيت بعناية.</div>
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
  return (
    <main className="min-h-[100dvh] overflow-x-hidden">
      {selectedProduct ? (
        <ProductDetails product={selectedProduct} addedId={addedId} cartCount={cartCount} onBack={onBack} onAdd={onAdd} onOpenCart={onOpenCart} />
      ) : (
        <>
          <div className="bg-[#174d45] px-4 py-2 text-center text-xs font-bold tracking-wide text-[#f9dc77]" data-testid="promo-strip-products">
            خصم 5 جنيه على منتجات عسل النحل لفترة محدودة
          </div>
          <header className="store-shell flex items-center justify-between gap-4 py-5" data-testid="header-products-page">
            <a href="/" className="flex items-center gap-3" data-testid="link-products-brand">
              <span className="grid h-12 w-12 place-items-center rounded-[1.25rem] bg-[#f4c842] text-[#174d45] shadow-[4px_4px_0_#174d45]"><ShoppingBag size={25} strokeWidth={2.4} /></span>
              <span><span className="font-display block text-[1.35rem] font-extrabold leading-none text-[#174d45]">خيرها</span><span className="mt-1 block text-[.67rem] font-bold tracking-[.13em] text-[#997840]">مونة البيت المصرية</span></span>
            </a>
            <div className="flex items-center gap-3">
              <a href="/" className="hidden text-sm font-extrabold text-[#537169] transition-colors hover:text-[#b8543d] sm:block">الرئيسية</a>
              <button type="button" onClick={onOpenCart} className="relative flex h-11 items-center gap-2 rounded-full border border-[#d9c99d] bg-[#fffaf0] px-4 text-sm font-extrabold text-[#174d45] shadow-sm transition-transform hover:-translate-y-0.5" aria-label="فتح سلة المشتريات" data-testid="button-open-products-cart">
                <ShoppingBag size={19} /><span className="hidden sm:inline">السلة</span>{cartCount > 0 && <span className="grid min-h-6 min-w-6 place-items-center rounded-full bg-[#b8543d] px-1 text-xs text-[#fffaf0]">{money.format(cartCount)}</span>}
              </button>
            </div>
          </header>
          <section id="products" className="store-shell scroll-mt-4 pb-14 pt-7 lg:pb-20 lg:pt-12" aria-labelledby="products-title">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-extrabold tracking-[.14em] text-[#b8543d]"><span className="h-px w-8 bg-[#b8543d]" /> اختار اللي ناقصك</div>
                <h1 id="products-title" className="font-display text-4xl font-extrabold text-[#174d45] sm:text-5xl">كل منتجات خيرها</h1>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-7 text-[#70877f]">كل منتج في بطاقة واحدة، اختار الحجم من صفحة التفاصيل وأضفه للسلة بسهولة.</p>
              </div>
              <label className="flex w-full items-center gap-2 rounded-full border border-[#d9c99d] bg-[#fffaf0] px-4 py-3 text-sm text-[#70877f] shadow-sm md:max-w-xs">
                <Search size={18} aria-hidden="true" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن منتج..." className="w-full bg-transparent font-semibold outline-none placeholder:text-[#a5aa9d]" aria-label="البحث في المنتجات" data-testid="input-product-search" />
              </label>
            </div>
            <div className="no-scrollbar mb-9 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="أقسام المنتجات">
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
              <div className="relative z-10 mt-8 flex items-end gap-3 lg:mt-0" aria-hidden="true"><div className="h-28 w-20 rotate-[-8deg] rounded-t-2xl border-4 border-[#174d45] bg-[#f4c842] shadow-[6px_6px_0_#174d45]"><div className="mt-9 border-y-2 border-[#174d45] py-1 text-center text-[.55rem] font-extrabold text-[#174d45]">عسل</div></div><div className="h-40 w-28 rotate-[6deg] rounded-t-3xl border-4 border-[#174d45] bg-[#f7e8b5] shadow-[6px_6px_0_#174d45]"><div className="mt-14 border-y-2 border-[#174d45] py-2 text-center text-xs font-extrabold text-[#174d45]">خيرها</div></div><div className="absolute -right-5 -top-5 grid h-16 w-16 rotate-12 place-items-center rounded-full border-4 border-[#174d45] bg-[#f4c842] text-center text-[.65rem] font-extrabold leading-4 text-[#174d45]">خصم<br />٥ ج</div></div>
            </div>
          </section>
          <footer className="bg-[#174d45] py-10 text-[#fffaf0]" data-testid="footer-products">
            <div className="store-shell flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4c842] text-[#174d45]"><ShoppingBag size={20} /></span><span className="font-display text-2xl font-extrabold">خيرها</span></div><p className="mt-3 max-w-xs text-sm font-semibold leading-6 text-[#bad0c5]">مونة البيت المصرية، بشكل أسهل وأقرب.</p></div><div className="flex flex-col items-start gap-3 text-sm font-bold sm:items-end"><span className="text-[#f9dc77]">للطلب والاستفسار</span><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-lg transition-colors hover:text-[#f4c842]"><MessageCircle size={19} /> 01098277229</a></div></div>
            <div className="store-shell mt-8 border-t border-[#4d776e] pt-5 text-xs font-semibold text-[#9bb9ae]">© خيرها — أسعار ومنتجات البيت بعناية.</div>
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
      <header className="store-shell flex items-center justify-between gap-4 py-5">
        <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-full border border-[#d9c99d] bg-[#fffaf0] px-4 py-2.5 text-sm font-extrabold text-[#174d45] shadow-sm transition-transform hover:-translate-y-0.5" aria-label="العودة إلى المنتجات">
          <ChevronRight size={18} /> كل المنتجات
        </button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onOpenCart} className="relative flex h-11 items-center gap-2 rounded-full border border-[#d9c99d] bg-[#fffaf0] px-3 text-sm font-extrabold text-[#174d45] shadow-sm transition-transform hover:-translate-y-0.5" aria-label="فتح سلة المشتريات" data-testid="button-open-cart-details">
            <ShoppingBag size={18} /><span className="hidden sm:inline">السلة</span>{cartCount > 0 && <span className="grid min-h-6 min-w-6 place-items-center rounded-full bg-[#b8543d] px-1 text-xs text-[#fffaf0]">{money.format(cartCount)}</span>}
          </button>
          <span className="grid h-11 w-11 place-items-center rounded-[1.1rem] bg-[#f4c842] text-[#174d45] shadow-[4px_4px_0_#174d45]"><ShoppingBag size={22} /></span>
          <span className="hidden sm:block"><span className="font-display block text-[1.2rem] font-extrabold leading-none text-[#174d45]">خيرها</span><span className="mt-1 block text-[.62rem] font-bold tracking-[.13em] text-[#997840]">مونة البيت المصرية</span></span>
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
            <div className="mt-7 rounded-2xl border border-[#ded2b5] bg-[#efe4c6]/60 p-4 text-sm font-semibold leading-7 text-[#58736d]">بعد اختيار الحجم والكمية، افتح السلة لإرسال طلبك كاملًا برسالة جاهزة إلى واتساب: <strong className="text-[#174d45]">01098277229</strong></div>
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
          <div><p className="text-xs font-bold text-[#b8543d]">طلبك الحالي</p><h2 id="cart-title" className="font-display mt-1 text-2xl font-extrabold text-[#174d45]">سلة خيرها</h2></div>
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
          <p className="mt-3 text-center text-[.68rem] font-semibold text-[#8b9481]">ستُفتح رسالة جاهزة بالتفاصيل على 01098277229</p>
        </footer>}
      </aside>
    </div>
  );
}

export default App;