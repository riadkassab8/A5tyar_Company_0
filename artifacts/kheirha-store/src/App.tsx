import { useMemo, useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
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
  Sparkles,
  Trash2,
  Wheat,
  X,
  MessageCircle,
  Home,
  Menu,
  Grid,
  User,
  ShieldCheck,
  Truck,
  Leaf,
  Tag,
  Star,
  Award,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Router as WouterRouter, useLocation } from 'wouter';
import { Hero3DBackground } from '@/components/Hero3DScene';
import {
  showAddToCartToast,
  confirmRemoveFromCart,
  showCheckoutSuccess,
  showWarningAlert,
} from '@/lib/alerts';

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
  imageUrl: string;
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
type ProductSeed = Omit<Product, 'accent' | 'icon' | 'imageUrl'>;

const WHATSAPP_URL = 'https://wa.me/201100808082';
const money = new Intl.NumberFormat('ar-EG');
const categories = ['الكل', 'عسل النحل', 'منتجات الألبان', 'منتجات السمسم', 'أساسيات البيت', 'المربيات'] as const;

// Product Photography Map — all local images live in /products/ folder
const PRODUCT_IMAGES: Record<string, string> = {
  // ── عسل النحل (صور مرفوعة من المستخدم) ──────────────────────────────
  'عسل نحل طبيعي':        '/products/honey.jpeg',
  'عسل نحل نوارة برسيم':  '/products/honey.jpeg',
  'عسل نحل زهرة موالح':   '/products/%D8%B9%D8%B3%D9%84%20%D9%86%D8%AD%D9%84%20%D8%B2%D9%87%D8%B1%D9%87%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%84%D8%AD.jpg',
  'عسل نحل حبة البركة':   '/products/%D8%B9%D8%B3%D9%84%20%D9%86%D8%AD%D9%84%20%D8%AD%D8%A8%D8%A9%20%D8%A7%D9%84%D8%A8%D8%B1%D9%83%D8%A9.jpg',
  'عسل نحل سدر جبلي':     '/products/%D8%B9%D8%B3%D9%84%20%D9%86%D8%AD%D9%84%20%D8%B3%D8%AF%D8%B1%20%D8%AC%D8%A8%D9%84%D9%8A.jpg',
  'شمع عسل صافي':         '/products/%D8%B4%D9%85%D8%B9%20%D8%B9%D8%B3%D9%84%20%D8%B5%D8%A7%D9%81%D9%8A.webp',
  'عسل أسود فاخر':        '/products/%D8%B9%D8%B3%D9%84%20%D8%A7%D8%B3%D9%88%D8%AF%20%D9%81%D8%A7%D8%AE%D8%B1.jpeg',

  // ── منتجات السمسم (صور مُنشأة) ──────────────────────────────────────
  'طحينة سمسم صافي':      '/products/tahini.png',
  'حلاوة بلدي سادة':      '/products/halawa.png',
  'حلاوة بلدي فستق':      '/products/halawa-pistachio.png',

  // ── منتجات الألبان (صور مُنشأة) ─────────────────────────────────────
  'زبد بقري طبيعي':       '/products/butter.png',
  'زبد جاموسي طبيعي':     '/products/butter.png',
  'سمن بقري بلدي':        '/products/ghee.png',
  'سمن جاموسي بلدي':      '/products/ghee.png',

  // ── أساسيات البيت (صور مُنشأة + Unsplash موحدة) ─────────────────────
  'ارز ابيض عريض الحبة':  '/products/rice.png',
  'ارز ابيض رفيع الحبة':  '/products/rice.png',
  'سكر نقي':              '/products/sugar.png',
  'دقيق فاخر':            '/products/flour.png',
  'زيت زيتون بكر':        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop',
  'زيت نقي':              'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop',
  // صور محلية مرفوعة للبقوليات والمخلل
  'عدس اصفر':             '/products/%D8%B9%D8%AF%D8%B3%20%D8%A7%D8%B5%D9%81%D8%B1.jpg',
  'فول بلدي':             '/products/%D9%81%D9%88%D9%84%20%D8%A8%D9%84%D8%AF%D9%8A.jpg',
  'عدس بجبة':             '/products/%D8%B9%D8%AF%D8%B3%20%D8%A8%D8%AC%D8%A8%D9%87.jpg',
  'لوبيا بلدي':           '/products/%D9%84%D9%88%D8%A8%D9%8A%D8%A7%20%D8%A8%D9%84%D8%AF%D9%8A.jpg',
  'فاصوليا بيضاء':        '/products/%D9%81%D8%A7%D8%B5%D9%88%D9%84%D9%8A%D8%A7%20%D8%A8%D9%8A%D8%B6%D8%A7%D8%A1.jpg',
  'مخلل خيار بلدي':       '/products/%D9%85%D8%AE%D9%84%D9%84%20%D8%AE%D9%8A%D8%A7%D8%B1%20%D8%A8%D9%84%D8%AF%D9%8A.jpg',

  // ── المربيات (صور محلية مرفوعة) ───────────────────────────────────────
  'مربى فراولة قطع':      '/products/%D9%85%D8%B1%D8%A8%D9%89%20%D9%81%D8%B1%D8%A7%D9%88%D9%84%D8%A9%20%D9%82%D8%B7%D8%B9.jpg',
  'مربى تين سبيريد':      '/products/%D9%85%D8%B1%D8%A8%D9%89%20%D8%AA%D9%8A%D9%86%20%D8%B3%D8%A8%D9%8A%D8%B1%D9%8A%D8%AF.jpg',
  'مربى جزر بلدي':        '/products/%D9%85%D8%B1%D8%A8%D9%89%20%D8%AC%D8%B2%D8%B1%20%D8%A8%D9%84%D8%AF%D9%8A.jpg',
  'مربى بلح فاخر':        '/products/%D9%85%D8%B1%D8%A8%D9%89%20%D8%A8%D9%84%D8%AD%20%D9%81%D8%A7%D8%AE%D8%B1.jpg',
};

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
  ['ارز ابيض عريض الحبة', '١ كيلو', 31], ['سكر نقي', '١ كيلو', 25], ['دقيق فاخر', '١ كيلو', 21],
  ['ارز ابيض رفيع الحبة', '١ كيلو', 26], ['زيت زيتون بكر', '١ لتر', 180], ['زيت نقي', '١ لتر', 70],
  ['عدس اصفر', '١ كجم', 28], ['فول بلدي', '½ كيلو', 25], ['عدس بجبة', '½ كيلو', 23],
  ['لوبيا بلدي', '½ كيلو', 28], ['فاصوليا بيضاء', '½ كيلو', 30], ['مخلل خيار بلدي', '١ كجم', 32],
] as CatalogRow[], 'أساسيات البيت', 'pantry');

