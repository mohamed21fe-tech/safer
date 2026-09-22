import React, { useState, useMemo } from 'react';
import { TripSchedule, Language } from '../types';
import { BUS_OPERATORS, GOVERNORATES } from '../data/syriaData';
import { 
  Clock, 
  MapPin, 
  Wifi, 
  Zap, 
  Wind, 
  Coffee, 
  Star, 
  ShieldCheck, 
  Filter, 
  ArrowUpDown,
  ChevronRight,
  Bus,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface TripResultsProps {
  trips: TripSchedule[];
  lang: Language;
  fromGovernorateId: string;
  toGovernorateId: string;
  travelDate: string;
  passengersCount: number;
  onSelectTrip: (trip: TripSchedule) => void;
  onModifySearch: () => void;
}

export const TripResults: React.FC<TripResultsProps> = ({
  trips,
  lang,
  fromGovernorateId,
  toGovernorateId,
  travelDate,
  passengersCount,
  onSelectTrip,
  onModifySearch,
}) => {
  // Filter States
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [classFilter, setClassFilter] = useState<'all' | 'vip' | 'first' | 'express'>('all');
  const [maxPriceSYP, setMaxPriceSYP] = useState<number>(250000);
  const [sortBy, setSortBy] = useState<'departure' | 'price_asc' | 'price_desc' | 'duration' | 'rating'>('departure');

  const fromGov = GOVERNORATES.find((g) => g.id === fromGovernorateId) || GOVERNORATES[0];
  const toGov = GOVERNORATES.find((g) => g.id === toGovernorateId) || GOVERNORATES[2];

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  const toggleOperator = (opId: string) => {
    setSelectedOperators((prev) =>
      prev.includes(opId) ? prev.filter((id) => id !== opId) : [...prev, opId]
    );
  };

  // Filter & Sort computation
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Operator filter
      if (selectedOperators.length > 0 && !selectedOperators.includes(trip.operatorId)) {
        return false;
      }

      // Class filter
      if (classFilter !== 'all' && trip.busClass !== classFilter) {
        return false;
      }

      // Max price
      if (trip.priceSYP > maxPriceSYP) {
        return false;
      }

      // Time filter (Morning: 05:00-11:59, Afternoon: 12:00-17:59, Evening: 18:00-23:59)
      const depHour = parseInt(trip.departureTime.split(':')[0], 10);
      if (timeFilter === 'morning' && (depHour < 5 || depHour >= 12)) return false;
      if (timeFilter === 'afternoon' && (depHour < 12 || depHour >= 18)) return false;
      if (timeFilter === 'evening' && (depHour < 18 || depHour >= 24)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'departure') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      if (sortBy === 'price_asc') {
        return a.priceSYP - b.priceSYP;
      }
      if (sortBy === 'price_desc') {
        return b.priceSYP - a.priceSYP;
      }
      if (sortBy === 'duration') {
        return a.durationHours - b.durationHours;
      }
      if (sortBy === 'rating') {
        const opA = BUS_OPERATORS.find((o) => o.id === a.operatorId)?.rating || 4.5;
        const opB = BUS_OPERATORS.find((o) => o.id === b.operatorId)?.rating || 4.5;
        return opB - opA;
      }
      return 0;
    });
  }, [trips, selectedOperators, classFilter, maxPriceSYP, timeFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Route Header Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-emerald-900/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D472B] uppercase tracking-wider mb-1">
            <span>{travelDate}</span>
            <span>•</span>
            <span>{passengersCount} {lang === 'ar' ? (passengersCount === 1 ? 'مسافر' : 'مسافرين') : (passengersCount === 1 ? 'Passenger' : 'Passengers')}</span>
            <span>•</span>
            <span className="text-[#D4AF37] font-bold">{filteredTrips.length} {lang === 'ar' ? 'رحلات متوفرة' : 'trips available'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span>{lang === 'ar' ? fromGov.nameAr : fromGov.nameEn}</span>
            <span className="text-[#D4AF37]">←</span>
            <span>{lang === 'ar' ? toGov.nameAr : toGov.nameEn}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'ar' 
              ? `من ${fromGov.centerGarageAr} إلى ${toGov.centerGarageAr}` 
              : `From ${fromGov.centerGarageEn} to ${toGov.centerGarageEn}`}
          </p>
        </div>

        <button
          onClick={onModifySearch}
          className="self-start md:self-center px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0D472B] text-xs font-bold transition-all border border-emerald-200 flex items-center gap-2"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'تعديل مسار البحث' : 'Modify Search'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0D472B]" />
                <span>{lang === 'ar' ? 'تصفية النتائج' : 'Filter Results'}</span>
              </h3>
              {(selectedOperators.length > 0 || timeFilter !== 'all' || classFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedOperators([]);
                    setTimeFilter('all');
                    setClassFilter('all');
                    setMaxPriceSYP(250000);
                  }}
                  className="text-xs text-[#0D472B] hover:underline font-semibold"
                >
                  {lang === 'ar' ? 'إعادة ضبط' : 'Reset'}
                </button>
              )}
            </div>

            {/* Departure Time Slots */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {lang === 'ar' ? 'وقت الانطلاق' : 'Departure Time'}
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                  { id: 'morning', labelAr: 'صباحاً (05-12)', labelEn: 'Morning' },
                  { id: 'afternoon', labelAr: 'ظهراً (12-18)', labelEn: 'Afternoon' },
                  { id: 'evening', labelAr: 'مساءً (18-24)', labelEn: 'Evening' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTimeFilter(item.id as any)}
                    className={`py-1.5 px-2 rounded-lg font-medium text-center border transition-all ${
                      timeFilter === item.id
                        ? 'bg-[#0D472B] text-white border-[#0D472B]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {lang === 'ar' ? item.labelAr : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Bus Class */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {lang === 'ar' ? 'فئة الحافلة' : 'Bus Class'}
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', labelAr: 'جميع الفئات', labelEn: 'All Classes' },
                  { id: 'vip', labelAr: 'VIP درجة رجال الأعمال', labelEn: 'VIP Executive' },
                  { id: 'first', labelAr: 'درجة أولى مريحة', labelEn: 'First Class' },
                  { id: 'express', labelAr: 'إكسبرس مباشر', labelEn: 'Express' },
                ].map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-emerald-50/50"
                  >
                    <input
                      type="radio"
                      name="busClass"
                      checked={classFilter === c.id}
                      onChange={() => setClassFilter(c.id as any)}
                      className="text-[#0D472B] focus:ring-[#0D472B]"
                    />
                    <span className="text-gray-800 font-medium">
                      {lang === 'ar' ? c.labelAr : c.labelEn}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bus Operators */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {lang === 'ar' ? 'شركة البولمان' : 'Bus Operators'}
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {BUS_OPERATORS.map((op) => {
                  const isChecked = selectedOperators.includes(op.id);
                  return (
                    <label
                      key={op.id}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOperator(op.id)}
                          className="rounded text-[#0D472B] focus:ring-[#0D472B]"
                        />
                        <span className="text-gray-800 font-medium">
                          {lang === 'ar' ? op.nameAr.replace('شركة ', '') : op.nameEn}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        {op.rating}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-gray-700">{lang === 'ar' ? 'الحد الأقصى للسعر:' : 'Max Price:'}</span>
                <span className="font-bold text-[#0D472B]">{formatSYP(maxPriceSYP)} {lang === 'ar' ? 'ل.س' : 'SYP'}</span>
              </div>
              <input
                type="range"
                min={40000}
                max={250000}
                step={5000}
                value={maxPriceSYP}
                onChange={(e) => setMaxPriceSYP(Number(e.target.value))}
                className="w-full accent-[#0D472B] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results Stream */}
        <div className="lg:col-span-9 space-y-4">
          {/* Sorting Bar */}
          <div className="bg-white rounded-xl p-3 shadow-xs border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#0D472B]" />
              <span>{lang === 'ar' ? 'ترتيب حسب:' : 'Sort by:'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'departure', labelAr: 'وقت المغادرة', labelEn: 'Departure' },
                { id: 'price_asc', labelAr: 'الأقل سعراً', labelEn: 'Lowest Fare' },
                { id: 'price_desc', labelAr: 'الأعلى سعراً', labelEn: 'Highest Fare' },
                { id: 'duration', labelAr: 'المدة الأسرع', labelEn: 'Fastest' },
                { id: 'rating', labelAr: 'تقييم الشركة', labelEn: 'Top Rated' },
              ].map((sortItem) => (
                <button
                  key={sortItem.id}
                  onClick={() => setSortBy(sortItem.id as any)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    sortBy === sortItem.id
                      ? 'bg-[#0D472B] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang === 'ar' ? sortItem.labelAr : sortItem.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
              <Bus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {lang === 'ar' ? 'لا توجد رحلات تطابق معايير التصفية المختارة' : 'No trips match your filter criteria'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {lang === 'ar' 
                  ? 'جرب توسيع نطاق السعر أو إزالة بعض الفلاتر لعرض كافة الرحلات المتاحة.'
                  : 'Try resetting the filters to view all scheduled departures.'}
              </p>
              <button
                onClick={() => {
                  setSelectedOperators([]);
                  setTimeFilter('all');
                  setClassFilter('all');
                  setMaxPriceSYP(250000);
                }}
                className="px-4 py-2 rounded-xl bg-[#0D472B] text-[#D4AF37] font-bold text-xs"
              >
                {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Clear All Filters'}
              </button>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const op = BUS_OPERATORS.find((o) => o.id === trip.operatorId);
              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-gray-200 hover:border-[#D4AF37]/50 relative group"
                >
                  {/* Top Operator & Amenities Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-xs"
                        style={{ backgroundColor: op?.logoBg || '#0D472B' }}
                      >
                        {trip.operatorNameAr.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {lang === 'ar' ? trip.operatorNameAr : trip.operatorNameEn}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/15 text-[#967515] border border-[#D4AF37]/30 uppercase">
                            {trip.busClass.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="text-xs text-amber-600 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {op?.rating || 4.7}
                          </span>
                          <span>•</span>
                          <span>{trip.busModel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amenities Badges */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      {trip.amenities.includes('wifi') && (
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-[#0D472B]" title="WiFi Free">
                          <Wifi className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {trip.amenities.includes('usb') && (
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-[#0D472B]" title="USB Fast Charging">
                          <Zap className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {trip.amenities.includes('ac') && (
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-[#0D472B]" title="Air Conditioning">
                          <Wind className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {trip.amenities.includes('snacks') && (
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-[#0D472B]" title="Complimentary Refreshments">
                          <Coffee className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Route & Time Grid */}
                  <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Departure & Arrival Visual Journey */}
                    <div className="md:col-span-8 flex items-center justify-between">
                      {/* Departure */}
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
                          {trip.departureTime}
                        </div>
                        <div className="text-xs font-bold text-gray-700 mt-0.5">
                          {lang === 'ar' ? fromGov.nameAr : fromGov.nameEn}
                        </div>
                        <div className="text-[11px] text-gray-500 max-w-[130px] truncate" title={trip.fromGarageAr}>
                          {lang === 'ar' ? trip.fromGarageAr : trip.fromGarageEn}
                        </div>
                      </div>

                      {/* Line with Duration & Highway */}
                      <div className="flex-1 px-4 flex flex-col items-center">
                        <div className="text-[10px] font-semibold text-gray-400 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{trip.durationHours} {lang === 'ar' ? 'ساعات' : 'hrs'}</span>
                          <span>•</span>
                          <span>{trip.distanceKm} {lang === 'ar' ? 'كم' : 'km'}</span>
                        </div>
                        <div className="w-full relative flex items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0D472B] border-2 border-white shadow-xs" />
                          <div className="flex-1 h-[2px] bg-linear-to-r from-[#0D472B] via-[#D4AF37] to-[#0D472B] relative">
                            <Bus className="w-3.5 h-3.5 text-[#0D472B] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                          </div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] border-2 border-white shadow-xs" />
                        </div>
                        <div className="text-[10px] text-emerald-700 font-medium mt-1">
                          {lang === 'ar' ? 'مباشر بدون تبديل' : 'Direct Service'}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="text-left">
                        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
                          {trip.arrivalTime}
                        </div>
                        <div className="text-xs font-bold text-gray-700 mt-0.5">
                          {lang === 'ar' ? toGov.nameAr : toGov.nameEn}
                        </div>
                        <div className="text-[11px] text-gray-500 max-w-[130px] truncate" title={trip.toGarageAr}>
                          {lang === 'ar' ? trip.toGarageAr : trip.toGarageEn}
                        </div>
                      </div>
                    </div>

                    {/* Price & Booking Action */}
                    <div className="md:col-span-4 md:border-r md:border-gray-100 md:pr-6 flex md:flex-col items-center md:items-end justify-between gap-3">
                      <div className="text-left md:text-right">
                        <div className="text-xs text-gray-500 font-medium">
                          {lang === 'ar' ? 'سعر المقعد الواحد' : 'Per Passenger'}
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-[#0D472B]">
                          {formatSYP(trip.priceSYP)}{' '}
                          <span className="text-xs font-bold text-gray-600">
                            {lang === 'ar' ? 'ل.س' : 'SYP'}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>30 كغ حقائب مجاناً</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                        <button
                          onClick={() => onSelectTrip(trip)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-linear-to-r from-[#0D472B] to-[#125B37] hover:from-[#0A3822] hover:to-[#0D472B] text-[#D4AF37] font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                        >
                          <span>{lang === 'ar' ? 'اختيار المقاعد' : 'Select Seats'}</span>
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {trip.availableSeats} {lang === 'ar' ? 'مقاعد متبقية' : 'seats left'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
