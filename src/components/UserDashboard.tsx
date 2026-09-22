import React, { useState } from 'react';
import { TicketBooking, Language, LoyaltyProfile, WalletTransaction } from '../types';
import { 
  Ticket, 
  Wallet, 
  Award, 
  History, 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface UserDashboardProps {
  bookings: TicketBooking[];
  lang: Language;
  walletBalanceSYP: number;
  walletTransactions: WalletTransaction[];
  loyalty: LoyaltyProfile;
  onOpenTicket: (booking: TicketBooking) => void;
  onCancelBooking: (ticketId: string) => void;
  onTopUpWallet: (amountSYP: number, method: string) => void;
  onRebook: (tripId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  bookings,
  lang,
  walletBalanceSYP,
  walletTransactions,
  loyalty,
  onOpenTicket,
  onCancelBooking,
  onTopUpWallet,
  onRebook,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'wallet' | 'loyalty'>('upcoming');
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);
  const [topUpMethod, setTopUpMethod] = useState<string>('shamcash');
  const [referralCopied, setReferralCopied] = useState(false);

  const referralCode = 'SAFAR-SYR-2026';

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTopUpWallet(topUpAmount, topUpMethod);
    setTopUpModalOpen(false);
  };

  const upcomingBookings = bookings.filter((b) => b.paymentStatus === 'confirmed');
  const pastBookings = bookings.filter((b) => b.paymentStatus === 'cancelled' || b.boardingStatus === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Top Header & Wallet Snapshot */}
      <div className="bg-linear-to-r from-[#0D472B] via-[#0A3822] to-[#0D472B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#D4AF37]/30 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'لوحة تحكم المسافر السوري' : 'Syrian Traveler Dashboard'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'ar' ? 'أهلاً بك، محمد الأحمد' : 'Welcome, Mohamed Al-Ahmad'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
              {lang === 'ar'
                ? 'إدارة حجوزاتك، تذاكرك الرقمية، رصيد محفظة سفر، ومكافآت برنامج الولاء الوطني.'
                : 'Manage bookings, digital tickets, Safar Wallet balance, and national loyalty perks.'}
            </p>
          </div>

          {/* Quick Wallet / Tier Summary Cards */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Safar Wallet Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-emerald-200/90 mb-1">
                <span>{lang === 'ar' ? 'رصيد محفظة سفر' : 'Safar Balance'}</span>
                <Wallet className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-2xl font-black text-[#D4AF37]">
                {formatSYP(walletBalanceSYP)} <span className="text-xs font-bold text-white">{lang === 'ar' ? 'ل.س' : 'SYP'}</span>
              </div>
              <button
                onClick={() => setTopUpModalOpen(true)}
                className="mt-2 w-full py-1.5 px-3 rounded-lg bg-[#D4AF37] text-[#0A2D1B] font-bold text-xs hover:bg-[#E5C158] transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'شحن الرصيد' : 'Top Up'}</span>
              </button>
            </div>

            {/* Loyalty Tier Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[180px]">
              <div className="flex items-center justify-between text-xs text-emerald-200/90 mb-1">
                <span>{lang === 'ar' ? 'مستوى العضوية' : 'Tier Level'}</span>
                <Award className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-xl font-extrabold text-white flex items-center gap-1.5">
                <span className="capitalize text-[#D4AF37]">
                  {loyalty.tier === 'gold' ? (lang === 'ar' ? 'المستوى الذهبي' : 'Gold Tier') : loyalty.tier}
                </span>
              </div>
              <div className="text-[11px] text-emerald-100/70 mt-1">
                {loyalty.points} {lang === 'ar' ? 'نقطة مكتسبة' : 'points'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-2 sm:gap-4 overflow-x-auto text-sm font-bold">
        {[
          { id: 'upcoming', labelAr: `الرحلات القادمة (${upcomingBookings.length})`, labelEn: `Upcoming (${upcomingBookings.length})`, icon: Calendar },
          { id: 'wallet', labelAr: 'محفظة سفر والعمليات', labelEn: 'Safar Wallet & History', icon: Wallet },
          { id: 'loyalty', labelAr: 'برنامج الولاء والمكافآت', labelEn: 'Loyalty Program', icon: Award },
          { id: 'past', labelAr: `السجل والرحلات السابقة (${pastBookings.length})`, labelEn: `Past Trips (${pastBookings.length})`, icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab 1: Upcoming Trips */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">
                {lang === 'ar' ? 'لا توجد رحلات قادمة محجوزة حالياً' : 'No upcoming bookings'}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'يمكنك البحث عن رحلات بين المحافظات السورية وحجز تذكرتك الرقمية الفورية الآن.'
                  : 'Search intercity trips across Syria and book your digital ticket now.'}
              </p>
            </div>
          ) : (
            upcomingBookings.map((booking) => (
              <div
                key={booking.ticketId}
                className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200 hover:border-[#D4AF37]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-50 text-[#0D472B] border border-emerald-200">
                      {booking.pnr}
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {booking.trip.operatorNameAr}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#967515]">
                      {booking.trip.busClass.toUpperCase()}
                    </span>
                    {booking.boardingStatus === 'boarded' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {lang === 'ar' ? 'تم الصعود ✓' : 'Boarded ✓'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-base font-bold text-gray-900">
                    <span>{booking.trip.fromGarageAr}</span>
                    <span className="text-[#D4AF37]">←</span>
                    <span>{booking.trip.toGarageAr}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0D472B]" />
                      <span>{booking.travelDate}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0D472B]" />
                      <span>{booking.trip.departureTime}</span>
                    </span>
                    <span>
                      {lang === 'ar' ? 'المقاعد:' : 'Seats:'}{' '}
                      <strong className="text-gray-800">{booking.selectedSeats.join(', ')}</strong>
                    </span>
                    <span>
                      {lang === 'ar' ? 'المجموع:' : 'Total:'}{' '}
                      <strong className="text-[#0D472B]">{formatSYP(booking.totalAmountSYP)} ل.س</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <button
                    onClick={() => onOpenTicket(booking)}
                    className="px-4 py-2 rounded-xl bg-[#0D472B] text-[#D4AF37] font-bold text-xs hover:bg-[#0A3822] shadow-xs flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'عرض رمز QR والتذكرة' : 'View QR Ticket'}</span>
                  </button>

                  <button
                    onClick={() => onCancelBooking(booking.ticketId)}
                    className="px-3 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold"
                  >
                    {lang === 'ar' ? 'إلغاء الحجز' : 'Cancel'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Safar Wallet */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Wallet Actions & Referral */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  {lang === 'ar' ? 'الرصيد المتاح' : 'Available Balance'}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {lang === 'ar' ? 'نشط' : 'Active'}
                </span>
              </div>

              <div className="text-3xl font-black text-[#0D472B]">
                {formatSYP(walletBalanceSYP)} <span className="text-sm font-bold text-gray-600">{lang === 'ar' ? 'ل.س' : 'SYP'}</span>
              </div>

              <button
                onClick={() => setTopUpModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#0D472B] text-[#D4AF37] font-bold text-xs shadow-sm hover:bg-[#0A3822] flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'شحن رصيد المحفظة الآن' : 'Top Up Wallet'}</span>
              </button>
            </div>

            {/* Mowasalat-Inspired Referral System */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Share2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{lang === 'ar' ? 'كود الإحالة والمكافآت' : 'Referral Code'}</span>
              </div>
              <p className="text-xs text-amber-800">
                {lang === 'ar'
                  ? 'شارك كود إحالتك مع أصدقائك وعائلتك في سورية. يحصل صديقك على خصم 10,000 ل.س وتحصل أنت على 25,000 ل.س برصيدك.'
                  : 'Share your referral code. Friends get 10,000 SYP discount and you earn 25,000 SYP wallet bonus.'}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white p-2 rounded-xl border border-amber-300 font-mono font-bold text-center text-xs text-gray-900">
                  {referralCode}
                </div>
                <button
                  onClick={copyReferral}
                  className="p-2 rounded-xl bg-[#0D472B] text-[#D4AF37] text-xs font-bold hover:bg-[#0A3822]"
                  title="Copy code"
                >
                  {referralCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Log */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
            <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-[#0D472B]" />
              <span>{lang === 'ar' ? 'سجل العمليات والتحويلات' : 'Transaction History'}</span>
            </h3>

            <div className="space-y-2.5">
              {walletTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-gray-50 flex items-center justify-between text-xs hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${tx.type === 'topup' || tx.type === 'referral' || tx.type === 'cashback' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {tx.type === 'topup' || tx.type === 'referral' || tx.type === 'cashback' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {lang === 'ar' ? tx.descriptionAr : tx.descriptionEn}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {tx.date} • {tx.method}
                      </div>
                    </div>
                  </div>

                  <div className={`font-black text-sm ${tx.type === 'topup' || tx.type === 'referral' || tx.type === 'cashback' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {tx.type === 'topup' || tx.type === 'referral' || tx.type === 'cashback' ? '+' : '-'}
                    {formatSYP(tx.amountSYP)} {lang === 'ar' ? 'ل.س' : 'SYP'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Loyalty Program */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  {lang === 'ar' ? 'برنامج ولاء المسافر السوري' : 'Syrian National Traveler Loyalty'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {lang === 'ar' ? 'عضوية فئة الذهب (Gold Tier)' : 'Gold Tier Membership'}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-2xl font-black text-[#0D472B]">
                  {loyalty.points} <span className="text-xs font-bold text-gray-600">{lang === 'ar' ? 'نقطة' : 'pts'}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {loyalty.nextTierPoints - loyalty.points} {lang === 'ar' ? 'نقطة متبقية للوصول للمستوى البلاتيني' : 'pts to Platinum'}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="py-6">
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                <span>{lang === 'ar' ? 'برونزي (0)' : 'Bronze (0)'}</span>
                <span>{lang === 'ar' ? 'فضي (500)' : 'Silver (500)'}</span>
                <span className="text-[#0D472B]">{lang === 'ar' ? 'ذهبي (1,000)' : 'Gold (1,000)'}</span>
                <span>{lang === 'ar' ? 'بلاتيني (2,500)' : 'Platinum (2,500)'}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#0D472B] to-[#D4AF37] rounded-full transition-all duration-500"
                  style={{ width: `${(loyalty.points / loyalty.nextTierPoints) * 100}%` }}
                />
              </div>
            </div>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-[#0D472B]">
                  {lang === 'ar' ? 'خصم حصري 15% على التذاكر' : '15% Exclusive Discount'}
                </div>
                <p className="text-gray-600">
                  {lang === 'ar' ? 'يطبق تلقائياً عند حجز أي رحلة بولمان بين المحافظات.' : 'Applied on all intercity coach journeys.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-[#0D472B]">
                  {lang === 'ar' ? '+10 كغ أمتعة مجانية إضافية' : '+10kg Extra Baggage'}
                </div>
                <p className="text-gray-600">
                  {lang === 'ar' ? 'إجمالي 40 كغ وزن مجاني مسموح في كل رحلة.' : '40kg total allowance on every trip.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-[#0D472B]">
                  {lang === 'ar' ? 'دخول قاعات كراجات VIP' : 'VIP Karaj Lounge Access'}
                </div>
                <p className="text-gray-600">
                  {lang === 'ar' ? 'استراحة مكيفة ومشروبات ضيافة في كراج حرستا والراموسة.' : 'Complimentary lounge at Harasta & Ramouseh.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Past Trips */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
              <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <div className="font-bold text-sm text-gray-800">
                {lang === 'ar' ? 'لا توجد رحلات سابقة منتهية' : 'No past trips in history'}
              </div>
            </div>
          ) : (
            pastBookings.map((booking) => (
              <div
                key={booking.ticketId}
                className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-gray-800">
                    {booking.trip.fromGarageAr} ← {booking.trip.toGarageAr}
                  </div>
                  <div className="text-gray-500 mt-0.5">
                    {booking.travelDate} • {booking.trip.operatorNameAr} • {booking.pnr}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-600">
                    {formatSYP(booking.totalAmountSYP)} ل.س
                  </span>
                  <button
                    onClick={() => onRebook(booking.tripId)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0D472B] font-bold hover:bg-emerald-100"
                  >
                    {lang === 'ar' ? 'إعادة الحجز' : 'Rebook'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Top Up Modal */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="font-bold text-base text-gray-900 mb-3">
              {lang === 'ar' ? 'شحن رصيد محفظة سفر' : 'Top Up Safar Wallet'}
            </h3>

            <form onSubmit={handleTopUpSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'المبلغ بالليرة السورية' : 'Amount in SYP'}
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[50000, 100000, 200000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`p-2 rounded-xl font-bold border ${topUpAmount === amt ? 'bg-[#0D472B] text-white border-[#0D472B]' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                    >
                      {formatSYP(amt)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step={5000}
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'طريقة الشحن' : 'Payment Source'}
                </label>
                <select
                  value={topUpMethod}
                  onChange={(e) => setTopUpMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold"
                >
                  <option value="shamcash">شام كاش (ShamCash)</option>
                  <option value="syriatel">سيريتل كاش (Syriatel Cash)</option>
                  <option value="card">بطاقة مصرفية محلية</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-bold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0D472B] text-[#D4AF37] font-bold"
                >
                  {lang === 'ar' ? 'تأكيد الشحن الفوري' : 'Confirm Top Up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
