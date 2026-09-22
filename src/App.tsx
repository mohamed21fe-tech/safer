import React, { useState, useEffect } from 'react';
import { 
  Language, 
  TripSchedule, 
  TicketBooking, 
  LoyaltyProfile, 
  WalletTransaction 
} from './types';
import { 
  TRIP_SCHEDULES, 
  BUS_OPERATORS, 
  GOVERNORATES, 
  SYRIAN_LUGGAGE_POLICY 
} from './data/syriaData';
import { Navbar } from './components/Navbar';
import { SearchWidget } from './components/SearchWidget';
import { TripResults } from './components/TripResults';
import { SeatSelectionModal } from './components/SeatSelectionModal';
import { BookingCheckoutModal } from './components/BookingCheckoutModal';
import { DigitalTicketModal } from './components/DigitalTicketModal';
import { UserDashboard } from './components/UserDashboard';
import { InteractiveSyriaMap } from './components/InteractiveSyriaMap';
import { RoutesTimetable } from './components/RoutesTimetable';
import { OperatorsDirectory } from './components/OperatorsDirectory';
import { RouteSEOPages } from './components/RouteSEOPages';
import { MobileAppSection } from './components/MobileAppSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { DamasceneJasmineIcon } from './components/DamascenePattern';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  // Localization & Direction (Arabic default)
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Active Navigation Tab
  // Options: 'search', 'routes', 'map', 'bookings', 'wallet', 'app', 'operators', 'admin'
  const [currentTab, setCurrentTab] = useState<string>('search');

  // Search Parameters State
  const [searchParams, setSearchParams] = useState({
    fromId: 'damascus',
    toId: 'aleppo',
    date: new Date().toISOString().split('T')[0],
    passengers: 1,
    busClass: 'all',
  });

  // User Wallet & Loyalty State
  const [walletBalanceSYP, setWalletBalanceSYP] = useState<number>(185000);
  const [loyalty, setLoyalty] = useState<LoyaltyProfile>({
    points: 1250,
    tier: 'gold',
    nextTierPoints: 2500,
    totalTrips: 4,
    savedAmountSYP: 45000,
    cashbackPercentage: 5,
    loungeAccess: true,
    perksAr: ['خصم 15% على الرحلات', '+10 كغ أمتعة مجاناً', 'دخول صالات كراجات VIP'],
    perksEn: ['15% discount on trips', '+10kg free baggage', 'VIP Lounge access'],
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'TX-901',
      date: '2026-09-18',
      amountSYP: 50000,
      type: 'cashback',
      descriptionAr: 'كاش باك حجز رحلة دمشق - حلب',
      descriptionEn: 'Cashback from Damascus-Aleppo trip',
      method: 'Safar Loyalty Cashback',
      status: 'success',
    },
    {
      id: 'TX-900',
      date: '2026-09-15',
      amountSYP: 150000,
      type: 'topup',
      descriptionAr: 'شحن رصيد عبر شام كاش (ShamCash)',
      descriptionEn: 'Wallet top up via ShamCash',
      method: 'ShamCash #963944882100',
      status: 'success',
    },
  ]);

  // Seeded User Bookings with initial trip
  const [bookings, setBookings] = useState<TicketBooking[]>([
    {
      ticketId: 'TKT-2026-101',
      pnr: 'SYR-2026-7841',
      tripId: 'TRIP-DAM-ALP-01',
      trip: TRIP_SCHEDULES[0],
      travelDate: new Date().toISOString().split('T')[0],
      passengers: [
        {
          fullName: 'محمد الأحمد',
          nationalId: '01040089211',
          phone: '+963 933 123 456',
          email: 'mohamed.alahmad@safar.sy',
          gender: 'male',
          seatNumber: 12,
        },
      ],
      selectedSeats: [12],
      luggageKgTotal: 30,
      excessLuggageFeeSYP: 0,
      baseFareSYP: 35000,
      discountSYP: 0,
      totalAmountSYP: 35000,
      paymentMethod: 'shamcash',
      paymentStatus: 'confirmed',
      boardingStatus: 'scheduled',
      bookedAt: '2026-09-19T14:30:00Z',
      qrPayload: JSON.stringify({
        app: 'SAFAR_SYRIA',
        pnr: 'SYR-2026-7841',
        trip: 'TRIP-DAM-ALP-01',
        date: new Date().toISOString().split('T')[0],
        seats: [12],
        passenger: 'محمد الأحمد',
        verified: true,
      }),
    },
  ]);

  // Modal Dialog States
  const [seatModalTrip, setSeatModalTrip] = useState<TripSchedule | null>(null);
  const [checkoutData, setCheckoutData] = useState<{
    trip: TripSchedule;
    seats: number[];
    extraLuggageKg: number;
  } | null>(null);
  const [activeTicketModal, setActiveTicketModal] = useState<TicketBooking | null>(null);

  // Global Toast Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered trips for current search
  const displayedTrips = React.useMemo(() => {
    return TRIP_SCHEDULES.filter((t) => {
      if (searchParams.fromId && t.fromGovernorateId !== searchParams.fromId) return false;
      if (searchParams.toId && t.toGovernorateId !== searchParams.toId) return false;
      if (searchParams.busClass && searchParams.busClass !== 'all' && t.busClass !== searchParams.busClass) return false;
      return true;
    });
  }, [searchParams]);

  // Handlers
  const handleSearch = (params: {
    fromId: string;
    toId: string;
    date: string;
    passengers: number;
    busClass?: string;
  }) => {
    setSearchParams({
      fromId: params.fromId,
      toId: params.toId,
      date: params.date,
      passengers: params.passengers,
      busClass: params.busClass || 'all',
    });
    setCurrentTab('search');
    // Smooth scroll down to results
    setTimeout(() => {
      const el = document.getElementById('search-results-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectTripForSeats = (trip: TripSchedule) => {
    setSeatModalTrip(trip);
  };

  const handleProceedToCheckout = (selectedSeats: number[], extraLuggageKg: number) => {
    if (!seatModalTrip) return;
    const trip = seatModalTrip;
    setSeatModalTrip(null);
    setCheckoutData({
      trip,
      seats: selectedSeats,
      extraLuggageKg,
    });
  };

  const handleBookingConfirmed = (booking: TicketBooking) => {
    setBookings((prev) => [booking, ...prev]);

    // If Safar wallet was used, deduct balance
    if (booking.paymentMethod === 'safar_wallet') {
      setWalletBalanceSYP((prev) => Math.max(0, prev - booking.totalAmountSYP));
      setWalletTransactions((prev) => [
        {
          id: `TX-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amountSYP: booking.totalAmountSYP,
          type: 'booking',
          descriptionAr: `دفع تذكرة سفر ${booking.trip.fromGarageAr} ← ${booking.trip.toGarageAr}`,
          descriptionEn: `Ticket booking ${booking.pnr}`,
          method: 'Safar Wallet',
          status: 'success',
        },
        ...prev,
      ]);
    }

    // Award loyalty points (1 point per 250 SYP spent)
    const earnedPoints = Math.round(booking.totalAmountSYP / 250);
    setLoyalty((prev) => ({
      ...prev,
      points: prev.points + earnedPoints,
    }));

    setCheckoutData(null);
    setActiveTicketModal(booking);
    showToast(
      lang === 'ar'
        ? `تم تأكيد حجز تذكرتك بنجاح! رقم الحجز: ${booking.pnr}`
        : `Booking confirmed successfully! PNR: ${booking.pnr}`
    );
  };

  const handleCancelBooking = (ticketId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.ticketId === ticketId ? { ...b, paymentStatus: 'cancelled' } : b))
    );
    showToast(lang === 'ar' ? 'تم إلغاء الحجز واسترداد الرصيد إلى محفظتك' : 'Booking cancelled & refunded to wallet');
  };

  const handleTopUpWallet = (amountSYP: number, method: string) => {
    setWalletBalanceSYP((prev) => prev + amountSYP);
    setWalletTransactions((prev) => [
      {
        id: `TX-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amountSYP,
        type: 'topup',
        descriptionAr: `شحن رصيد محفظة سفر عبر ${method === 'shamcash' ? 'شام كاش' : method === 'syriatel' ? 'سيريتل كاش' : 'البطاقة'}`,
        descriptionEn: `Wallet top up via ${method}`,
        method,
        status: 'success',
      },
      ...prev,
    ]);
    showToast(
      lang === 'ar'
        ? `تم شحن محفظتك بمبلغ ${new Intl.NumberFormat('ar-SY').format(amountSYP)} ل.س بنجاح!`
        : `Wallet topped up with ${amountSYP} SYP!`
    );
  };

  const handleSelectRouteShortcut = (fromId: string, toId: string) => {
    setSearchParams((prev) => ({
      ...prev,
      fromId,
      toId,
    }));
    setCurrentTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-gray-900 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0D472B]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0D472B] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#D4AF37] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        onToggleLang={toggleLanguage}
        walletBalanceSYP={walletBalanceSYP}
        loyalty={loyalty}
        onOpenQuickBook={() => {
          setCurrentTab('search');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenWallet={() => {
          setCurrentTab('wallet');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* View Switcher based on currentTab */}
      <main className="flex-1">
        {/* Tab: Search & Bookings (Home Flow) */}
        {currentTab === 'search' && (
          <div>
            <SearchWidget
              lang={lang}
              onSearch={handleSearch}
              selectedFrom={searchParams.fromId}
              selectedTo={searchParams.toId}
            />

            <div id="search-results-section" className="scroll-mt-20">
              <TripResults
                trips={displayedTrips}
                lang={lang}
                fromGovernorateId={searchParams.fromId}
                toGovernorateId={searchParams.toId}
                travelDate={searchParams.date}
                passengersCount={searchParams.passengers}
                onSelectTrip={handleSelectTripForSeats}
                onModifySearch={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
            </div>

            {/* Popular Highway Corridors SEO Section */}
            <RouteSEOPages
              lang={lang}
              onBookRoute={handleSelectRouteShortcut}
            />

            {/* Mobile App Teaser */}
            <MobileAppSection lang={lang} />
          </div>
        )}

        {/* Tab: Schedules & Timetable */}
        {currentTab === 'routes' && (
          <RoutesTimetable
            lang={lang}
            onBookTrip={(trip) => {
              setSearchParams({
                fromId: trip.fromGovernorateId,
                toId: trip.toGovernorateId,
                date: new Date().toISOString().split('T')[0],
                passengers: 1,
                busClass: trip.busClass,
              });
              handleSelectTripForSeats(trip);
            }}
          />
        )}

        {/* Tab: Interactive Syrian Map */}
        {currentTab === 'map' && (
          <InteractiveSyriaMap
            lang={lang}
            onSelectRoute={handleSelectRouteShortcut}
          />
        )}

        {/* Tab: My Bookings & Dashboard */}
        {currentTab === 'bookings' && (
          <UserDashboard
            bookings={bookings}
            lang={lang}
            walletBalanceSYP={walletBalanceSYP}
            walletTransactions={walletTransactions}
            loyalty={loyalty}
            onOpenTicket={(b) => setActiveTicketModal(b)}
            onCancelBooking={handleCancelBooking}
            onTopUpWallet={handleTopUpWallet}
            onRebook={(tripId) => {
              const trip = TRIP_SCHEDULES.find((t) => t.id === tripId);
              if (trip) handleSelectTripForSeats(trip);
            }}
          />
        )}

        {/* Tab: Safar Wallet Direct View */}
        {currentTab === 'wallet' && (
          <UserDashboard
            bookings={bookings}
            lang={lang}
            walletBalanceSYP={walletBalanceSYP}
            walletTransactions={walletTransactions}
            loyalty={loyalty}
            onOpenTicket={(b) => setActiveTicketModal(b)}
            onCancelBooking={handleCancelBooking}
            onTopUpWallet={handleTopUpWallet}
            onRebook={(tripId) => {
              const trip = TRIP_SCHEDULES.find((t) => t.id === tripId);
              if (trip) handleSelectTripForSeats(trip);
            }}
          />
        )}

        {/* Tab: Mobile App Showcase */}
        {currentTab === 'app' && (
          <div className="py-8">
            <MobileAppSection lang={lang} />
          </div>
        )}

        {/* Tab: Bus Operators Directory */}
        {currentTab === 'operators' && (
          <OperatorsDirectory
            lang={lang}
            onSelectOperator={(operatorName) => {
              setCurrentTab('routes');
            }}
          />
        )}

        {/* Tab: Operator Admin Portal */}
        {currentTab === 'admin' && (
          <div className="py-2">
            <AdminDashboard lang={lang} bookings={bookings} />
          </div>
        )}

        {/* Tab: Support & Luggage Policy */}
        {currentTab === 'support' && (
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D472B] uppercase">
                <DamasceneJasmineIcon size={14} color="#D4AF37" />
                <span>{lang === 'ar' ? 'سياسة الأمتعة وحقوق المسافرين' : 'Passenger Rights & Luggage Guide'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {lang === 'ar' ? 'دليل الأمتعة والاستراحات على الطرق السورية' : 'Luggage Allowance & Highway Rest Stops'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <h4 className="text-sm font-bold text-[#0D472B]">
                    {lang === 'ar' ? 'الوزن المجاني المسموح به' : 'Free Checked Baggage'}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {lang === 'ar'
                      ? 'يحق لكل مسافر نقل حقيبتين بإجمالي وزن لا يتجاوز 30 كغ مجاناً في مستودع الأمتعة السفلي للحافلة، بالإضافة إلى حقيبة يد شخصية وزن 7 كغ داخل المقصورة.'
                      : 'Each passenger is entitled to 30 kg free checked baggage plus a 7 kg carry-on in the cabin.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <h4 className="text-sm font-bold text-amber-900">
                    {lang === 'ar' ? 'رسوم الوزن الزائد والشحن' : 'Excess Baggage Rate'}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {lang === 'ar'
                      ? 'يتم احتساب رسوم رمزية قدرها 3,000 ليرة سورية لكل 1 كغ إضافي فوق الوزن المجاني المسموح به، وتسدد في كراج الانطلاق أو عبر المنصة.'
                      : 'Excess luggage is charged at 3,000 SYP per additional kilogram.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Dialogs */}

      {/* 1. Seat Selection Modal */}
      {seatModalTrip && (
        <SeatSelectionModal
          trip={seatModalTrip}
          passengersCount={searchParams.passengers}
          lang={lang}
          onClose={() => setSeatModalTrip(null)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* 2. Checkout & Payment Modal */}
      {checkoutData && (
        <BookingCheckoutModal
          trip={checkoutData.trip}
          selectedSeats={checkoutData.seats}
          extraLuggageKg={checkoutData.extraLuggageKg}
          travelDate={searchParams.date}
          lang={lang}
          walletBalanceSYP={walletBalanceSYP}
          onClose={() => setCheckoutData(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* 3. Digital Ticket & Boarding Pass Modal */}
      {activeTicketModal && (
        <DigitalTicketModal
          booking={activeTicketModal}
          lang={lang}
          onClose={() => setActiveTicketModal(null)}
          onSimulateBoardingScan={(ticketId) => {
            setBookings((prev) =>
              prev.map((b) => (b.ticketId === ticketId ? { ...b, boardingStatus: 'boarded' } : b))
            );
            showToast(
              lang === 'ar'
                ? 'تم مسح رمز QR بنجاح وتأكيد صعود المسافر في الكراج!'
                : 'Conductor scan verified! Passenger marked as boarded.'
            );
          }}
        />
      )}

      {/* Footer */}
      <Footer
        lang={lang}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectRoute={handleSelectRouteShortcut}
      />
    </div>
  );
}
