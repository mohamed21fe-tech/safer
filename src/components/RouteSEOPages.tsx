import React, { useState } from 'react';
import { Language, TripSchedule } from '../types';
import { TRIP_SCHEDULES } from '../data/syriaData';
import { 
  Compass, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Coffee, 
  Sparkles, 
  ShieldCheck, 
  Luggage, 
  Star,
  Bus,
  CheckCircle2
} from 'lucide-react';

interface RouteSEOPagesProps {
  lang: Language;
  onBookRoute: (fromGovId: string, toGovId: string) => void;
}

interface SyrianCorridorInfo {
  id: string;
  fromId: string;
  toId: string;
  titleAr: string;
  titleEn: string;
  highway: string;
  distanceKm: number;
  durationHours: number;
  dailyTripsCount: number;
  startingPriceSYP: number;
  scenicHighlightsAr: string[];
  scenicHighlightsEn: string[];
  restStopsAr: string[];
  restStopsEn: string[];
  descriptionAr: string;
  descriptionEn: string;
}

const POPULAR_CORRIDORS: SyrianCorridorInfo[] = [
  {
    id: 'damascus-aleppo',
    fromId: 'damascus',
    toId: 'aleppo',
    titleAr: 'دمشق ⟵ حلب (شريان الأوتوستراد الدولي M5)',
    titleEn: 'Damascus to Aleppo (M5 International Highway)',
    highway: 'M5 Highway',
    distanceKm: 355,
    durationHours: 4.5,
    dailyTripsCount: 28,
    startingPriceSYP: 35000,
    scenicHighlightsAr: ['جبال القلمون', 'بساتين حمص وقراها', 'سهول حماة ونواعيرها التاريخية', 'مدخل حلب الشهباء وقلعتها'],
    scenicHighlightsEn: ['Qalamoun Mountains', 'Homs Plains', 'Historical Hama Norias', 'Aleppo Citadel Skyline'],
    restStopsAr: ['استراحة النبك الدولية (طريق دمشق)', 'استراحة طيبة (بين حمص وحماة)', 'استراحة خان شيخون'],
    restStopsEn: ['Al-Nabk Rest House', 'Taybeh Plaza', 'Khan Shaykhun Services'],
    descriptionAr: 'أهم شريان بري تجاري وسياحي في سورية يربط العاصمة دمشق بالعاصمة الاقتصادية حلب. حافلات حديثة تنطلق كل نصف ساعة من كراجات حرستا إلى كراج الراموسة.',
    descriptionEn: 'The economic backbone connecting the capital Damascus to Aleppo via modern luxury coaches departing every 30 minutes.',
  },
  {
    id: 'damascus-latakia',
    fromId: 'damascus',
    toId: 'latakia',
    titleAr: 'دمشق ⟵ اللاذقية (عروس الساحل السوري)',
    titleEn: 'Damascus to Latakia (Syrian Mediterranean Coast)',
    highway: 'M1 / Coastal Corridor',
    distanceKm: 348,
    durationHours: 4.5,
    dailyTripsCount: 22,
    startingPriceSYP: 36000,
    scenicHighlightsAr: ['إطلالات جبال الساحل الخضراء', 'قرب قلعة المرقب وقلعة الحصن', 'شواطئ البحر الأبيض المتوسط'],
    scenicHighlightsEn: ['Green Coastal Mountain Ranges', 'Views near Krak des Chevaliers', 'Mediterranean Coastline'],
    restStopsAr: ['استراحة قارة', 'استراحة تلكلخ الساحلية', 'استراحة بانياس'],
    restStopsEn: ['Qarah Stop', 'Talkalakh Services', 'Baniyas Coastal Stop'],
    descriptionAr: 'رحلة خلابة من بساتين دمشق عبر ممر حمص وصولاً إلى نسيم شواطئ اللاذقية وكراج الفاروس مع ضيافة مميزة على متن البولمان.',
    descriptionEn: 'A breathtaking scenic drive from Damascus through the Homs gap down to the Mediterranean shores of Latakia.',
  },
  {
    id: 'damascus-tartous',
    fromId: 'damascus',
    toId: 'tartous',
    titleAr: 'دمشق ⟵ طرطوس (ميناء الفينيقيين وجزيرة أرواد)',
    titleEn: 'Damascus to Tartous (Ancient Phoenician Port)',
    highway: 'M1 Highway',
    distanceKm: 255,
    durationHours: 3.5,
    dailyTripsCount: 20,
    startingPriceSYP: 30000,
    scenicHighlightsAr: ['سهل عكار الخصيب', 'بساتين الحمضيات والزيتون', 'كورنيش طرطوس البحري'],
    scenicHighlightsEn: ['Fertile Akkar Plains', 'Citrus & Olive Groves', 'Tartous Seafront Corniche'],
    restStopsAr: ['استراحة دير عطية', 'استراحة وادي النضارى'],
    restStopsEn: ['Deir Atiyah Oasis', 'Wadi Al-Nasara Stop'],
    descriptionAr: 'المسار الأسرع للوصول إلى الساحل السوري، متصل مباشرة بميناء جزيرة أرواد والمصايف الجبلية كصافيتا ومشتى الحلو.',
    descriptionEn: 'Fast and comfortable connection to the port city of Tartous, Arwad Island ferry, and coastal mountain resorts.',
  },
  {
    id: 'damascus-homs',
    fromId: 'damascus',
    toId: 'homs',
    titleAr: 'دمشق ⟵ حمص (قلب سورية النابض)',
    titleEn: 'Damascus to Homs (Heart of Syria)',
    highway: 'M5 Highway',
    distanceKm: 160,
    durationHours: 2.2,
    dailyTripsCount: 35,
    startingPriceSYP: 22000,
    scenicHighlightsAr: ['هضاب معلولا وصيدنايا الأثرية', 'قلعة الحصن الشامخة', 'بساتين العاصي'],
    scenicHighlightsEn: ['Historic Maaloula & Saidnaya Hills', 'Krak des Chevaliers vistas', 'Orontes river groves'],
    restStopsAr: ['استراحة النبك (حلويات وهريسة النبك الشهيرة)'],
    restStopsEn: ['Al-Nabk Famous Harisa & Sweet Houses'],
    descriptionAr: 'رحلة سريعة مدتها ساعتان وربع فقط تربط دمشق بمدينة حمص عبر حافلات مريحة مزودة بتكييف كامل وشواحن هواتف.',
    descriptionEn: 'A rapid 2-hour trip connecting Damascus to Homs with departures round the clock.',
  },
];

