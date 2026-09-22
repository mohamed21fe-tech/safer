import React, { useState } from 'react';
import { TripSchedule, Language, TicketBooking } from '../types';
import { TRIP_SCHEDULES, BUS_OPERATORS, GOVERNORATES } from '../data/syriaData';
import { 
  BarChart3, 
  Bus, 
  Users, 
  DollarSign, 
  Plus, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Settings, 
  TrendingUp,
  Download,
  Calendar,
  Clock,
  Printer
} from 'lucide-react';

interface AdminDashboardProps {
  lang: Language;
  bookings: TicketBooking[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  bookings,
}) => {
  const [trips, setTrips] = useState<TripSchedule[]>(TRIP_SCHEDULES);
  const [selectedTripForManifest, setSelectedTripForManifest] = useState<TripSchedule>(TRIP_SCHEDULES[0]);
  const [adminTab, setAdminTab] = useState<'analytics' | 'schedules' | 'manifest' | 'fleet'>('analytics');
  const [newPrice, setNewPrice] = useState<number>(35000);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  // Aggregated Analytics
  const totalDailyRevenueSYP = trips.reduce((acc, t) => acc + (t.totalSeats - t.availableSeats) * t.priceSYP, 0);
  const totalSeatsDeparting = trips.reduce((acc, t) => acc + t.totalSeats, 0);
  const bookedSeatsCount = trips.reduce((acc, t) => acc + (t.totalSeats - t.availableSeats), 0);
  const occupancyRate = Math.round((bookedSeatsCount / totalSeatsDeparting) * 100);

  const handleUpdatePrice = (tripId: string) => {
    setTrips(trips.map((t) => (t.id === tripId ? { ...t, priceSYP: newPrice } : t)));
    setShowPriceModal(false);
    setEditingTripId(null);
  };

  const handleCancelTrip = (tripId: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من إلغاء هذه الرحلة في النظام المركزي؟' : 'Are you sure you want to cancel this trip?')) {
      setTrips(trips.filter((t) => t.id !== tripId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Title Bar */}
      <div className="bg-linear-to-r from-[#0D472B] to-[#082D1B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#D4AF37]/40 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
              <Settings className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'البوابة المركزية لإدارة عمليات النقل' : 'Central Transit Operations Admin'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'ar' ? 'لوحة تحكم مشغلي البولمان السوري' : 'Syrian Intercity Bus Admin Portal'}
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1">
              {lang === 'ar'
                ? 'إدارة الجداول، مراقبة الإيرادات اليومية بالليرة السورية، إصدار قوائم الركاب (المانيفست)، وتعديل تسعيرة الوقود.'
                : 'Manage trip schedules, daily SYP revenue, passenger manifests, and fleet status.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-emerald-200 border border-white/20">
              {lang === 'ar' ? 'النظام: متصل ومحدّث' : 'System: Online'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
            <span>{lang === 'ar' ? 'إجمالي الإيرادات اليومية' : 'Daily Revenue'}</span>
            <DollarSign className="w-4 h-4 text-[#0D472B]" />
          </div>
          <div className="text-2xl font-black text-[#0D472B]">
            {formatSYP(totalDailyRevenueSYP)} <span className="text-xs font-bold text-gray-500">ل.س</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% {lang === 'ar' ? 'مقارنة بالأمس' : 'vs yesterday'}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
            <span>{lang === 'ar' ? 'نسبة الإشغال الإجمالية' : 'Fleet Occupancy'}</span>
            <Users className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {occupancyRate}%
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {bookedSeatsCount} / {totalSeatsDeparting} {lang === 'ar' ? 'مقعد محجوز' : 'seats booked'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
            <span>{lang === 'ar' ? 'الرحلات النشطة اليوم' : 'Active Schedules'}</span>
            <Bus className="w-4 h-4 text-[#0D472B]" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {trips.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            {lang === 'ar' ? 'جميع المحافظات الـ 14 مغطاة' : 'All 14 Governorates'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
            <span>{lang === 'ar' ? 'جاهزية الأسطول' : 'Fleet Status'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            98.5%
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {lang === 'ar' ? 'جاهزية فنية وفحص دوري' : 'Periodic maintenance pass'}
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-2 sm:gap-4 overflow-x-auto text-sm font-bold">
        {[
          { id: 'analytics', labelAr: 'مؤشرات الأداء والإيرادات', labelEn: 'Analytics & Revenue', icon: BarChart3 },
          { id: 'schedules', labelAr: 'إدارة الرحلات والتسعير', labelEn: 'Schedules & Fares', icon: Calendar },
          { id: 'manifest', labelAr: 'مانيفست الركاب وقوائم الصعود', labelEn: 'Passenger Manifest', icon: FileSpreadsheet },
          { id: 'fleet', labelAr: 'مراقبة الأسطول والبولمانات', labelEn: 'Fleet Monitor', icon: Bus },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-[#0D472B] text-[#0D472B]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0D472B]' : 'text-gray-400'}`} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Analytics */}
      {adminTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0D472B]" />
              <span>{lang === 'ar' ? 'المسارات الأكثر طلباً بين المحافظات' : 'Most In-Demand Intercity Routes'}</span>
            </h3>

            <div className="space-y-4">
              {[
                { route: 'دمشق (حرستا) ← حلب (الراموسة)', percent: 92, revenue: 1250000, passengers: 210 },
                { route: 'دمشق (حرستا) ← اللاذقية (كراج الفاروس)', percent: 88, revenue: 980000, passengers: 175 },
                { route: 'دمشق (حرستا) ← طرطوس (كراج طرطوس الجديد)', percent: 84, revenue: 860000, passengers: 160 },
                { route: 'حلب (الراموسة) ← اللاذقية', percent: 79, revenue: 720000, passengers: 144 },
                { route: 'دمشق ← حمص (كراج البولمان)', percent: 75, revenue: 490000, passengers: 130 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-800">{item.route}</span>
                    <span className="text-[#0D472B]">{formatSYP(item.revenue)} ل.س ({item.percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#0D472B] to-[#D4AF37] rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              {lang === 'ar' ? 'توزيع وسائل الدفع' : 'Payment Methods Breakdown'}
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0D472B]">شام كاش (ShamCash)</div>
                  <div className="text-[10px] text-gray-500">48% من إجمالي العمليات</div>
                </div>
                <span className="font-black text-xs text-emerald-800">48%</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-800">سيريتل كاش (Syriatel)</div>
                  <div className="text-[10px] text-gray-500">28% من إجمالي العمليات</div>
                </div>
                <span className="font-black text-xs text-rose-800">28%</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-900">محفظة سفر (Safar Wallet)</div>
                  <div className="text-[10px] text-gray-500">16% مع كاش باك</div>
                </div>
                <span className="font-black text-xs text-amber-900">16%</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800">الدفع نقداً بالكراج</div>
                  <div className="text-[10px] text-gray-500">8% فقط</div>
                </div>
                <span className="font-black text-xs text-gray-800">8%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schedules & Price Adjustments */}
      {adminTab === 'schedules' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">
              {lang === 'ar' ? 'الجدول الميداني للرحلات النشطة' : 'Active Field Trip Schedules'}
            </h3>
            <button
              onClick={() => alert(lang === 'ar' ? 'فتح نموذج إضافة رحلة جديدة في الشبكة السورية' : 'Add new trip schedule')}
              className="px-3 py-1.5 rounded-xl bg-[#0D472B] text-[#D4AF37] font-bold text-xs flex items-center gap-1 hover:bg-[#0A3822]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة رحلة جديدة' : 'Add Trip'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3 font-bold">{lang === 'ar' ? 'المسار' : 'Route'}</th>
                  <th className="p-3 font-bold">{lang === 'ar' ? 'الشركة المشغلة' : 'Operator'}</th>
                  <th className="p-3 font-bold">{lang === 'ar' ? 'الانطلاق' : 'Time'}</th>
                  <th className="p-3 font-bold">{lang === 'ar' ? 'المقاعد' : 'Seats'}</th>
                  <th className="p-3 font-bold">{lang === 'ar' ? 'التسعيرة' : 'Price (SYP)'}</th>
                  <th className="p-3 font-bold text-center">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">
                      {t.fromGarageAr} ← {t.toGarageAr}
                    </td>
                    <td className="p-3 text-gray-600">{t.operatorNameAr}</td>
                    <td className="p-3 font-mono font-bold text-[#0D472B]">{t.departureTime}</td>
                    <td className="p-3">
                      <span className="font-bold text-emerald-800">{t.availableSeats}</span>
                      <span className="text-gray-400"> / {t.totalSeats}</span>
                    </td>
                    <td className="p-3 font-bold text-gray-900">
                      {formatSYP(t.priceSYP)} ل.س
                    </td>
                    <td className="p-3 text-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setEditingTripId(t.id);
                          setNewPrice(t.priceSYP);
                          setShowPriceModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold hover:bg-amber-100"
                      >
                        {lang === 'ar' ? 'تعديل السعر' : 'Edit Fare'}
                      </button>
                      <button
                        onClick={() => handleCancelTrip(t.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Passenger Manifest (Export for Conductor) */}
      {adminTab === 'manifest' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                {lang === 'ar' ? 'قائمة ركاب الرحلة (مانيفست الصعود)' : 'Trip Passenger Manifest'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'ar'
                  ? 'القائمة الرسمية المعتمدة لمرافقي الحافلات في كراجات الانطلاق.'
                  : 'Official conductor passenger verification roster.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTripForManifest.id}
                onChange={(e) => {
                  const t = trips.find((x) => x.id === e.target.value);
                  if (t) setSelectedTripForManifest(t);
                }}
                className="p-2 border border-gray-300 rounded-xl text-xs font-bold"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fromGarageAr} ← {t.toGarageAr} ({t.departureTime})
                  </option>
                ))}
              </select>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-[#0D472B] text-[#D4AF37] font-bold text-xs flex items-center gap-1.5 hover:bg-[#0A3822]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'طباعة المانيفست' : 'Print Manifest'}</span>
              </button>
            </div>
          </div>

          {/* Manifest Table */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4 text-xs font-bold">
              <div>
                <span>{lang === 'ar' ? 'الرحلة:' : 'Trip:'} </span>
                <span className="text-[#0D472B] font-black">{selectedTripForManifest.id}</span>
                <span className="mx-2">•</span>
                <span>{selectedTripForManifest.operatorNameAr}</span>
              </div>
              <div>
                <span>{lang === 'ar' ? 'رقم اللوحة:' : 'Plate:'} </span>
                <span className="font-mono">{selectedTripForManifest.plateNumber}</span>
              </div>
            </div>

            <table className="w-full text-right text-xs">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">المقعد</th>
                  <th className="p-3">اسم المسافر</th>
                  <th className="p-3">الرقم الوطني / جواز السفر</th>
                  <th className="p-3">رقم الهاتف</th>
                  <th className="p-3">الأمتعة</th>
                  <th className="p-3">حالة الصعود</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { seat: 1, name: 'محمد الأحمد', nid: '01040089211', phone: '+963 933 123 456', lug: '30 كغ', boarded: true },
                  { seat: 2, name: 'سامر خوري', nid: '02030018442', phone: '+963 944 556 789', lug: '35 كغ', boarded: true },
                  { seat: 5, name: 'فاطمة الزهراء علي', nid: '01089923145', phone: '+963 988 234 112', lug: '30 كغ', boarded: false },
                  { seat: 12, name: 'عماد الدين النجار', nid: '04050091823', phone: '+963 955 890 321', lug: '40 كغ', boarded: false },
                ].map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#0D472B]">#{p.seat}</td>
                    <td className="p-3 font-bold text-gray-900">{p.name}</td>
                    <td className="p-3 font-mono">{p.nid}</td>
                    <td className="p-3 font-mono">{p.phone}</td>
                    <td className="p-3">{p.lug}</td>
                    <td className="p-3">
                      {p.boarded ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          تم الصعود ✓
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          بانتظار الصعود
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Fleet Monitor */}
      {adminTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-mono font-bold text-[#0D472B]">{t.plateNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  جاهز للتشغيل
                </span>
              </div>

              <div className="font-bold text-gray-900">{t.busModel}</div>
              <div className="text-gray-500">
                {t.fromGarageAr} ← {t.toGarageAr}
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-600 pt-2 border-t border-gray-100">
                <span>{lang === 'ar' ? 'السائق:' : 'Driver:'} أحمد كنعان</span>
                <span>{lang === 'ar' ? 'الفحص الدوري:' : 'Maintenance:'} 15/09/2026</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Price Edit Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-xs">
            <h3 className="font-bold text-sm text-gray-900 mb-3">
              {lang === 'ar' ? 'تعديل تسعيرة الرحلة بالليرة السورية' : 'Adjust Fare (SYP)'}
            </h3>
            <p className="text-gray-500 mb-4">
              {lang === 'ar' ? 'تعديل التسعيرة الرسمية بناءً على مخصصات الوقود أو طلب المواسم.' : 'Update fare based on fuel subsidy.'}
            </p>

            <input
              type="number"
              step={500}
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-300 font-bold mb-4 text-sm"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPriceModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-700"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => editingTripId && handleUpdatePrice(editingTripId)}
                className="px-5 py-2 rounded-xl bg-[#0D472B] text-[#D4AF37] font-bold"
              >
                {lang === 'ar' ? 'حفظ التسعيرة' : 'Save Fare'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
