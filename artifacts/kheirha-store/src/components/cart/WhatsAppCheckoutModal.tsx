import { MessageCircle, X } from 'lucide-react';
import type { CartItem } from '@/types/store';
import { displayPrice, formatPrice } from '@/data/products';

interface WhatsAppCheckoutModalProps {
  cart: CartItem[];
  subtotal: number;
  onClose: () => void;
  onConfirmOrder: () => void;
}

export function WhatsAppCheckoutModal({
  cart,
  subtotal,
  onClose,
  onConfirmOrder,
}: WhatsAppCheckoutModalProps) {
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