export const RouteSEOPages: React.FC<RouteSEOPagesProps> = ({
  lang,
  onBookRoute,
}) => {
  const [selectedCorridor, setSelectedCorridor] = useState<SyrianCorridorInfo>(POPULAR_CORRIDORS[0]);

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D472B] border border-emerald-200 text-xs font-bold mb-3">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{lang === 'ar' ? 'أشهر مسارات السفر بين المحافظات' : 'Popular Intercity Corridors'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {lang === 'ar' ? 'دليل خطوط البولمان الرئيسية في سورية' : 'Major Syrian Coach Routes & Travel Guides'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {lang === 'ar'
            ? 'اكتشف المسافة، زمن الرحلة، الاستراحات المعتمدة على الطرق الدولية، والمعالم السياحية في طريقك.'
            : 'Detailed itineraries, highway distances, licensed road stops, and scenic points across Syria.'}
        </p>
      </div>

      {/* Corridor Selector Chips */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-6">
        {POPULAR_CORRIDORS.map((c) => {
          const isActive = selectedCorridor.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCorridor(c)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#0D472B] text-[#D4AF37] border-[#0D472B] shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {lang === 'ar' ? c.titleAr : c.titleEn}
            </button>
          );
        })}
      </div>

      {/* Corridor Detailed Feature Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase">
              <span>{selectedCorridor.highway}</span>
              <span>•</span>
              <span>{selectedCorridor.dailyTripsCount} {lang === 'ar' ? 'رحلة يومياً' : 'daily departures'}</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {lang === 'ar' ? selectedCorridor.titleAr : selectedCorridor.titleEn}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left md:text-right">
              <div className="text-xs text-gray-400 font-bold">{lang === 'ar' ? 'تبدأ الأسعار من' : 'Starting from'}</div>
              <div className="text-2xl font-black text-[#0D472B]">
                {formatSYP(selectedCorridor.startingPriceSYP)} <span className="text-xs font-bold text-gray-600">ل.س</span>
              </div>
            </div>

            <button
              onClick={() => onBookRoute(selectedCorridor.fromId, selectedCorridor.toId)}
              className="px-6 py-3 rounded-2xl bg-linear-to-r from-[#0D472B] to-[#125B37] text-[#D4AF37] font-bold text-xs shadow-md hover:from-[#0A3822] hover:to-[#0D472B] transition-all flex items-center gap-2 border border-[#D4AF37]/40"
            >
              <span>{lang === 'ar' ? 'احجز هذا الخط الآن' : 'Book This Route'}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#F8F9F8] p-4 rounded-2xl border border-gray-200 text-xs">
            <div className="text-gray-400 font-bold mb-1">{lang === 'ar' ? 'المسافة الإجمالية' : 'Distance'}</div>
            <div className="text-lg font-black text-gray-900">{selectedCorridor.distanceKm} كم</div>
          </div>
          <div className="bg-[#F8F9F8] p-4 rounded-2xl border border-gray-200 text-xs">
            <div className="text-gray-400 font-bold mb-1">{lang === 'ar' ? 'متوسط زمن الرحلة' : 'Travel Time'}</div>
            <div className="text-lg font-black text-gray-900">{selectedCorridor.durationHours} {lang === 'ar' ? 'ساعات' : 'hours'}</div>
          </div>
          <div className="bg-[#F8F9F8] p-4 rounded-2xl border border-gray-200 text-xs">
            <div className="text-gray-400 font-bold mb-1">{lang === 'ar' ? 'الوزن المجاني المسموح' : 'Baggage Allowance'}</div>
            <div className="text-lg font-black text-emerald-800">30 كغ مجاناً</div>
          </div>
          <div className="bg-[#F8F9F8] p-4 rounded-2xl border border-gray-200 text-xs">
            <div className="text-gray-400 font-bold mb-1">{lang === 'ar' ? 'الشركات المشغلة' : 'Operators'}</div>
            <div className="text-lg font-black text-gray-900">قدموس، الأهلية، الهرم</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {lang === 'ar' ? selectedCorridor.descriptionAr : selectedCorridor.descriptionEn}
        </p>

        {/* Scenic Highlights & Highway Rest Stops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Scenic Highlights */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-3">
            <h4 className="text-xs font-bold text-[#0D472B] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'معالم ومناظر طبيعية على المسار:' : 'Scenic Highlights along the Way:'}</span>
            </h4>
            <div className="space-y-2 text-xs text-gray-700">
              {(lang === 'ar' ? selectedCorridor.scenicHighlightsAr : selectedCorridor.scenicHighlightsEn).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D472B]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rest Stops */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'الاستراحات المعتمدة وخدمات الطريق:' : 'Authorized Rest Stops & Plaza:'}</span>
            </h4>
            <div className="space-y-2 text-xs text-gray-700">
              {(lang === 'ar' ? selectedCorridor.restStopsAr : selectedCorridor.restStopsEn).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
