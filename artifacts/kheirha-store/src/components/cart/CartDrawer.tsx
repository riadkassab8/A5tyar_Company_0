import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from 'lucide-react';
import type { CartItem } from '@/types/store';
import { displayPrice, formatPrice } from '@/data/products';

interface CartDrawerProps {
  cart: CartItem[];
  subtotal: number;
  onClose: () => void;
  onUpdate: (id: string, amt: number) => void;
  onRemove: (id: string, name: string) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  cart,
  subtotal,
  onClose,
  onUpdate,
  onRemove,
  onProceedToCheckout,
}: CartDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E2D8] px-6 py-5">
          <h3 className="font-display font-black text-xl text-[#7B694D]">سلة المشتريات</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag size={40} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-500">سلتك فارغة حالياً</p>
              <button onClick={onClose} className="rounded-full bg-[#7B694D] px-6 py-2.5 text-xs font-black text-white">ابدأ التسوق</button>
            </div>
          ) : (
            cart.map((item) => {
              const price = displayPrice(item);
              return (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-[#E5E2D8] bg-[#FAF8F2] p-4 text-xs">
                  <div>
                    <h4 className="font-black text-[#7B694D]">{item.name}</h4>
                    <p className="text-[0.68rem] text-slate-500 font-bold mt-0.5">{item.size}</p>
                    <p className="font-black text-[#7B694D] mt-1.5">{price === null ? 'السعر عند الطلب' : formatPrice(price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-[#E5E2D8] bg-white p-1">
                      <button onClick={() => onUpdate(item.id, 1)} className="p-1 text-slate-600 hover:text-[#7B694D]"><Plus size={14} /></button>
                      <span className="font-black px-1.5 text-sm">{item.quantity}</span>
                      <button onClick={() => onUpdate(item.id, -1)} className="p-1 text-slate-600 hover:text-[#7B694D]"><Minus size={14} /></button>
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
            <div className="flex justify-between text-xs font-black text-[#7B694D]">
              <span>الإجمالي ({cart.length} منتجات)</span>
              <span className="text-base font-black text-[#7B694D]">{formatPrice(subtotal)}</span>
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
