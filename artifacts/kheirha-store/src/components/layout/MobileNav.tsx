import { Grid, Home, ShoppingBag, User } from 'lucide-react';
import { money } from '@/data/products';

interface MobileNavProps {
  location: string;
  setLocation: (loc: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export function MobileNav({
  location,
  setLocation,
  cartCount,
  onOpenCart,
}: MobileNavProps) {
  const isProductsView = location === '/products' || location.startsWith('/products/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E2D8] py-2.5 px-4 flex items-center justify-around md:hidden shadow-lg">
      <button onClick={() => setLocation('/')} className={`flex flex-col items-center gap-1 text-[0.68rem] font-bold ${location === '/' ? 'text-[#0B4A3D]' : 'text-slate-500'}`}>
        <Home size={20} />
        <span>الرئيسية</span>
      </button>
      <button onClick={() => setLocation('/products')} className={`flex flex-col items-center gap-1 text-[0.68rem] font-bold ${isProductsView ? 'text-[#0B4A3D]' : 'text-slate-500'}`}>
        <Grid size={20} />
        <span>المنتجات</span>
      </button>
      <button onClick={onOpenCart} className="relative flex flex-col items-center gap-1 text-[0.68rem] font-bold text-slate-500">
        <ShoppingBag size={20} />
        <span>السلة</span>
        {cartCount > 0 && <span className="absolute -top-1 right-2 grid h-4.5 w-4.5 place-items-center rounded-full bg-[#E3B33C] text-[0.58rem] font-black text-[#0B4A3D]">{money.format(cartCount)}</span>}
      </button>
      <button onClick={() => setLocation('/about')} className="flex flex-col items-center gap-1 text-[0.68rem] font-bold text-slate-500">
        <User size={20} />
        <span>عن أختيار</span>
      </button>
    </nav>
  );
}
