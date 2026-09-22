import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TicketBooking, Language } from '../types';
import { SyrianEagleLogo } from './SyrianEagleLogo';
import { DamasceneJasmineIcon, DamasceneZakhrafaBanner } from './DamascenePattern';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Bus, 
  Calendar, 
  Clock, 
  Luggage, 
  ShieldCheck, 
  Smartphone,
  ScanLine
} from 'lucide-react';

interface DigitalTicketModalProps {
  booking: TicketBooking;
  lang: Language;
  onClose: () => void;
  onSimulateBoardingScan?: (ticketId: string) => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  booking,
  lang,
  onClose,
  onSimulateBoardingScan,
}) => {
  const [isBoarded, setIsBoarded] = useState(booking.boardingStatus === 'boarded');
  const [copySuccess, setCopySuccess] = useState(false);

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  const handleBoarding = () => {
    setIsBoarded(true);
    if (onSimulateBoardingScan) {
      onSimulateBoardingScan(booking.ticketId);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `تذكرة سفر سورية الرقمية\nرقم الحجز: ${booking.pnr}\nمن: ${booking.trip.fromGarageAr}\nإلى: ${booking.trip.toGarageAr}\nالمقاعد: ${booking.selectedSeats.join(', ')}`
    );
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border-2 border-[#D4AF37] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="bg-[#0A2D1B] text-white p-3 px-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-100">
              {lang === 'ar' ? 'بطاقة الصعود الرقمية المعتمدة' : 'Official Digital Boarding Pass'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              title={lang === 'ar' ? 'طباعة التذكرة' : 'Print Ticket'}
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              title={lang === 'ar' ? 'مشاركة تفاصيل التذكرة' : 'Share Booking'}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Digital Ticket Body (Mowasalat-Grade Ticket Styling) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#F9FAF9]">
          {copySuccess && (
            <div className="mb-3 p-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center">
              {lang === 'ar' ? 'تم نسخ تفاصيل الحجز بنجاح!' : 'Booking details copied to clipboard!'}
            </div>
          )}

          {/* Ticket Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden relative">
            {/* Header: Syrian Golden Eagle & PNR */}
            <div className="bg-linear-to-r from-[#0D472B] via-[#0A3822] to-[#0D472B] text-white p-5 relative overflow-hidden">
              <DamasceneZakhrafaBanner opacity={0.15} color="#D4AF37" />

              <div className="relative z-10 flex items-center justify-between">
                <SyrianEagleLogo size={42} variant="white" lang={lang} />

                <div className="text-left">
                  <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">
                    {lang === 'ar' ? 'رمز الحجز (PNR)' : 'Booking Reference'}
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-black text-[#D4AF37] tracking-wider">
                    {booking.pnr}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-3 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-100/90">
                <span className="font-bold">{booking.trip.operatorNameAr}</span>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px]">
                  {booking.trip.busClass.toUpperCase()}
                </span>
                <span>{booking.trip.busModel}</span>
              </div>
            </div>

            {/* Journey Details */}
            <div className="p-5 space-y-4">
              {/* Cities & Time */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-gray-900">
                    {booking.trip.departureTime}
                  </div>
                  <div className="text-xs font-bold text-[#0D472B] mt-0.5">
                    {booking.trip.fromGarageAr}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {booking.travelDate}
                  </div>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-semibold mb-1">
                    {booking.trip.durationHours} {lang === 'ar' ? 'ساعات' : 'hours'} ({booking.trip.distanceKm} كم)
                  </span>
                  <div className="w-full relative flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0D472B]" />
                    <div className="flex-1 h-[2px] bg-linear-to-r from-[#0D472B] via-[#D4AF37] to-[#0D472B]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  </div>
                  <span className="text-[9px] text-[#0D472B] font-bold mt-1">
                    {lang === 'ar' ? 'رحلة مباشرة' : 'Direct Trip'}
                  </span>
                </div>

                <div className="text-left">
                  <div className="text-2xl font-black text-gray-900">
                    {booking.trip.arrivalTime}
                  </div>
                  <div className="text-xs font-bold text-[#0D472B] mt-0.5">
                    {booking.trip.toGarageAr}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {booking.travelDate}
                  </div>
                </div>
              </div>

              {/* Passengers & Seats Grid */}
              <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold">
                    {lang === 'ar' ? 'المسافر الرئيسي' : 'Lead Passenger'}
                  </div>
                  <div className="font-bold text-gray-900 truncate">
                    {booking.passengers[0]?.fullName || 'محمد الأحمد'}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold">
                    {lang === 'ar' ? 'المقاعد' : 'Seats'}
                  </div>
                  <div className="font-black text-[#0D472B]">
                    {booking.selectedSeats.map((s) => `#${s}`).join(', ')}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold">
                    {lang === 'ar' ? 'الأمتعة المجانية' : 'Baggage Allowance'}
                  </div>
                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                    <Luggage className="w-3.5 h-3.5" />
                    <span>{booking.luggageKgTotal} {lang === 'ar' ? 'كغ' : 'kg'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold">
                    {lang === 'ar' ? 'حالة الدفع' : 'Payment'}
                  </div>
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ar' ? 'مؤكد ومدفوع' : 'Confirmed'}</span>
                  </div>
                </div>
              </div>

              {/* Dotted Tear Line with Cutout Notches */}
              <div className="relative py-2 flex items-center">
                <div className="absolute -left-8 w-6 h-6 rounded-full bg-[#F9FAF9] border-r border-gray-300" />
                <div className="w-full border-b-2 border-dashed border-gray-300" />
                <div className="absolute -right-8 w-6 h-6 rounded-full bg-[#F9FAF9] border-l border-gray-300" />
              </div>

              {/* QR Code Section for Conductor Scan */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-2xl border-2 border-[#0D472B] shadow-sm">
                    <QRCodeSVG
                      value={booking.qrPayload}
                      size={110}
                      level="H"
                      includeMargin={false}
                      fgColor="#0D472B"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <ScanLine className="w-4 h-4 text-[#D4AF37]" />
                      <span>{lang === 'ar' ? 'امسح الرمز عند الصعود' : 'Scan to Board'}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 max-w-[200px]">
                      {lang === 'ar'
                        ? 'أظهر هذا الرمز مباشرة لمرافق البولمان عند بوابة الصعود. لا حاجة لطباعة ورقية.'
                        : 'Present this QR directly to the conductor upon boarding.'}
                    </p>
                    <div className="text-[10px] font-mono text-gray-400">
                      ID: {booking.ticketId}
                    </div>
                  </div>
                </div>

                {/* Simulated Conductor Boarding Action */}
                <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                  {isBoarded ? (
                    <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>{lang === 'ar' ? 'تم تأكيد الصعود على متن الحافلة' : 'Passenger Boarded ✓'}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBoarding}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0D472B] border border-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <ScanLine className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{lang === 'ar' ? 'محاكاة مسح التذكرة (المرافق)' : 'Simulate Conductor Scan'}</span>
                    </button>
                  )}

                  <span className="text-[10px] text-gray-500">
                    {lang === 'ar' ? 'سعر التذكرة:' : 'Total fare:'} {formatSYP(booking.totalAmountSYP)} {lang === 'ar' ? 'ل.س' : 'SYP'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Damascene Jasmine Footer */}
            <div className="bg-[#0D472B]/5 px-5 py-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-emerald-900/70">
              <div className="flex items-center gap-1.5">
                <DamasceneJasmineIcon size={12} color="#D4AF37" />
                <span>{lang === 'ar' ? 'سورية - وزارة النقل - منصة سفر الموحدة' : 'Syria - Ministry of Transport - Safar'}</span>
              </div>
              <span>24/7 Support: 9880 / +963 11 531 2200</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-white p-4 px-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Smartphone className="w-4 h-4 text-[#0D472B]" />
            <span>{lang === 'ar' ? 'تم إرسال نسخة إلى رسائلك القصيرة وواتساب' : 'Copy sent via SMS & WhatsApp'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#0D472B] text-[#D4AF37] text-xs font-bold hover:bg-[#0A3822] shadow-sm transition-all"
          >
            {lang === 'ar' ? 'إغلاق والعودة للرئيسية' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
