import React, { useState } from 'react';
import { GOVERNORATES, BUS_GARAGES, TRIP_SCHEDULES } from '../data/syriaData';
import { Language, Governorate } from '../types';
import { 
  MapPin, 
  Bus, 
  Navigation, 
  Phone, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface InteractiveSyriaMapProps {
  lang: Language;
  onSelectRoute: (fromId: string, toId: string) => void;
}

export const InteractiveSyriaMap: React.FC<InteractiveSyriaMapProps> = ({
  lang,
  onSelectRoute,
}) => {
  const [selectedGov, setSelectedGov] = useState<Governorate>(GOVERNORATES[0]); // Damascus default
  const [activeHighway, setActiveHighway] = useState<string>('m5');

  const departuresFromSelected = TRIP_SCHEDULES.filter(
    (t) => t.fromGovernorateId === selectedGov.id
  );

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  // Highway connections for the visual map
  // Damascus (35, 72) -> Homs (40, 54) -> Hama (40, 45) -> Aleppo (47, 28)
  // Latakia (24, 42) <-> Tartous (27, 53) <-> Homs (40, 54)
  // Damascus (35, 72) -> Palmyra -> Deir ez-Zor (76, 52) -> Hasakah (82, 22)
  // Damascus (35, 72) -> Daraa (35, 84) / Sweida (44, 83)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D472B] border border-emerald-200 text-xs font-bold mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{lang === 'ar' ? 'الشبكة الجغرافية التفاعلية' : 'Interactive Geographic Network'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {lang === 'ar' ? 'خريطة المحافظات السورية ومحطات الكراجات' : 'Syrian Governorates & Bus Stations Map'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {lang === 'ar'
            ? 'انقر على أي محافظة لعرض جدول الرحلات المغادرة منها، أو تصفح محطات البولمان الرئيسية ومعلومات التواصل.'
            : 'Click on any of the 14 governorates to see real-time scheduled departures and terminal details.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Map Visual Stage */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-200 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 text-xs font-bold">
            <span className="text-gray-700 flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-[#0D472B]" />
              <span>{lang === 'ar' ? 'خريطة شبكة الطرق السورية المباشرة' : 'Live Highway Network Map'}</span>
            </span>
            <span className="text-[#D4AF37] bg-emerald-900 px-2.5 py-1 rounded-full text-[11px] font-bold">
              14 {lang === 'ar' ? 'محافظة متصلة' : 'Connected Governorates'}
            </span>
          </div>

          {/* Map Canvas / SVG Stage */}
          <div className="relative w-full aspect-4/3 bg-[#0A2617] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-inner">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

            <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
              {/* Syrian Borders Stylized Outline */}
              <path
                d="M 22 40 Q 25 30 35 28 L 47 24 Q 60 22 85 18 L 88 32 Q 78 48 78 58 L 55 78 L 44 86 L 33 86 L 31 75 L 26 55 L 22 40 Z"
                fill="#0D3520"
                stroke="#D4AF37"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                opacity="0.6"
              />

              {/* Mediterranean Sea Coast Label */}
              <text x="12" y="48" fill="#6EE7B7" fontSize="2.8" fontWeight="bold" opacity="0.7">
                {lang === 'ar' ? 'البحر المتوسط' : 'Mediterranean'}
              </text>

              {/* Major Highway Lines (M5 & Coast & Desert routes) */}
              {/* M5 Highway (Daraa - Damascus - Homs - Hama - Aleppo) */}
              <path
                d="M 35 84 L 35 72 L 40 54 L 40 45 L 47 28"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Coastal Highway (Tartous - Latakia) */}
              <path
                d="M 27 53 L 24 42"
                fill="none"
                stroke="#34D399"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Homs to Tartous Highway */}
              <path
                d="M 40 54 L 27 53"
                fill="none"
                stroke="#34D399"
                strokeWidth="1.2"
                strokeDasharray="1.5 1.5"
              />

              {/* Eastern Palmyra - Deir ez-Zor - Hasakah Line */}
              <path
                d="M 35 72 Q 55 60 76 52 L 82 22"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />

              {/* Animated Live Bus Indicators on Highway */}
              <circle cx="38" cy="62" r="1.4" fill="#E5C158" className="animate-ping" />
              <circle cx="38" cy="62" r="1.2" fill="#D4AF37" />

              <circle cx="26" cy="48" r="1.4" fill="#34D399" className="animate-ping" />
              <circle cx="26" cy="48" r="1.2" fill="#34D399" />

              {/* Governorates Pins */}
              {GOVERNORATES.map((gov) => {
                const isSelected = selectedGov.id === gov.id;
                return (
                  <g
                    key={gov.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedGov(gov)}
                  >
                    {isSelected && (
                      <circle
                        cx={gov.x}
                        cy={gov.y}
                        r="3.5"
                        fill="#D4AF37"
                        fillOpacity="0.3"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={gov.x}
                      cy={gov.y}
                      r={isSelected ? 2.2 : 1.6}
                      fill={isSelected ? '#D4AF37' : '#FFFFFF'}
                      stroke="#0D472B"
                      strokeWidth="0.8"
                      className="transition-all group-hover:scale-125"
                    />
                    <text
                      x={gov.x}
                      y={gov.y - 2.5}
                      textAnchor="middle"
                      fill={isSelected ? '#D4AF37' : '#FFFFFF'}
                      fontSize="2.6"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-sm select-none"
                    >
                      {lang === 'ar' ? gov.nameAr : gov.nameEn}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Floating Tag */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-2 px-3 text-[10px] text-white border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#D4AF37]" />
                <span>{lang === 'ar' ? 'الأوتوستراد الدولي M5 (دمشق-حلب)' : 'M5 Highway (Damascus-Aleppo)'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#34D399]" />
                <span>{lang === 'ar' ? 'طريق الساحل (طرطوس-اللاذقية)' : 'Coastal Route (Tartous-Latakia)'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#FBBF24] border-t border-dashed" />
                <span>{lang === 'ar' ? 'محور تدمر والفرات (دير الزور والحسكة)' : 'Eastern Desert Highway'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Governorate & Active Departures */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase bg-emerald-900/10 px-2 py-0.5 rounded">
                  {lang === 'ar' ? `المنطقة: ${selectedGov.zone}` : `Region: ${selectedGov.zone}`}
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                  {lang === 'ar' ? selectedGov.nameAr : selectedGov.nameEn}
                </h3>
                <div className="text-xs text-[#0D472B] font-bold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? selectedGov.centerGarageAr : selectedGov.centerGarageEn}</span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0D472B] font-black text-xl">
                {selectedGov.nameAr.slice(0, 1)}
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {lang === 'ar' ? selectedGov.descriptionAr : selectedGov.descriptionEn}
            </p>

            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div>
                <span className="font-bold">{lang === 'ar' ? 'أبرز المعالم:' : 'Key Landmark:'} </span>
                <span>{lang === 'ar' ? selectedGov.landmarkAr : selectedGov.landmarkEn}</span>
              </div>
            </div>

            {/* Departures from this Hub */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{lang === 'ar' ? 'الرحلات المتاحة من هذه المحطة:' : 'Available Departures:'}</span>
                <span className="text-[#0D472B] font-bold">{departuresFromSelected.length} {lang === 'ar' ? 'رحلات' : 'trips'}</span>
              </h4>

              {departuresFromSelected.length === 0 ? (
                <div className="p-4 rounded-xl bg-gray-50 text-center text-xs text-gray-500">
                  {lang === 'ar' ? 'لا توجد رحلات مجدولة مباشرة اليوم من هذه المحطة.' : 'No direct departures today.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {departuresFromSelected.map((dep) => {
                    const toGov = GOVERNORATES.find((g) => g.id === dep.toGovernorateId);
                    return (
                      <div
                        key={dep.id}
                        className="p-3 rounded-xl bg-gray-50 hover:bg-emerald-50/70 border border-gray-200 transition-all flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{lang === 'ar' ? toGov?.nameAr : toGov?.nameEn}</span>
                            <span className="text-gray-400 font-normal">({dep.departureTime})</span>
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {dep.operatorNameAr} • {dep.durationHours} {lang === 'ar' ? 'ساعات' : 'hrs'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#0D472B]">
                            {formatSYP(dep.priceSYP)} ل.س
                          </span>
                          <button
                            onClick={() => onSelectRoute(dep.fromGovernorateId, dep.toGovernorateId)}
                            className="px-2.5 py-1 rounded-lg bg-[#0D472B] text-[#D4AF37] font-bold hover:bg-[#0A3822] transition-colors"
                          >
                            {lang === 'ar' ? 'احجز' : 'Book'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bus Garages Directory Shortcut */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#0D472B]" />
              <span>{lang === 'ar' ? 'دليل كراجات البولمان المركزية' : 'Central Stations Directory'}</span>
            </h4>

            <div className="space-y-2 text-xs">
              {BUS_GARAGES.slice(0, 3).map((garage) => (
                <div key={garage.id} className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">
                      {lang === 'ar' ? garage.nameAr : garage.nameEn}
                    </div>
                    <div className="text-[10px] text-gray-500">{garage.addressAr}</div>
                  </div>
                  <a
                    href={`tel:${garage.phone.replace(/\s+/g, '')}`}
                    className="font-mono text-xs font-bold text-[#0D472B] hover:underline"
                  >
                    {garage.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
