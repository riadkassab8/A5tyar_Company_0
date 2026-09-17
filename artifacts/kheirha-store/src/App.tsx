import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Router as WouterRouter, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { CartItem, Category, Product, Variant } from '@/types/store';
import { categories } from '@/types/store';
import { displayPrice, formatPrice, productData, WHATSAPP_URL } from '@/data/products';
import { confirmRemoveFromCart, showCheckoutSuccess, showWarningAlert } from '@/lib/alerts';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppCheckoutModal } from '@/components/cart/WhatsAppCheckoutModal';
import { LoadingScreen } from '@/components/LoadingScreen';

import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { AboutPage } from '@/pages/AboutPage';

export function App() {
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

export default App;

function Storefront() {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('الكل');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = '';
    }, 1000);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  const filteredProducts = useMemo(() => productData.filter((product) => {
    const inCategory = activeCategory === 'الكل' || product.category === activeCategory;
    const searchMatch = `${product.name} ${product.variants.map((variant) => variant.size).join(' ')}`.includes(search.trim());
    return inCategory && searchMatch;
  }), [activeCategory, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (displayPrice(item) ?? 0) * item.quantity, 0);

  const addToCart = (product: Product, variant: Variant, qty: number = 1) => {
    const cartItemId = `${product.id}:${variant.id}`;
    setCart((current) => {
      const found = current.find((item) => item.id === cartItemId);
      return found
        ? current.map((item) => item.id === cartItemId ? { ...item, quantity: item.quantity + qty } : item)
        : [...current, {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          size: variant.size,
          price: variant.price,
          discountEligible: variant.discountEligible,
          quantity: qty,
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
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="initial-app-loading"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 w-screen h-screen z-[99999999] bg-[#F7F4EA] overflow-hidden"
        >
          <LoadingScreen />
        </motion.div>
      ) : (
        <motion.div
          key="app-main-storefront"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#7B694D] pb-16 md:pb-0 font-sans relative"
        >
          {/* Header Layout Component */}
          <Header
            location={location}
            setLocation={setLocation}
            cartCount={cartCount}
            onOpenCart={() => setCartOpen(true)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          {/* Router View Switcher */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              className="flex-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {selectedProduct ? (
                <ProductDetailsPage
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
                  cart={cart}
                  onOpenProduct={(p) => setLocation(`/products/${p.id}`)}
                  onAdd={addToCart}
                  onUpdateQuantity={updateQuantity}
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

          {/* Footer Layout Component */}
          <Footer setLocation={setLocation} />

          {/* Mobile Navigation Bar */}
          <MobileNav
            location={location}
            setLocation={setLocation}
            cartCount={cartCount}
            onOpenCart={() => setCartOpen(true)}
          />

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

          {/* WhatsApp Checkout Modal */}
          {checkoutOpen && (
            <WhatsAppCheckoutModal
              cart={cart}
              subtotal={subtotal}
              onClose={() => setCheckoutOpen(false)}
              onConfirmOrder={triggerWhatsAppOrder}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}