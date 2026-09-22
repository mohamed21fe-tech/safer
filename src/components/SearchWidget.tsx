import React, { useState } from 'react';
import { GOVERNORATES, POPULAR_ROUTES } from '../data/syriaData';
import { Language } from '../types';
import { DamasceneZakhrafaBanner, DamasceneJasmineIcon } from './DamascenePattern';
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  Search, 
  ShieldCheck, 
  Sparkles,
  Clock,
  Bus
} from 'lucide-react';

interface SearchWidgetProps {
  lang: Language;
  onSearch: (params: {
    fromId: string;
    toId: string;
    date: string;
    passengers: number;
    busClass?: string;
  }) => void;
  selectedFrom?: string;
  selectedTo?: string;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  lang,
  onSearch,
  selectedFrom = 'damascus',
  selectedTo = 'aleppo',
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [fromId, setFromId] = useState<string>(selectedFrom);
  const [toId, setToId] = useState<string>(selectedTo);
  const [travelDate, setTravelDate] = useState<string>(todayStr);
  const [passengers, setPassengers] = useState<number>(1);
  const [busClass, setBusClass] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSwap = () => {
    const temp = fromId;
    setFromId(toId);
    setToId(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromId === toId) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى اختيار مدينة وصول مختلفة عن مدينة الانطلاق'
          : 'Departure and arrival cities cannot be the same'
      );
      return;
    }
    setErrorMessage('');
    onSearch({
      fromId,
      toId,
      date: travelDate,
      passengers,
      busClass: busClass === 'all' ? undefined : busClass,
    });
  };

  const selectPopularRoute = (from: string, to: string) => {
    setFromId(from);
    setToId(to);
    onSearch({
      fromId: from,
      toId: to,
      date: travelDate,
      passengers,
    });
  };

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-[#0A3822] via-[#0D472B] to-[#082C1A] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D4AF37]">
      {/* Authentic Damascene Geometric Background Texture */}
      <DamasceneZakhrafaBanner opacity={0.12} color="#D4AF37" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Syrian Identity Eyebrow & Headline */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold mb-4 tracking-wide shadow-xs">
            <DamasceneJasmineIcon size={16} color="#D4AF37" />
            <span>
              {lang === 'ar' 
                ? 'الشبكة الوطنية لحافلات النقل بين 14 محافظة سورية' 
                : 'National Transport Network Connecting 14 Syrian Governorates'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {lang === 'ar' ? (
              <>
                احجز رحلتك بين <span className="text-[#D4AF37]">المحافظات السورية</span> بأمان
              </>
            ) : (
              <>
                Book Intercity Bus Trips Across <span className="text-[#D4AF37]">Syria</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/80 font-normal">
            {lang === 'ar'
              ? 'مقارنة فورية بين كبرى شركات البولمان السورية (قدموس، الأهلية، السراج، الشهباء) بتذاكر رقمية فورية ودفع عبر شام كاش وسيريتل كاش.'
              : 'Direct booking across premier Syrian carriers (Kadmous, Al-Ahlia, Al-Seraj, Al-Shahba) with instant QR tickets, ShamCash & Syriatel Cash.'}
          </p>
        </div>

        {/* Main Search Booking Box */}
        <div className="bg-white text-[#141C17] rounded-2xl p-4 sm:p-6 shadow-2xl border border-[#D4AF37]/30 backdrop-blur-md">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
              {/* Departure City */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-[#0D472B] uppercase tracking-wider mb-1">
                  {lang === 'ar' ? 'مدينة الانطلاق (من)' : 'Departure City (From)'}
                </label>
                <div className="relative">
                  <MapPin className="absolute top-3.5 right-3 w-4 h-4 text-[#D4AF37] pointer-events-none" />
                  <select
                    value={fromId}
                    onChange={(e) => setFromId(e.target.value)}
                    className="w-full bg-[#F8F9F8] border border-gray-200 rounded-xl py-2.5 pr-9 pl-3 text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#0D472B] focus:border-transparent transition-all"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={`from-${gov.id}`} value={gov.id}>
                        {lang === 'ar' ? gov.nameAr : gov.nameEn} ({lang === 'ar' ? gov.centerGarageAr.split('-')[0] : gov.centerGarageEn.split('/')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Origin & Destination Button */}
              <div className="md:col-span-1 flex justify-center py-1 md:py-0">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-2.5 rounded-full bg-emerald-50 hover:bg-[#D4AF37] hover:text-white text-[#0D472B] border border-emerald-200 transition-all shadow-xs transform hover:rotate-180 duration-300"
                  title={lang === 'ar' ? 'تبديل وجهة الانطلاق والوصول' : 'Swap Origin & Destination'}
                  aria-label="Swap cities"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Arrival Destination */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-[#0D472B] uppercase tracking-wider mb-1">
                  {lang === 'ar' ? 'مدينة الوصول (إلى)' : 'Destination (To)'}
                </label>
                <div className="relative">
                  <MapPin className="absolute top-3.5 right-3 w-4 h-4 text-[#D4AF37] pointer-events-none" />
                  <select
                    value={toId}
                    onChange={(e) => setToId(e.target.value)}
                    className="w-full bg-[#F8F9F8] border border-gray-200 rounded-xl py-2.5 pr-9 pl-3 text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#0D472B] focus:border-transparent transition-all"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={`to-${gov.id}`} value={gov.id}>
                        {lang === 'ar' ? gov.nameAr : gov.nameEn} ({lang === 'ar' ? gov.centerGarageAr.split('-')[0] : gov.centerGarageEn.split('/')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Date */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#0D472B] uppercase tracking-wider mb-1">
                  {lang === 'ar' ? 'تاريخ السفر' : 'Travel Date'}
                </label>
                <div className="relative">
                  <Calendar className="absolute top-3.5 right-3 w-4 h-4 text-[#D4AF37] pointer-events-none" />
                  <input
                    type="date"
                    min={todayStr}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-[#F8F9F8] border border-gray-200 rounded-xl py-2.5 pr-9 pl-3 text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#0D472B] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Passengers Count */}
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-[#0D472B] uppercase tracking-wider mb-1">
                  {lang === 'ar' ? 'الركاب' : 'Seats'}
                </label>
                <div className="relative">
                  <Users className="absolute top-3.5 right-2 w-4 h-4 text-[#D4AF37] pointer-events-none" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full bg-[#F8F9F8] border border-gray-200 rounded-xl py-2.5 pr-7 pl-2 text-sm font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#0D472B]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={`pax-${num}`} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Action Button */}
              <div className="md:col-span-2 pt-5 md:pt-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-linear-to-r from-[#0D472B] to-[#125B37] hover:from-[#0A3822] hover:to-[#0D472B] text-[#D4AF37] font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-[#D4AF37]/30"
                >
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  <span>{lang === 'ar' ? 'بحث عن الرحلات' : 'Find Trips'}</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Route Pills */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{lang === 'ar' ? 'الخطوط الأكثر طلباً:' : 'Popular routes:'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {POPULAR_ROUTES.slice(0, 4).map((route) => (
                  <button
                    key={`${route.fromId}-${route.toId}`}
                    type="button"
                    onClick={() => selectPopularRoute(route.fromId, route.toId)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-[#0D472B] hover:text-[#D4AF37] text-[#0D472B] font-semibold border border-emerald-200/60 transition-all text-xs flex items-center gap-1.5"
                  >
                    <span>{lang === 'ar' ? `${route.fromNameAr} ↔ ${route.toNameAr}` : `${route.fromNameEn} ↔ ${route.toNameEn}`}</span>
                    <span className="text-[10px] text-gray-500 font-normal">({route.duration})</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* 3 Government-Grade Trust Signals & Syrian Guarantee */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white">
            <div className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">{lang === 'ar' ? 'مشغل وطني رسمي معتمد' : 'Official Licensed Operators'}</div>
              <div className="text-xs text-emerald-100/70">{lang === 'ar' ? 'جميع شركات النقل مرخصة ومنظمة' : 'Government-certified fleet standards'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white">
            <div className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">{lang === 'ar' ? 'دفع آمن: شام كاش وسيريتل كاش' : 'ShamCash & Syriatel Cash'}</div>
              <div className="text-xs text-emerald-100/70">{lang === 'ar' ? 'دفع إلكتروني فوري بدون عمولات إضافية' : 'Zero surcharge instant mobile pay'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white">
            <div className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">{lang === 'ar' ? 'تذكرة رقمية QR فورية' : 'Instant Digital QR Boarding'}</div>
              <div className="text-xs text-emerald-100/70">{lang === 'ar' ? 'ركوب مباشر دون الحاجة لطباعة ورقية' : '100% paperless mobile boarding pass'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
