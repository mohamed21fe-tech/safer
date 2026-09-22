import React, { useState } from 'react';
import { TripSchedule, Language, SeatInfo } from '../types';
import { SYRIAN_LUGGAGE_POLICY } from '../data/syriaData';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Luggage, 
  Plus, 
  Minus, 
  ChevronRight, 
  Info,
  Sparkles
} from 'lucide-react';

interface SeatSelectionModalProps {
  trip: TripSchedule;
  passengersCount: number;
  lang: Language;
  onClose: () => void;
  onProceedToCheckout: (selectedSeats: number[], extraLuggageKg: number) => void;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  trip,
  passengersCount,
  lang,
  onClose,
  onProceedToCheckout,
}) => {
  // Pre-generate bus layout: 11 rows of 4 seats + 1 back row of 5 seats = 49 seats total (44-48 standard)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [extraLuggageKg, setExtraLuggageKg] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Deterministically mark some seats as occupied based on trip id
  const takenSeatNumbers = React.useMemo(() => {
    const hash = trip.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const taken = new Set<number>();
    const takenCount = trip.totalSeats - trip.availableSeats;
    for (let i = 1; i <= trip.totalSeats; i++) {
      if ((i * hash + 7) % 3 === 0 && taken.size < takenCount) {
        taken.add(i);
      }
    }
    return taken;
  }, [trip]);

  const toggleSeat = (seatNum: number) => {
    if (takenSeatNumbers.has(seatNum)) return;

    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
      setErrorMessage('');
    } else {
      if (selectedSeats.length >= passengersCount) {
        setErrorMessage(
          lang === 'ar'
            ? `لقد حددت بالفعل ${passengersCount} ${passengersCount === 1 ? 'مقعد' : 'مقاعد'}. يمكنك إلغاء تحديد مقعد لاختيار غيره.`
            : `You have already selected ${passengersCount} seats.`
        );
        return;
      }
      setSelectedSeats([...selectedSeats, seatNum]);
      setErrorMessage('');
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length !== passengersCount) {
      setErrorMessage(
        lang === 'ar'
          ? `يرجى تحديد ${passengersCount} ${passengersCount === 1 ? 'مقعد' : 'مقاعد'} لإتمام الحجز.`
          : `Please select exactly ${passengersCount} seats to proceed.`
      );
      return;
    }
    onProceedToCheckout(selectedSeats, extraLuggageKg);
  };

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  const baseFare = selectedSeats.length * trip.priceSYP;
  const excessLuggageFee = extraLuggageKg * SYRIAN_LUGGAGE_POLICY.excessRatePerKgSYP;
  const totalAmount = baseFare + excessLuggageFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#D4AF37]/40 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header with Syrian Operator Theme */}
        <div className="bg-linear-to-r from-[#0D472B] via-[#0A3822] to-[#0D472B] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#D4AF37]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#D4AF37] text-[#0A2D1B]">
                {trip.busClass.toUpperCase()}
              </span>
              <span className="text-xs text-emerald-200/90 font-medium">
                {trip.busModel} • {trip.plateNumber}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5">
              {lang === 'ar' ? 'اختيار المقاعد والأمتعة' : 'Seat & Luggage Selection'} –{' '}
              <span className="text-[#D4AF37]">
                {lang === 'ar' ? trip.operatorNameAr : trip.operatorNameEn}
              </span>
            </h3>
            <p className="text-xs text-emerald-100/70">
              {trip.fromGarageAr} ← {trip.toGarageAr} ({trip.departureTime})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Bus Blueprint Layout */}
          <div className="lg:col-span-7 bg-[#F4F6F4] p-4 sm:p-5 rounded-2xl border border-gray-200 flex flex-col items-center">
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs mb-4 text-gray-700">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-white border border-gray-300 shadow-xs" />
                <span>{lang === 'ar' ? 'متاح' : 'Available'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#0D472B] text-[#D4AF37] flex items-center justify-center font-bold text-[10px] shadow-xs">
                  ✓
                </div>
                <span>{lang === 'ar' ? 'محدد' : 'Selected'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-gray-300 text-gray-400 cursor-not-allowed" />
                <span>{lang === 'ar' ? 'محجوز' : 'Occupied'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-amber-50 border border-amber-300 text-amber-700 flex items-center justify-center text-[10px]">
                  ★
                </div>
                <span>{lang === 'ar' ? 'نافذة بانورامية' : 'Window'}</span>
              </div>
            </div>

            {/* Bus Shell Outline */}
            <div className="w-full max-w-[340px] bg-white rounded-t-3xl rounded-b-2xl border-2 border-gray-300 p-4 shadow-md relative">
              {/* Front Driver Cabin & Windshield */}
              <div className="pb-4 mb-4 border-b-2 border-dashed border-gray-200 flex items-center justify-between text-xs text-gray-500 font-bold px-2">
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-lg">
                  <span>☸</span>
                  <span>{lang === 'ar' ? 'كابينة السائق' : 'Driver'}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                  <span>🚪</span>
                  <span>{lang === 'ar' ? 'باب الصعود' : 'Entry'}</span>
                </div>
              </div>

              {/* Rows 1 to 10 (2 + 2 Seating) */}
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rowNum) => {
                  const s1 = (rowNum - 1) * 4 + 1;
                  const s2 = (rowNum - 1) * 4 + 2;
                  const s3 = (rowNum - 1) * 4 + 3;
                  const s4 = (rowNum - 1) * 4 + 4;

                  const renderSeat = (num: number, isWindow: boolean) => {
                    const isTaken = takenSeatNumbers.has(num);
                    const isSelected = selectedSeats.includes(num);

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => toggleSeat(num)}
                        disabled={isTaken}
                        className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-xs transition-all relative ${
                          isTaken
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                            : isSelected
                            ? 'bg-[#0D472B] text-[#D4AF37] ring-2 ring-[#D4AF37] scale-105 shadow-md'
                            : isWindow
                            ? 'bg-amber-50/70 hover:bg-emerald-100 text-gray-800 border border-amber-300 hover:border-[#0D472B]'
                            : 'bg-white hover:bg-emerald-50 text-gray-800 border border-gray-300 hover:border-[#0D472B]'
                        }`}
                        title={
                          isTaken
                            ? lang === 'ar' ? 'المقعد محجوز مسبقاً' : 'Occupied'
                            : `${lang === 'ar' ? 'مقعد' : 'Seat'} #${num} (${isWindow ? (lang === 'ar' ? 'نافذة' : 'Window') : (lang === 'ar' ? 'ممر' : 'Aisle')})`
                        }
                      >
                        <span>{num}</span>
                        {isWindow && !isSelected && !isTaken && (
                          <span className="text-[8px] text-amber-600 leading-none">W</span>
                        )}
                        {isSelected && (
                          <Check className="w-3 h-3 text-[#D4AF37] absolute -top-1 -right-1 bg-[#0A3822] rounded-full p-0.5" />
                        )}
                      </button>
                    );
                  };

                  return (
                    <div key={`row-${rowNum}`} className="flex items-center justify-between">
                      {/* Left Pair (Window, Aisle) */}
                      <div className="flex items-center gap-1.5">
                        {renderSeat(s1, true)}
                        {renderSeat(s2, false)}
                      </div>

                      {/* Walkway Aisle Label */}
                      <span className="text-[9px] font-semibold text-gray-300 uppercase px-1">
                        {rowNum}
                      </span>

                      {/* Right Pair (Aisle, Window) */}
                      <div className="flex items-center gap-1.5">
                        {renderSeat(s3, false)}
                        {renderSeat(s4, true)}
                      </div>
                    </div>
                  );
                })}

                {/* Back Row (Seats 41 to 44 or 45) */}
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  {[41, 42, 43, 44].map((num) => {
                    const isTaken = takenSeatNumbers.has(num);
                    const isSelected = selectedSeats.includes(num);
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => toggleSeat(num)}
                        disabled={isTaken}
                        className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-xs transition-all ${
                          isTaken
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                            : isSelected
                            ? 'bg-[#0D472B] text-[#D4AF37] ring-2 ring-[#D4AF37] scale-105 shadow-md'
                            : 'bg-white hover:bg-emerald-50 text-gray-800 border border-gray-300'
                        }`}
                      >
                        <span>{num}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rear Emergency Exit */}
              <div className="mt-4 pt-2 border-t text-center text-[10px] text-gray-400 font-semibold">
                {lang === 'ar' ? 'مخرج الطوارئ الخلفي' : 'Emergency Exit'}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Luggage Policy */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Selected Seats summary */}
              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/60 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0D472B] uppercase">
                    {lang === 'ar' ? 'المقاعد المختارة:' : 'Selected Seats:'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    {selectedSeats.length} / {passengersCount} {lang === 'ar' ? 'محددة' : 'picked'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                  {selectedSeats.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">
                      {lang === 'ar'
                        ? `يرجى النقر على ${passengersCount} مقاعد من المخطط على اليمين`
                        : `Please click on ${passengersCount} seats in the layout`}
                    </span>
                  ) : (
                    selectedSeats.sort((a, b) => a - b).map((seat) => (
                      <span
                        key={seat}
                        className="px-2.5 py-1 rounded-lg bg-[#0D472B] text-[#D4AF37] font-bold text-xs flex items-center gap-1 shadow-xs"
                      >
                        <span>{lang === 'ar' ? `مقعد #${seat}` : `Seat #${seat}`}</span>
                        <button
                          type="button"
                          onClick={() => toggleSeat(seat)}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {errorMessage && (
                  <div className="mt-2 text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    {errorMessage}
                  </div>
                )}
              </div>

              {/* Mowasalat-Inspired Luggage Policy Transparency */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Luggage className="w-4 h-4 text-[#0D472B]" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase">
                    {lang === 'ar' ? 'سياسة الأمتعة والوزن المجاني' : 'Baggage Allowance Policy'}
                  </h4>
                </div>

                <div className="text-xs text-gray-600 space-y-1.5 mb-3 bg-gray-50 p-2.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span>{lang === 'ar' ? 'الوزن المجاني المسموح:' : 'Free Luggage Allowance:'}</span>
                    <span className="font-bold text-emerald-700">30 {lang === 'ar' ? 'كغ / راكب' : 'kg / pax'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{lang === 'ar' ? 'حقيبة يد داخل المقصورة:' : 'Carry-on Bag in Cabin:'}</span>
                    <span className="font-bold text-gray-700">7 {lang === 'ar' ? 'كغ مجاناً' : 'kg free'}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                    {lang === 'ar' 
                      ? 'الوزن الإضافي: 3,000 ل.س لكل 1 كغ إضافي'
                      : 'Excess baggage: 3,000 SYP per extra kg'}
                  </div>
                </div>

                {/* Extra Luggage Stepper */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-xs font-bold text-gray-800">
                      {lang === 'ar' ? 'إضافة وزن أمتعة زائد؟' : 'Add Excess Luggage?'}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {formatSYP(excessLuggageFee)} {lang === 'ar' ? 'ل.س' : 'SYP'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExtraLuggageKg(Math.max(0, extraLuggageKg - 5))}
                      disabled={extraLuggageKg === 0}
                      className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-12 text-center">
                      +{extraLuggageKg} {lang === 'ar' ? 'كغ' : 'kg'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExtraLuggageKg(extraLuggageKg + 5)}
                      className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>
                    {formatSYP(trip.priceSYP)} × {selectedSeats.length} {lang === 'ar' ? 'مقاعد' : 'seats'}
                  </span>
                  <span className="font-semibold">{formatSYP(baseFare)} {lang === 'ar' ? 'ل.س' : 'SYP'}</span>
                </div>
                {extraLuggageKg > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>
                      {lang === 'ar' ? 'رسوم الأمتعة الإضافية' : 'Excess Luggage Fee'} ({extraLuggageKg} كغ)
                    </span>
                    <span className="font-semibold">+{formatSYP(excessLuggageFee)} {lang === 'ar' ? 'ل.س' : 'SYP'}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>{lang === 'ar' ? 'المجموع الكلي:' : 'Total Amount:'}</span>
                  <span className="text-lg font-black text-[#0D472B]">
                    {formatSYP(totalAmount)} {lang === 'ar' ? 'ل.س' : 'SYP'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleProceed}
                disabled={selectedSeats.length !== passengersCount}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-linear-to-r from-[#0D472B] to-[#125B37] hover:from-[#0A3822] hover:to-[#0D472B] disabled:opacity-50 disabled:cursor-not-allowed text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/40"
              >
                <span>{lang === 'ar' ? 'متابعة لبيانات الركاب والدفع' : 'Continue to Passenger & Pay'}</span>
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
