import React, { useState } from 'react';
import { TRIP_SCHEDULES, GOVERNORATES, BUS_OPERATORS } from '../data/syriaData';
import { Language, TripSchedule } from '../types';
import { 
  Compass, 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Bus, 
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface RoutesTimetableProps {
  lang: Language;
  onBookTrip: (trip: TripSchedule) => void;
}

export const RoutesTimetable: React.FC<RoutesTimetableProps> = ({
  lang,
  onBookTrip,
}) => {
  const [filterGov, setFilterGov] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  const filteredSchedules = TRIP_SCHEDULES.filter((trip) => {
    if (filterGov !== 'all' && trip.fromGovernorateId !== filterGov && trip.toGovernorateId !== filterGov) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        trip.operatorNameAr.toLowerCase().includes(q) ||
        trip.operatorNameEn.toLowerCase().includes(q) ||
        trip.fromGarageAr.toLowerCase().includes(q) ||
        trip.toGarageAr.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D472B] border border-emerald-200 text-xs font-bold mb-3">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{lang === 'ar' ? 'جدول المواعيد الموحد' : 'Unified Intercity Timetable'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {lang === 'ar' ? 'مواعيد وأسعار رحلات البولمان بين المحافظات' : 'Schedules & Fares Across Syrian Governorates'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {lang === 'ar'
            ? 'تحديث مباشر على مدار الساعة لرحلات النقل البري لكافة الشركات المعتمدة بالليرة السورية.'
            : 'Real-time schedule directory across all certified Syrian operators in Syrian Pounds (SYP).'}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-gray-400 absolute top-3 right-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث باسم الشركة، الكراج، المدينة...' : 'Search operator, station...'}
            className="w-full bg-[#F8F9F8] border border-gray-200 rounded-xl py-2 pr-9 pl-3 text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#0D472B]"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600 whitespace-nowrap">
            {lang === 'ar' ? 'تصفية حسب المحافظة:' : 'Filter by Governorate:'}
          </span>
          <select
            value={filterGov}
            onChange={(e) => setFilterGov(e.target.value)}
            className="bg-[#F8F9F8] border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#0D472B]"
          >
            <option value="all">{lang === 'ar' ? 'جميع المحافظات (14)' : 'All Governorates (14)'}</option>
            {GOVERNORATES.map((g) => (
              <option key={g.id} value={g.id}>
                {lang === 'ar' ? g.nameAr : g.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0D472B] text-white border-b border-[#D4AF37]/30">
              <tr>
                <th className="p-4 font-bold">{lang === 'ar' ? 'الشركة المشغلة' : 'Operator'}</th>
                <th className="p-4 font-bold">{lang === 'ar' ? 'المسار والكراج' : 'Route & Stations'}</th>
                <th className="p-4 font-bold">{lang === 'ar' ? 'وقت الانطلاق' : 'Departure'}</th>
                <th className="p-4 font-bold">{lang === 'ar' ? 'المدة والمسافة' : 'Duration & Dist.'}</th>
                <th className="p-4 font-bold">{lang === 'ar' ? 'فئة الحافلة' : 'Class'}</th>
                <th className="p-4 font-bold">{lang === 'ar' ? 'الأجرة (ل.س)' : 'Fare (SYP)'}</th>
                <th className="p-4 font-bold text-center">{lang === 'ar' ? 'الحجز' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchedules.map((trip) => {
                const fromG = GOVERNORATES.find((g) => g.id === trip.fromGovernorateId);
                const toG = GOVERNORATES.find((g) => g.id === trip.toGovernorateId);
                return (
                  <tr key={trip.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{trip.operatorNameAr}</div>
                      <div className="text-[10px] text-gray-500">{trip.busModel}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <span>{fromG?.nameAr}</span>
                        <span className="text-[#D4AF37]">←</span>
                        <span>{toG?.nameAr}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 truncate max-w-xs">
                        {trip.fromGarageAr} ← {trip.toGarageAr}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-base text-gray-900">{trip.departureTime}</div>
                      <div className="text-[10px] text-gray-500">
                        {lang === 'ar' ? 'وصول تقريبي:' : 'ETA:'} {trip.arrivalTime}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-800">{trip.durationHours} {lang === 'ar' ? 'ساعات' : 'hrs'}</div>
                      <div className="text-[10px] text-gray-500">{trip.distanceKm} كم</div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/15 text-[#967515] uppercase border border-[#D4AF37]/30">
                        {trip.busClass.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-black text-sm text-[#0D472B]">
                        {formatSYP(trip.priceSYP)} <span className="text-[10px] font-bold text-gray-500">ل.س</span>
                      </div>
                      <div className="text-[9px] text-emerald-600 font-semibold">30 كغ مجاناً</div>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => onBookTrip(trip)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0D472B] hover:bg-[#0A3822] text-[#D4AF37] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 mx-auto"
                      >
                        <span>{lang === 'ar' ? 'حجز' : 'Book'}</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
