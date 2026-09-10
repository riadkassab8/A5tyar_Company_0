import { Menu, ShoppingBag } from 'lucide-react';
import { money } from '@/data/products';

interface HeaderProps {
  location: string;
  setLocation: (loc: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMobileMenu: () => void;
}

export function Header({
  location,
  setLocation,
  cartCount,
  onOpenCart,
  onOpenMobileMenu,
}: HeaderProps) {
  const isProductsView = location === '/products' || location.startsWith('/products/');
  const isAboutView = location === '/about';

  return (
    <>


      <header className="sticky top-0 z-40 bg-white/92 backdrop-blur-md border-b border-[#E5E2D8] shadow-2xs transition-all duration-300" data-testid="header-store">
        <div className="store-shell flex h-[68px] items-center justify-between">
          {/* Logo */}
          <a href="/" onClick={(e) => { e.preventDefault(); setLocation('/'); }} className="flex items-center group shrink-0" data-testid="link-brand">
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
              onClick={onOpenCart}
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
              onClick={onOpenMobileMenu}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#E5E2D8] bg-white text-[#0B4A3D] md:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
