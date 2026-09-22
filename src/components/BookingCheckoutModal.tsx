import React, { useState } from 'react';
import { TripSchedule, Language, PassengerProfile, PaymentMethodType, TicketBooking } from '../types';
import { SYRIAN_LUGGAGE_POLICY } from '../data/syriaData';
import { 
  X, 
  User, 
  Phone, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Coins, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface BookingCheckoutModalProps {
  trip: TripSchedule;
  selectedSeats: number[];
  extraLuggageKg: number;
  travelDate: string;
  lang: Language;
  walletBalanceSYP: number;
  onClose: () => void;
  onBookingConfirmed: (booking: TicketBooking) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  trip,
  selectedSeats,
  extraLuggageKg,
  travelDate,
  lang,
  walletBalanceSYP,
  onClose,
  onBookingConfirmed,
}) => {
  // Passenger info array
  const [passengers, setPassengers] = useState<PassengerProfile[]>(() =>
    selectedSeats.map((seatNum, idx) => ({
      fullName: idx === 0 ? 'محمد الأحمد' : '',
      nationalId: idx === 0 ? '01040089211' : '',
      phone: idx === 0 ? '+963 933 123 456' : '',
      email: idx === 0 ? 'mohamed.alahmad@safar.sy' : '',
      gender: 'male',
      seatNumber: seatNum,
    }))
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('shamcash');
  const [shamCashAccount, setShamCashAccount] = useState('963944882100');
  const [syriatelPin, setSyriatelPin] = useState('');
  const [saveProfile, setSaveProfile] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState('');

  const baseFare = selectedSeats.length * trip.priceSYP;
  const excessLuggageFee = extraLuggageKg * SYRIAN_LUGGAGE_POLICY.excessRatePerKgSYP;
  const totalAmount = baseFare + excessLuggageFee;

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  const updatePassenger = (index: number, field: keyof PassengerProfile, value: any) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.fullName.trim() || !p.nationalId.trim() || !p.phone.trim()) {
        setValidationError(
          lang === 'ar'
            ? `يرجى إكمال بيانات الراكب للمقعد #${p.seatNumber} (الاسم، الرقم الوطني، ورقم الهاتف)`
            : `Please complete all details for Passenger #${p.seatNumber}`
        );
        return;
      }
    }

    if (paymentMethod === 'safar_wallet' && walletBalanceSYP < totalAmount) {
      setValidationError(
        lang === 'ar'
          ? 'رصيد محفظة سفر غير كافٍ لإتمام عملية الدفع. يرجى شحن المحفظة أو اختيار وسيلة دفع أخرى.'
          : 'Insufficient Safar Wallet balance. Please top up or choose another payment method.'
      );
      return;
    }

    setValidationError('');
    setIsProcessing(true);

    // Simulate instant payment processing and secure ticket issuance
    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const pnr = `SYR-${new Date().getFullYear()}-${randomNum}`;
      const ticketId = `TKT-${Date.now()}`;

      const booking: TicketBooking = {
        ticketId,
        pnr,
        tripId: trip.id,
        trip,
        travelDate,
        passengers,
        selectedSeats,
        luggageKgTotal: selectedSeats.length * 30 + extraLuggageKg,
        excessLuggageFeeSYP: excessLuggageFee,
        baseFareSYP: baseFare,
        discountSYP: 0,
        totalAmountSYP: totalAmount,
        paymentMethod,
        paymentStatus: 'confirmed',
        boardingStatus: 'scheduled',
        bookedAt: new Date().toISOString(),
        qrPayload: JSON.stringify({
          app: 'SAFAR_SYRIA',
          pnr,
          trip: trip.id,
          date: travelDate,
          from: trip.fromGovernorateId,
          to: trip.toGovernorateId,
          seats: selectedSeats,
          passenger: passengers[0].fullName,
          verified: true,
        }),
      };

      setIsProcessing(false);
      onBookingConfirmed(booking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#D4AF37]/40 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-[#0D472B] to-[#125B37] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#D4AF37]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-200/90 font-bold">
                {lang === 'ar' ? 'الخطوة الأخيرة' : 'Final Step'}
              </span>
              <span>•</span>
              <span className="text-xs text-[#D4AF37] font-semibold">
                {trip.operatorNameAr} ({trip.fromGarageAr} ← {trip.toGarageAr})
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5">
              {lang === 'ar' ? 'بيانات المسافرين وبوابة الدفع' : 'Passenger Information & Checkout'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleConfirmPayment} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {validationError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Passenger Profiles Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0D472B]" />
              <span>
                {lang === 'ar'
                  ? `بيانات الركاب المسافرين (${selectedSeats.length} ${selectedSeats.length === 1 ? 'مسافر' : 'مسافرين'})`
                  : `Passenger Profiles (${selectedSeats.length})`}
              </span>
            </h4>

            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div
                  key={`passenger-${passenger.seatNumber}`}
                  className="bg-[#F8F9F8] p-4 rounded-2xl border border-gray-200 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                    <span className="text-xs font-bold text-[#0D472B]">
                      {lang === 'ar' ? `الراكب #${index + 1}` : `Passenger #${index + 1}`}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0D472B] text-[#D4AF37]">
                      {lang === 'ar' ? `مقعد #${passenger.seatNumber}` : `Seat #${passenger.seatNumber}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'ar' ? 'الاسم الثلاثي كاملاً' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={passenger.fullName}
                        onChange={(e) => updatePassenger(index, 'fullName', e.target.value)}
                        placeholder={lang === 'ar' ? 'مثال: محمد أحمد العلي' : 'e.g. Mohamed Al-Ali'}
                        className="w-full bg-white border border-gray-300 rounded-xl p-2 font-medium text-gray-900 focus:ring-2 focus:ring-[#0D472B] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'ar' ? 'الرقم الوطني / جواز السفر' : 'National ID / Passport'}
                      </label>
                      <input
                        type="text"
                        required
                        value={passenger.nationalId}
                        onChange={(e) => updatePassenger(index, 'nationalId', e.target.value)}
                        placeholder="01040089211"
                        className="w-full bg-white border border-gray-300 rounded-xl p-2 font-medium text-gray-900 focus:ring-2 focus:ring-[#0D472B] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {lang === 'ar' ? 'رقم الهاتف (سوري)' : 'Syrian Mobile Number'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={passenger.phone}
                        onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                        placeholder="+963 933 123 456"
                        className="w-full bg-white border border-gray-300 rounded-xl p-2 font-medium text-gray-900 focus:ring-2 focus:ring-[#0D472B] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
              <input
                type="checkbox"
                checked={saveProfile}
                onChange={(e) => setSaveProfile(e.target.checked)}
                className="rounded text-[#0D472B] focus:ring-[#0D472B]"
              />
              <span>
                {lang === 'ar'
                  ? 'حفظ ملفات المسافرين في حسابي لتسريع الحجوزات العائلية المستقبلية'
                  : 'Save traveler profiles for future quick family bookings'}
              </span>
            </label>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0D472B]" />
              <span>{lang === 'ar' ? 'اختر وسيلة الدفع الإلكتروني' : 'Select Payment Method'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* ShamCash Option */}
              <label
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'shamcash'
                    ? 'border-[#0D472B] bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'shamcash'}
                  onChange={() => setPaymentMethod('shamcash')}
                  className="text-[#0D472B] focus:ring-[#0D472B]"
                />
                <div className="w-9 h-9 rounded-xl bg-[#0D472B] text-[#D4AF37] flex items-center justify-center font-black text-sm">
                  شام
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">
                    {lang === 'ar' ? 'شام كاش (ShamCash)' : 'ShamCash Wallet'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {lang === 'ar' ? 'دفع فوري عبر رمز QR أو الحساب' : 'Instant mobile wallet QR pay'}
                  </div>
                </div>
              </label>

              {/* Syriatel Cash Option */}
              <label
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'syriatel'
                    ? 'border-[#0D472B] bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'syriatel'}
                  onChange={() => setPaymentMethod('syriatel')}
                  className="text-[#0D472B] focus:ring-[#0D472B]"
                />
                <div className="w-9 h-9 rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-black text-xs">
                  كاش
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">
                    {lang === 'ar' ? 'سيريتل كاش (Syriatel Cash)' : 'Syriatel Cash'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {lang === 'ar' ? 'عبر كود *110# أو تحويل فوري' : 'USSD *110# mobile money'}
                  </div>
                </div>
              </label>

              {/* Safar Wallet Option */}
              <label
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'safar_wallet'
                    ? 'border-[#0D472B] bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'safar_wallet'}
                  onChange={() => setPaymentMethod('safar_wallet')}
                  className="text-[#0D472B] focus:ring-[#0D472B]"
                />
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#0A2D1B] flex items-center justify-center font-bold text-base">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'محفظة سَفَر الرقمية' : 'Safar Digital Wallet'}</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 rounded">
                      نقاط ولائك
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {lang === 'ar' ? `رصيدك: ${formatSYP(walletBalanceSYP)} ل.س` : `Balance: ${formatSYP(walletBalanceSYP)} SYP`}
                  </div>
                </div>
              </label>

              {/* Cash on Board / Pay at Karaj Option */}
              <label
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cash_on_board'
                    ? 'border-[#0D472B] bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_board'}
                  onChange={() => setPaymentMethod('cash_on_board')}
                  className="text-[#0D472B] focus:ring-[#0D472B]"
                />
                <div className="w-9 h-9 rounded-xl bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">
                    {lang === 'ar' ? 'الدفع نقداً في الكراج' : 'Pay at Karaj Counter'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {lang === 'ar' ? 'تأكيد الحجز والدفع قبل الانطلاق بـ 30 دقيقة' : 'Pay at station 30m prior'}
                  </div>
                </div>
              </label>
            </div>

            {/* Dynamic Gateway Detail Box */}
            {paymentMethod === 'shamcash' && (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-[#0D472B]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>{lang === 'ar' ? 'الدفع المباشر عبر حساب شام كاش' : 'Direct ShamCash Transfer'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>{lang === 'ar' ? 'رقم حساب شام كاش المعتمد للشركة:' : 'Official ShamCash Merchant ID:'}</span>
                  <span className="font-mono font-bold bg-white px-2.5 py-1 rounded border border-emerald-300 text-emerald-900">
                    963-944-882100
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  {lang === 'ar'
                    ? 'سيتم توجيه طلب الخصم الآمن إلى تطبيق شام كاش على هاتفك لتأكيد التذكرة فورياً.'
                    : 'A secure payment approval prompt will be sent directly to your ShamCash app.'}
                </p>
              </div>
            )}

            {paymentMethod === 'syriatel' && (
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-rose-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <Smartphone className="w-4 h-4 text-rose-600" />
                  <span>{lang === 'ar' ? 'دفع سيريتل كاش الفوري' : 'Instant Syriatel Cash Payment'}</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  {lang === 'ar'
                    ? 'ستصلك رسالة نصية USSD لتأكيد خصم قيمة التذكرة برمزك السري الخاص بسيريتل كاش.'
                    : 'You will receive an official USSD SMS prompt to authorize ticket payment.'}
                </p>
              </div>
            )}
          </div>

          {/* Price Summary & Instant QR Issuance Guarantee */}
          <div className="bg-[#181E1B] text-white p-4 rounded-2xl border border-[#D4AF37]/30 space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-200/80">
              <span>{lang === 'ar' ? 'أجرة الرحلة الأساسية:' : 'Base Trip Fare:'}</span>
              <span className="font-semibold">{formatSYP(baseFare)} {lang === 'ar' ? 'ل.س' : 'SYP'}</span>
            </div>
            {excessLuggageFee > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-200/80">
                <span>{lang === 'ar' ? 'رسوم الأمتعة الإضافية:' : 'Excess Luggage Fee:'}</span>
                <span className="font-semibold">+{formatSYP(excessLuggageFee)} {lang === 'ar' ? 'ل.س' : 'SYP'}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">{lang === 'ar' ? 'المبلغ الإجمالي المطلوب:' : 'Total Payable:'}</div>
                <div className="text-xl font-black text-[#D4AF37]">
                  {formatSYP(totalAmount)} <span className="text-xs font-bold text-white">{lang === 'ar' ? 'ل.س' : 'SYP'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-300">
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'معاملة آمنة ومشفّرة 100%' : '100% Secure Transaction'}</span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold"
            >
              {lang === 'ar' ? 'رجوع' : 'Back'}
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-linear-to-r from-[#0D472B] to-[#125B37] hover:from-[#0A3822] hover:to-[#0D472B] disabled:opacity-50 text-[#D4AF37] font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/50"
            >
              {isProcessing ? (
                <span>{lang === 'ar' ? 'جارٍ إصدار التذكرة وتوليد الـ QR...' : 'Generating Digital Ticket...'}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{lang === 'ar' ? 'تأكيد الحجز واستلام التذكرة الرقمية' : 'Confirm & Issue Digital Ticket'}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