const honey = groupRows([
  ['عسل نحل طبيعي', '٥٠٠ جرام', 150], ['عسل نحل نوارة برسيم', '١ كجم', 145],
  ['عسل نحل زهرة موالح', '٥٠٠ جرام', 100], ['عسل نحل زهرة موالح', '١ كجم', 190],
  ['عسل نحل حبة البركة', '٥٠٠ جرام', 95], ['عسل نحل سدر جبلي', '١ كجم', 380],
  ['شمع عسل صافي', '٥٠٠ جرام', 125], ['عسل أسود فاخر', '١ كجم', 65],
] as CatalogRow[], 'عسل النحل', 'honey', (name) => name.startsWith('عسل نحل') || name === 'شمع عسل');

const dairy = groupRows([
  ['زبد بقري طبيعي', '١ كجم', 320], ['زبد جاموسي طبيعي', '١ كجم', 340],
  ['سمن بقري بلدي', '١ كجم', 380], ['سمن جاموسي بلدي', '١ كجم', 410],
] as CatalogRow[], 'منتجات الألبان', 'dairy');

const sesame = groupRows([
  ['طحينة سمسم صافي', '٨٠٠ جرام', 45], ['حلاوة بلدي سادة', '٥٥٠ جرام', 150], ['حلاوة بلدي فستق', '٥٥٠ جرام', 150],
] as CatalogRow[], 'منتجات السمسم', 'sesame');

const jams = groupRows([
  ['مربى فراولة قطع', '١ كجم', null], ['مربى تين سبيريد', '١ كجم', null], ['مربى جزر بلدي', '١ كجم', null],
  ['مربى بلح فاخر', '١ كجم', null],
] as CatalogRow[], 'المربيات', 'jams');

const productData: Product[] = [...honey, ...sesame, ...dairy, ...pantry, ...jams].map((product) => ({
  ...product,
  accent: product.category === 'عسل النحل' ? 'honey' : product.category === 'أساسيات البيت' ? 'grain' : product.category === 'منتجات الألبان' ? 'dairy' : product.category === 'منتجات السمسم' ? 'sesame' : 'jam',
  imageUrl: PRODUCT_IMAGES[product.name] || PRODUCT_IMAGES['عسل نحل طبيعي'],
  icon: product.category === 'عسل النحل' ? Droplets : product.category === 'أساسيات البيت' ? Wheat : product.category === 'منتجات الألبان' ? PackageCheck : product.category === 'منتجات السمسم' ? CircleHelp : Heart,
}));

