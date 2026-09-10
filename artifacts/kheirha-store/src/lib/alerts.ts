import Swal from 'sweetalert2';

// Custom SweetAlert2 theme instance matching store color palette
export const StoreSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl border border-[#E5E2D8] bg-[#FAF8F2] text-[#123F39] font-sans shadow-2xl',
    title: 'font-display font-extrabold text-[#123F39]',
    htmlContainer: 'text-xs text-[#5C726F] font-medium',
    confirmButton: 'bg-[#075548] text-white px-5 py-2.5 rounded-xl font-bold font-sans shadow-xs hover:bg-[#054339] mx-1 transition-all',
    cancelButton: 'bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold font-sans hover:bg-slate-300 mx-1 transition-all',
  },
  buttonsStyling: false,
});

// Toast notification for Add to Cart
export const showAddToCartToast = (productName: string) => {
  StoreSwal.fire({
    toast: true,
    position: 'bottom',
    icon: 'success',
    title: 'تمت الإضافة للسلة',
    text: productName,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
    background: '#0B4A3D',
    color: '#ffffff',
    iconColor: '#E3B33C',
    customClass: {
      popup: '!rounded-2xl sm:!rounded-full !px-4 !py-3 shadow-xl border border-[#E3B33C]/30 !mb-6',
      title: '!text-xs sm:!text-sm font-bold text-white !m-0 !p-0',
      htmlContainer: '!text-xs text-[#C2DFDB] !m-0 !p-0 !mt-0.5',
    },
  });
};

// Confirm dialog for item removal
export const confirmRemoveFromCart = async (productName: string): Promise<boolean> => {
  const result = await StoreSwal.fire({
    title: 'حذف المنتج',
    text: `هل أنت متأكد من حذف "${productName}" من سلة المشتريات؟`,
    icon: 'warning',
    iconColor: '#D97706',
    showCancelButton: true,
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'إلغاء',
  });
  return result.isConfirmed;
};

// Success alert for Order Checkout
export const showCheckoutSuccess = () => {
  StoreSwal.fire({
    title: 'تم إرسال طلبك بنجاح! 🌿',
    text: 'سنتواصل معك قريباً عبر واتساب لتأكيد الطلب وتفاصيل التوصيل.',
    icon: 'success',
    iconColor: '#075548',
    confirmButtonText: 'موافق',
  });
};

// Warning / Error alert
export const showWarningAlert = (title: string, text: string) => {
  StoreSwal.fire({
    title,
    text,
    icon: 'warning',
    iconColor: '#D97706',
    confirmButtonText: 'حسناً',
  });
};
