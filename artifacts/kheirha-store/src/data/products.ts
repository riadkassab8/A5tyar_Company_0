import { CircleHelp, Droplets, Heart, PackageCheck, Wheat } from 'lucide-react';
import type { CatalogRow, Category, Product, ProductSeed, Variant } from '@/types/store';

export const WHATSAPP_URL = 'https://wa.me/201100808082';
export const money = new Intl.NumberFormat('ar-EG');

// Product Photography Map — all local images live in /products/ folder
export const PRODUCT_IMAGES: Record<string, string> = {
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

export const productData: Product[] = [...honey, ...sesame, ...dairy, ...pantry, ...jams].map((product) => ({
  ...product,
  accent: product.category === 'عسل النحل' ? 'honey' : product.category === 'أساسيات البيت' ? 'grain' : product.category === 'منتجات الألبان' ? 'dairy' : product.category === 'منتجات السمسم' ? 'sesame' : 'jam',
  imageUrl: PRODUCT_IMAGES[product.name] || PRODUCT_IMAGES['عسل نحل طبيعي'],
  icon: product.category === 'عسل النحل' ? Droplets : product.category === 'أساسيات البيت' ? Wheat : product.category === 'منتجات الألبان' ? PackageCheck : product.category === 'منتجات السمسم' ? CircleHelp : Heart,
}));

export const displayPrice = (variant: Pick<Variant, 'price' | 'discountEligible'>) =>
  variant.price === null ? null : variant.discountEligible ? variant.price - 15 : variant.price;

export const formatPrice = (price: number) => `${money.format(price)} جنيه`;