const displayPrice = (variant: Pick<Variant, 'price' | 'discountEligible'>) => variant.price === null ? null : variant.discountEligible ? variant.price - 15 : variant.price;
const formatPrice = (price: number) => `${money.format(price)} جنيه`;

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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => productData.filter((product) => {
    const inCategory = activeCategory === 'الكل' || product.category === activeCategory;
    const searchMatch = `${product.name} ${product.variants.map((variant) => variant.size).join(' ')}`.includes(search.trim());
    return inCategory && searchMatch;
  }), [activeCategory, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (displayPrice(item) ?? 0) * item.quantity, 0);

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
    window.setTimeout(() => setAddedId(null), 1500);
  };

  const updateQuantity = (id: string, amount: number) => setCart((current) => current.flatMap((item) => {
    if (item.id !== id) return [item];
    const quantity = item.quantity + amount;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  }));

  const removeFromCart = async (id: string, productName: string) => {
    const confirmed = await confirmRemoveFromCart(productName);
    if (confirmed) {
      setCart((current) => current.filter((item) => item.id !== id));
    }
  };

  const triggerWhatsAppOrder = () => {
    if (!cart.length) {
      showWarningAlert('السلة فارغة', 'من فضلك أضف بعض المنتجات للسلة قبل إتمام الطلب.');
      return;
    }
    showCheckoutSuccess();
    const lines = cart.map((item) => {
      const price = displayPrice(item);
      return `- ${item.name} (${item.size}) × ${item.quantity}: ${price === null ? 'السعر عند الطلب' : formatPrice(price * item.quantity)}`;
    });
    const summary = [
      'مرحباً أختيار، أريد تأكيد هذا الطلب:',
      ...lines,
      `الإجمالي: ${formatPrice(subtotal)}`,
      '',
      'من فضلكم تواصلوا معي لتأكيد الطلب والتفاصيل.',
    ].join('\n');
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(summary)}`, '_blank', 'noopener,noreferrer');
  };

  const selectedProduct = location.startsWith('/products/') ? productData.find((p) => p.id === location.split('/')[2]) ?? null : null;
  const isProductsView = location === '/products' || location.startsWith('/products/');
  const isAboutView = location === '/about';

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#0B4A3D] pb-16 md:pb-0 font-sans">
      {/* Top Animated Promo Strip */}
      <div className="bg-[#0B4A3D] py-2.5 px-4 text-center text-xs font-extrabold text-[#E3B33C] flex items-center justify-center gap-2 shadow-2xs" data-testid="promo-strip">
        <Sparkles size={14} className="text-[#E3B33C] animate-pulse" />
        <span>خصم 5 جنيه على منتجات عسل النحل - لفترة محدودة</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/92 backdrop-blur-md border-b border-[#E5E2D8] shadow-2xs transition-all duration-300" data-testid="header-store">
        <div className="store-shell flex h-[68px] items-center justify-between">
          {/* Logo — sized to fit the 68px header naturally */}
          <a href="/" className="flex items-center group shrink-0" data-testid="link-brand">
            <img
              src="/logo-dark.png"
              alt="أختيار"
              className="h-[5.5em] w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 font-extrabold text-base lg:text-[1.05rem]">
            <a href="/" onClick={(e) => { e.preventDefault(); setLocation('/'); }} className={`transition-colors ${location === '/' ? 'text-[#0B4A3D] font-black border-b-2 border-[#0B4A3D] pb-1' : 'text-slate-600 hover:text-[#0B4A3D]'}`}>
              الرئيسية
            </a>
            <a href="/products" onClick={(e) => { e.preventDefault(); setLocation('/products'); }} className={`transition-colors ${isProductsView ? 'text-[#0B4A3D] font-black border-b-2 border-[#0B4A3D] pb-1' : 'text-slate-600 hover:text-[#0B4A3D]'}`}>
              المنتجات
            </a>
            <a href="/about" onClick={(e) => { e.preventDefault(); setLocation('/about'); }} className={`transition-colors ${isAboutView ? 'text-[#0B4A3D] font-black border-b-2 border-[#0B4A3D] pb-1' : 'text-slate-600 hover:text-[#0B4A3D]'}`}>
              عن أختيار
            </a>
          </nav>

          {/* Header Left Trigger Icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="uiverse-cart-btn"
              data-testid="button-open-cart"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">سلة المشتريات</span>
              {cartCount > 0 && (
                <span className="cart-badge grid min-h-5 min-w-5 place-items-center rounded-full px-1.5 shadow-sm">
                  {money.format(cartCount)}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#E5E2D8] bg-white text-[#0B4A3D] md:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Router with Framer Motion transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {selectedProduct ? (
            <ProductDetailsScreen
              product={selectedProduct}
              addedId={addedId}
              onBack={() => setLocation('/products')}
              onAdd={addToCart}
              onOpenCart={() => setCartOpen(true)}
            />
          ) : isProductsView ? (
            <CatalogPage
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              search={search}
              setSearch={setSearch}
              filteredProducts={filteredProducts}
              onOpenProduct={(p) => setLocation(`/products/${p.id}`)}
              onAdd={addToCart}
              addedId={addedId}
            />
          ) : isAboutView ? (
            <AboutPage />
          ) : (
            <HomePage
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setLocation('/products');
              }}
              onBrowse={() => setLocation('/products')}
              filteredProducts={filteredProducts}
              onOpenProduct={(p) => setLocation(`/products/${p.id}`)}
              onAdd={addToCart}
              addedId={addedId}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#0B4A3D] text-white pt-16 pb-24 md:pb-16 border-t border-[#07382e]" data-testid="footer-store">
        <div className="store-shell grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#0B4A3D]">
                <Leaf size={22} fill="#0B4A3D" stroke="none" />
              </div>
              <span className="font-display text-3xl font-black">أختيار</span>
            </div>
            <p className="text-xs text-[#C2DFDB] leading-relaxed max-w-xs font-light">
              منتجات غذائية طبيعية مختارة بعناية من أفضل المزارع في قلب مصر.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#E3B33C] mb-4">روابط سريعة</h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#E2F1EF] font-semibold">
              <a href="/" onClick={(e) => { e.preventDefault(); setLocation('/'); }} className="hover:underline">الرئيسية</a>
              <a href="/products" onClick={(e) => { e.preventDefault(); setLocation('/products'); }} className="hover:underline">المنتجات</a>
              <a href="/about" onClick={(e) => { e.preventDefault(); setLocation('/about'); }} className="hover:underline">عن أختيار</a>
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#E3B33C] mb-4">تواصل معنا</h4>
            <p className="text-xs text-[#E2F1EF] mb-3">متاح من 9 صباحاً حتى 10 مساءً</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 font-black text-base text-white hover:text-[#E3B33C] transition-colors">
              <MessageCircle size={20} className="text-[#25D366]" /> 01100808082
            </a>
          </div>
        </div>
        <div className="store-shell mt-12 border-t border-[#07382e] pt-6 text-center text-xs text-[#93C4BD]">
          © 2026 أختيار — جميع الحقوق محفوظة
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E2D8] py-2.5 px-4 flex items-center justify-around md:hidden shadow-lg">
        <button onClick={() => setLocation('/')} className={`flex flex-col items-center gap-1 text-[0.68rem] font-bold ${location === '/' ? 'text-[#0B4A3D]' : 'text-slate-500'}`}>
          <Home size={20} />
          <span>الرئيسية</span>
        </button>
        <button onClick={() => setLocation('/products')} className={`flex flex-col items-center gap-1 text-[0.68rem] font-bold ${isProductsView ? 'text-[#0B4A3D]' : 'text-slate-500'}`}>
          <Grid size={20} />
          <span>المنتجات</span>
        </button>
        <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center gap-1 text-[0.68rem] font-bold text-slate-500">
          <ShoppingBag size={20} />
          <span>السلة</span>
          {cartCount > 0 && <span className="absolute -top-1 right-2 grid h-4.5 w-4.5 place-items-center rounded-full bg-[#E3B33C] text-[0.58rem] font-black text-[#0B4A3D]">{money.format(cartCount)}</span>}
        </button>
        <a href="#our-story" className="flex flex-col items-center gap-1 text-[0.68rem] font-bold text-slate-500">
          <User size={20} />
          <span>عن أختيار</span>
        </a>
      </nav>

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          subtotal={subtotal}
          onClose={() => setCartOpen(false)}
          onUpdate={updateQuantity}
          onRemove={removeFromCart}
          onProceedToCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />
      )}

      {/* WhatsApp Checkout Screen Modal */}
      {checkoutOpen && (
        <WhatsAppCheckoutModal
          cart={cart}
          subtotal={subtotal}
          onClose={() => setCheckoutOpen(false)}
          onConfirmOrder={triggerWhatsAppOrder}
        />
      )}
    </div>
  );
}

/* 2026 Home Page Component with Massive Bold Typography & Bento Grid Layout */
function HomePage({ onSelectCategory, onBrowse, filteredProducts, onOpenProduct, onAdd, addedId }: {
  onSelectCategory: (cat: Category) => void;
  onBrowse: () => void;
  filteredProducts: Product[];
  onOpenProduct: (p: Product) => void;
  onAdd: (p: Product, v: Variant) => void;
  addedId?: string | null;
}) {
  const featuredProduct = filteredProducts[0];
  const secondaryProducts = filteredProducts.slice(1, 5);

  return (
    <main className="store-shell py-8 space-y-16">
      {/* 2026 Hero Section: Massive 80px Headlines & Photography Editorial Focus */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#F7F4EA] border border-[#E8E4D9] p-8 sm:p-12 lg:p-16">
        <Hero3DBackground />

        <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E5E2D8] px-4 py-1.5 text-xs font-black text-[#0B4A3D] shadow-2xs">
              <Sparkles size={14} className="text-[#E3B33C]" /> خير مصري أصيل 100%
            </span>

            {/* Massive 2026 Typography (64px - 88px) */}
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

          {/* Hero Product Photography — fills 50% of grid, object-cover */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border border-[#E5E2D8] group">
              <img
                src={featuredProduct?.imageUrl || PRODUCT_IMAGES['عسل نحل طبيعي']}
                alt="منتجات أختيار الطبيعية"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Discount badge — top right */}
              <span className="absolute top-4 right-4 bg-[#E3B33C] text-[#0B4A3D] text-[0.62rem] font-black px-3 py-1 rounded-full shadow-md">
                ⭐ خصم 10%
              </span>
              {/* Product info — bottom overlay */}
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

      {/* Featured Products Section — clean simple grid */}
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

        {/* Clean 4-card grid — consistent with the rest of the store */}
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

      {/* Creative Offers Section — The Bundle Deal */}
      <section className="mt-10 mb-6">
        <div className="relative rounded-[2.5rem] bg-[#0B4A3D] overflow-hidden border border-[#07382e] shadow-2xl group">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E3B33C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#E3B33C 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            
            {/* Text & Offer Details */}
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
                  onClick={() => onSelectCategory('عسل نحل')}
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

            {/* Creative Visual Composition */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative h-64 sm:h-80 lg:h-96 perspective-1000">
              {/* Product 1: Honey Type 1 (Back Left) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                className="absolute left-1/4 lg:left-10 top-10 w-32 sm:w-44 aspect-square rounded-[2rem] bg-white/10 backdrop-blur-md p-2 shadow-2xl border border-white/20 z-10 rotate-[-12deg]"
              >
                <img src={PRODUCT_IMAGES['عسل نحل زهرة موالح']} alt="عسل نحل" className="w-full h-full object-cover rounded-xl" />
              </motion.div>

              {/* Product 2: Honey Type 2 (Back Right) */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-1/4 lg:right-10 top-4 w-28 sm:w-40 aspect-square rounded-[2rem] bg-white/10 backdrop-blur-md p-2 shadow-2xl border border-white/20 z-10 rotate-[8deg]"
              >
                <img src={PRODUCT_IMAGES['عسل نحل سدر جبلي']} alt="عسل سدر" className="w-full h-full object-cover rounded-xl bg-white" />
              </motion.div>

              {/* Product 3: Honey (Front Center) */}
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

/* Catalog Page Component */
function CatalogPage({ activeCategory, setActiveCategory, search, setSearch, filteredProducts, onOpenProduct, onAdd, addedId }: {
  activeCategory: (typeof categories)[number];
  setActiveCategory: (cat: (typeof categories)[number]) => void;
  search: string;
  setSearch: (val: string) => void;
  filteredProducts: Product[];
  onOpenProduct: (p: Product) => void;
  onAdd: (p: Product, v: Variant) => void;
  addedId?: string | null;
}) {
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
            className={`whitespace-nowrap rounded-full px-6 py-3 text-sm sm:text-base font-extrabold transition-all ${activeCategory === category
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

/* 2026 Product Card Component — unified aspect-ratio, skeleton loading, no selection highlight */
function ProductCard({ product, index, addedId, onOpen, onAdd }: { product: Product; index: number; addedId?: string | null; onOpen: () => void; onAdd: (p: Product, v: Variant) => void }) {
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
        {/* Skeleton shimmer shown until image loads */}
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
          {/* bg-transparent + w-full fixes any browser default button highlight */}
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

/* Product Details View */
function ProductDetailsScreen({ product, addedId, onBack, onAdd, onOpenCart }: {
  product: Product;
  addedId: string | null;
  onBack: () => void;
  onAdd: (product: Product, variant: Variant) => void;
  onOpenCart: () => void;
}) {
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
                    className={`rounded-2xl border px-5 py-2.5 text-xs font-bold transition-all ${selectedVariant.id === v.id ? 'border-[#0B4A3D] bg-[#0B4A3D] text-white' : 'border-[#E5E2D8] bg-white text-slate-700'}`}
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

/* Cart Drawer Component with SweetAlert2 integration */
function CartDrawer({ cart, subtotal, onClose, onUpdate, onRemove, onProceedToCheckout }: {
  cart: CartItem[];
  subtotal: number;
  onClose: () => void;
  onUpdate: (id: string, amt: number) => void;
  onRemove: (id: string, name: string) => void;
  onProceedToCheckout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E2D8] px-6 py-5">
          <h3 className="font-display font-black text-xl text-[#0B4A3D]">سلة المشتريات</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag size={40} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-500">سلتك فارغة حالياً</p>
              <button onClick={onClose} className="rounded-full bg-[#0B4A3D] px-6 py-2.5 text-xs font-black text-white">ابدأ التسوق</button>
            </div>
          ) : (
            cart.map((item) => {
              const price = displayPrice(item);
              return (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-[#E5E2D8] bg-[#FAF8F2] p-4 text-xs">
                  <div>
                    <h4 className="font-black text-[#0B4A3D]">{item.name}</h4>
                    <p className="text-[0.68rem] text-slate-500 font-bold mt-0.5">{item.size}</p>
                    <p className="font-black text-[#0B4A3D] mt-1.5">{price === null ? 'السعر عند الطلب' : formatPrice(price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-[#E5E2D8] bg-white p-1">
                      <button onClick={() => onUpdate(item.id, 1)} className="p-1 text-slate-600 hover:text-[#0B4A3D]"><Plus size={14} /></button>
                      <span className="font-black px-1.5 text-sm">{item.quantity}</span>
                      <button onClick={() => onUpdate(item.id, -1)} className="p-1 text-slate-600 hover:text-[#0B4A3D]"><Minus size={14} /></button>
                    </div>
                    <button onClick={() => onRemove(item.id, item.name)} className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[#E5E2D8] p-6 bg-white space-y-4">
            <div className="flex justify-between text-xs font-black text-[#0B4A3D]">
              <span>الإجمالي ({cart.length} منتجات)</span>
              <span className="text-base font-black text-[#0B4A3D]">{formatPrice(subtotal)}</span>
            </div>
            <button
              onClick={onProceedToCheckout}
              className="uiverse-btn-primary w-full py-3.5 text-xs"
            >
              <MessageCircle size={18} /> إتمام الطلب عبر واتساب
            </button>
            <p className="text-[0.68rem] text-center text-slate-500 font-medium">سيتم التواصل معك عبر واتساب لتأكيد الطلب وتفاصيل التوصيل</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* WhatsApp Confirmation Modal (Screen 6 in reference images) */
function WhatsAppCheckoutModal({ cart, subtotal, onClose, onConfirmOrder }: {
  cart: CartItem[];
  subtotal: number;
  onClose: () => void;
  onConfirmOrder: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-[2.5rem] bg-white p-7 shadow-2xl space-y-6 text-center">
        <button onClick={onClose} className="absolute left-5 top-5 text-slate-400 hover:text-slate-600"><X size={22} /></button>

        <div className="grid h-18 w-18 place-items-center rounded-3xl bg-[#E8F8F5] text-[#25D366] mx-auto shadow-xs">
          <MessageCircle size={36} />
        </div>

        <div>
          <h3 className="font-display font-black text-2xl text-[#0B4A3D]">اطلب الآن عبر واتساب</h3>
          <p className="text-xs text-slate-500 font-medium mt-1.5">سيتم إرسال تفاصيل طلبك مباشرة إلى رقم الواتساب الخاص بنا</p>
        </div>

        <button
          onClick={onConfirmOrder}
          className="uiverse-btn-primary w-full py-4 text-sm"
        >
          <MessageCircle size={20} /> فتح واتساب
        </button>

        {/* Order Items Breakdown Box */}
        <div className="rounded-2xl border border-[#E5E2D8] bg-[#FAF8F2] p-5 text-right space-y-3">
          <h4 className="font-black text-xs text-[#0B4A3D] border-b border-[#E5E2D8] pb-2.5">محتوى الطلب</h4>
          <div className="space-y-2.5 max-h-40 overflow-y-auto text-xs">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-slate-700 font-bold">
                <span>{item.name} ({item.size})</span>
                <span className="font-black">{displayPrice(item) === null ? 'السعر عند الطلب' : formatPrice((displayPrice(item) ?? 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[#E5E2D8] flex justify-between font-black text-sm text-[#0B4A3D]">
            <span>الإجمالي:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>

        {/* Perks Bar */}
        <div className="grid grid-cols-3 gap-2 text-center text-[0.68rem] font-extrabold text-[#0B4A3D] pt-2">
          <div className="rounded-xl bg-[#F4F0E6] p-2.5">توصيل سريع</div>
          <div className="rounded-xl bg-[#F4F0E6] p-2.5">دفع عند الاستلام</div>
          <div className="rounded-xl bg-[#F4F0E6] p-2.5">منتجات طبيعية</div>
        </div>
      </div>
    </div>
  );
}

/* About Page (Our Story) Component */
function AboutPage() {
  return (
    <main className="store-shell py-12 space-y-24">
      {/* 1. About Hero */}
      <section className="relative rounded-[3rem] bg-[#0B4A3D] overflow-hidden flex flex-col md:flex-row items-center">
        {/* Background texture/pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#E3B33C 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 w-full md:w-1/2 p-10 sm:p-16 text-center md:text-right">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-black text-[#E3B33C] mb-6 shadow-2xs backdrop-blur-sm">
            <Sparkles size={14} className="text-[#E3B33C]" /> قصة أختيار
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-6">
            من قلب الطبيعة <br />
            <span className="text-[#E3B33C]">إلى مائدتك.</span>
          </h1>
          <p className="text-[#C2DFDB] text-sm sm:text-base font-medium leading-relaxed max-w-md mx-auto md:mx-0">
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

      {/* 2. The Story Timeline */}
      <section className="relative max-w-5xl mx-auto py-10">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-[#E3B33C] tracking-wider">رحلة أختيار</span>
          <h2 className="font-display mt-3 text-3xl sm:text-5xl font-black text-[#0B4A3D] leading-tight">
            كيف نضمن لك <span className="text-[#D9A52E]">الجودة؟</span>
          </h2>
        </div>

        {/* Vertical Line for Desktop */}
        <div className="absolute left-1/2 top-48 bottom-0 w-0.5 bg-gradient-to-b from-[#E5E2D8] via-[#E3B33C] to-transparent hidden md:block -translate-x-1/2 rounded-full"></div>
        {/* Vertical Line for Mobile (Right aligned for RTL) */}
        <div className="absolute right-6 top-40 bottom-0 w-0.5 bg-gradient-to-b from-[#E5E2D8] via-[#E3B33C] to-transparent md:hidden rounded-full"></div>

        <div className="space-y-16 sm:space-y-24 relative z-10">
          
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
            <div className="w-full md:w-1/2 flex justify-end md:text-left pr-12 md:pr-0 relative">
              {/* Mobile Node */}
              <div className="absolute right-[-2.3rem] top-2 w-8 h-8 rounded-full border-4 border-[#FAF8F2] bg-[#E3B33C] shadow-sm md:hidden flex items-center justify-center text-white font-black text-xs">1</div>
              <div className="text-right w-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F4F0E6] text-[#0B4A3D] mb-4">
                  <Wheat size={24} />
                </div>
                <h3 className="font-display text-2xl font-black text-[#0B4A3D] mb-3">
                  مناحلنا الخاصة
                </h3>
                <p className="text-sm text-[#5C726F] font-medium leading-relaxed">
                  سر تميز منتجاتنا، خاصة تشكيلة العسل تحت علامتنا التجارية "Old Days"، يبدأ من مناحلنا الخاصة. نحن نشرف على كل خطوة من خطوات الإنتاج لضمان حصولك على عسل طبيعي 100%، خالي من أي إضافات أو سكر مصنع.
                </p>
              </div>
            </div>
            {/* Desktop Node */}
            <div className="hidden md:flex w-12 h-12 rounded-full border-4 border-[#FAF8F2] bg-[#E3B33C] shadow-sm items-center justify-center text-white font-black shrink-0 relative z-10 mx-auto">1</div>
            <div className="w-full md:w-1/2 pl-12 md:pl-0">
              <div className="aspect-[4/5] w-full rounded-[2rem] bg-transparent flex items-center justify-center transition-all">
                <img src={PRODUCT_IMAGES['شمع عسل صافي']} alt="مناحلنا" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(11,74,61,0.15)] group-hover:scale-105 transition-transform duration-700 rounded-[2rem]" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 group">
            <div className="w-full md:w-1/2 flex justify-start pr-12 md:pr-0 relative">
              {/* Mobile Node */}
              <div className="absolute right-[-2.3rem] top-2 w-8 h-8 rounded-full border-4 border-[#FAF8F2] bg-[#0B4A3D] shadow-sm md:hidden flex items-center justify-center text-[#E3B33C] font-black text-xs">2</div>
              <div className="text-right w-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F4F0E6] text-[#0B4A3D] mb-4">
                  <Heart size={24} />
                </div>
                <h3 className="font-display text-2xl font-black text-[#0B4A3D] mb-3">
                  من خير المزارع المصرية
                </h3>
                <p className="text-sm text-[#5C726F] font-medium leading-relaxed">
                  بالإضافة إلى مناحلنا، نتعاون مع أكثر من 50 مزرعة ومورد محلي من خيرة أهالينا في القرى المصرية، لننتقي أفضل المحاصيل والبقوليات والزيوت التي تلبي معاييرنا الصارمة للجودة والأصالة.
                </p>
              </div>
            </div>
            {/* Desktop Node */}
            <div className="hidden md:flex w-12 h-12 rounded-full border-4 border-[#FAF8F2] bg-[#0B4A3D] shadow-sm items-center justify-center text-[#E3B33C] font-black shrink-0 relative z-10 mx-auto">2</div>
            <div className="w-full md:w-1/2 pr-12 md:pl-0 md:pr-12">
              <div className="aspect-[4/5] w-full rounded-[2rem] bg-transparent flex items-center justify-center transition-all">
                <img src={PRODUCT_IMAGES['طحينة سمسم صافي']} alt="خير المزارع" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(11,74,61,0.15)] group-hover:scale-105 transition-transform duration-700 rounded-[2rem]" />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
            <div className="w-full md:w-1/2 flex justify-end md:text-left pr-12 md:pr-0 relative">
               {/* Mobile Node */}
               <div className="absolute right-[-2.3rem] top-2 w-8 h-8 rounded-full border-4 border-[#FAF8F2] bg-[#E3B33C] shadow-sm md:hidden flex items-center justify-center text-white font-black text-xs">3</div>
              <div className="text-right w-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F4F0E6] text-[#0B4A3D] mb-4">
                  <PackageCheck size={24} />
                </div>
                <h3 className="font-display text-2xl font-black text-[#0B4A3D] mb-3">
                  تعبئة بعناية وتوصيل سريع
                </h3>
                <p className="text-sm text-[#5C726F] font-medium leading-relaxed">
                  نعلم أن الجودة تكتمل بالاهتمام بالتفاصيل. يتم تعبئة منتجاتنا في عبوات صحية ومحكمة، وتصلك إلى باب بيتك بأسرع وقت لضمان حفاظها على طعمها الطازج ورائحتها الأصلية.
                </p>
              </div>
            </div>
            {/* Desktop Node */}
            <div className="hidden md:flex w-12 h-12 rounded-full border-4 border-[#FAF8F2] bg-[#E3B33C] shadow-sm items-center justify-center text-white font-black shrink-0 relative z-10 mx-auto">3</div>
            <div className="w-full md:w-1/2 pl-12 md:pl-0">
              <div className="aspect-[4/5] w-full rounded-[2rem] bg-transparent flex items-center justify-center transition-all">
                <img src={PRODUCT_IMAGES['عسل نحل حبة البركة']} alt="تعبئة وتغليف" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(11,74,61,0.15)] group-hover:scale-105 transition-transform duration-700 rounded-[2rem]" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. The Promise Grid */}
      <section className="bg-[#F7F4EA] rounded-[2.5rem] p-10 sm:p-16 border border-[#E5E2D8]">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-black text-[#0B4A3D]">وعد أختيار لك</h2>
          <p className="text-sm text-slate-500 mt-3">نلتزم بتقديم الأفضل دائماً، بدون تنازلات.</p>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E5E2D8] text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F8F5] flex items-center justify-center text-[#0B4A3D] mb-5">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-bold text-lg text-[#0B4A3D] mb-2">طبيعي 100%</h3>
            <p className="text-xs text-slate-500 font-medium">كل منتجاتنا خالية تماماً من المواد الحافظة والألوان الصناعية.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-[#E5E2D8] text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706] mb-5">
              <Heart size={28} />
            </div>
            <h3 className="font-bold text-lg text-[#0B4A3D] mb-2">صنع بحب</h3>
            <p className="text-xs text-slate-500 font-medium">نعبئ كل عبوة بعناية فائقة لنحافظ على الطعم الطازج والأصيل.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-[#E5E2D8] text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F3F4F6] flex items-center justify-center text-slate-700 mb-5">
              <Truck size={28} />
            </div>
            <h3 className="font-bold text-lg text-[#0B4A3D] mb-2">من المزرعة لبابك</h3>
            <p className="text-xs text-slate-500 font-medium">نختصر المسافات لنضمن وصول المنتجات بأعلى جودة ممكنة.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;