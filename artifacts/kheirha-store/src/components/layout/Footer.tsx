import { Leaf, MessageCircle, Clock, ChevronLeft, Phone } from 'lucide-react';
import { WHATSAPP_URL } from '@/data/products';

interface FooterProps {
  setLocation: (loc: string) => void;
}

const quickLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'المنتجات', href: '/products' },
  { label: 'عن أختيار', href: '/about' },
];

const categories = [
  'عسل النحل',
  'منتجات السمسم',
  'منتجات الألبان',
  'أساسيات البيت',
  'المربيات',
];

export function Footer({ setLocation }: FooterProps) {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setLocation(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="bg-[#564833] text-white border-t border-[#ffffff10]"
      data-testid="footer-store"
    >
      {/* ── Divider line gold ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E3B33C]/50 to-transparent" />

      {/* ── Main grid ── */}
      <div className="store-shell pt-14 pb-10 grid gap-10 md:grid-cols-4">

        {/* Col 1 — Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-lg text-[#564833]">
              <Leaf size={22} fill="#564833" stroke="none" />
            </div>
            <span className="font-display text-3xl font-black tracking-tight">أختيار</span>
          </div>
          <p className="text-xs leading-relaxed text-[#E8D5C8] max-w-[200px] mb-5">
            منتجات غذائية طبيعية مختارة بعناية من أفضل المزارع في قلب مصر.
          </p>
          {/* Gold accent bar */}
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#E3B33C] to-[#f5d07a]" />
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h4 className="text-sm font-extrabold text-[#E3B33C] mb-5 tracking-wide">
            روابط سريعة
          </h4>
          <ul className="flex flex-col gap-3">
            {quickLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleNav(e, href)}
                  className="group flex items-center gap-2 text-xs text-[#E8D5C8] hover:text-white transition-colors font-medium"
                >
                  <ChevronLeft
                    size={13}
                    className="text-[#E3B33C] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                  />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Categories */}
        <div>
          <h4 className="text-sm font-extrabold text-[#E3B33C] mb-5 tracking-wide">
            أقسام المنتجات
          </h4>
          <ul className="flex flex-col gap-3">
            {categories.map((cat) => (
              <li key={cat}>
                <a
                  href="/products"
                  onClick={(e) => handleNav(e, '/products')}
                  className="group flex items-center gap-2 text-xs text-[#E8D5C8] hover:text-white transition-colors font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E3B33C]/60 group-hover:bg-[#E3B33C] transition-colors flex-shrink-0" />
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <h4 className="text-sm font-extrabold text-[#E3B33C] mb-5 tracking-wide">
            تواصل معنا
          </h4>

          {/* Working hours */}
          <div className="flex items-center gap-2 text-xs text-[#E8D5C8] mb-4">
            <Clock size={14} className="text-[#E3B33C] flex-shrink-0" />
            <span>متاح من ٩ صباحاً حتى ١٠ مساءً</span>
          </div>

          {/* Phone number */}
          <div className="flex items-center gap-2 text-sm font-black text-white mb-5">
            <Phone size={15} className="text-[#E3B33C] flex-shrink-0" />
            <span dir="ltr">01100808082</span>
          </div>

          {/* WhatsApp CTA button */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-2.5 px-5 py-3 rounded-xl
              bg-[#25D366] hover:bg-[#1ebe5c] active:scale-95
              text-white text-xs font-extrabold
              shadow-lg shadow-[#25D366]/20
              transition-all duration-200
            "
          >
            <MessageCircle size={16} />
            اطلب عبر واتساب
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#ffffff10]">
        <div className="store-shell py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#BFA899]">
            © {new Date().getFullYear()} أختيار — جميع الحقوق محفوظة
          </p>
          <p className="text-xs text-[#BFA899]">
            صُنع بـ ❤️ في مصر
          </p>
        </div>
      </div>
    </footer>
  );
}
