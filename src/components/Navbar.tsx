import React from 'react';
import { SyrianEagleLogo } from './SyrianEagleLogo';
import { Language, LoyaltyProfile } from '../types';
import { 
  Compass, 
  MapPin, 
  Ticket, 
  Wallet, 
  Smartphone, 
  HelpCircle, 
  Settings, 
  Globe, 
  Calendar,
  Sparkles,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  walletBalanceSYP: number;
  loyalty: LoyaltyProfile;
  onOpenQuickBook: () => void;
  onOpenWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  walletBalanceSYP,
  loyalty,
  onOpenQuickBook,
  onOpenWallet,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const formatSYP = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SY' : 'en-US').format(amount);
  };

  const navLinks = [
    { id: 'search', labelAr: 'حجز الرحلات', labelEn: 'Book Trips', icon: Calendar },
    { id: 'routes', labelAr: 'المواعيد والأسعار', labelEn: 'Schedules & Fares', icon: Compass },
    { id: 'map', labelAr: 'خريطة سورية والكراجات', labelEn: 'Syria Map & Stations', icon: MapPin },
    { id: 'bookings', labelAr: 'حجوزاتي والتذاكر', labelEn: 'My Bookings', icon: Ticket },
    { id: 'wallet', labelAr: 'محفظة سَفَر', labelEn: 'Safar Wallet', icon: Wallet },
    { id: 'app', labelAr: 'تطبيق الموبايل', labelEn: 'Mobile App', icon: Smartphone },
    { id: 'support', labelAr: 'الأمتعة والدعم', labelEn: 'Luggage & Support', icon: HelpCircle },
    { id: 'admin', labelAr: 'بوابة المشغلين', labelEn: 'Operator Portal', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Official Syrian Transport Top Government-Grade Strip */}
      <div className="bg-[#0D472B] text-white px-4 py-1 text-xs border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-100/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              {lang === 'ar' 
                ? 'البوابة الوطنية الموحدة لحافلات النقل بين المحافظات السورية' 
                : 'National Unified Syrian Intercity Bus Transport Portal'}
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:inline text-xs text-[#D4AF37] font-semibold">
              {lang === 'ar' ? '«سافر بأمان، احجز بثقة»' : '"Travel safely, book with confidence"'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Wallet Pill */}
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#08301D] hover:bg-[#062516] border border-[#D4AF37]/40 text-[#D4AF37] font-semibold text-[11px] transition-all"
              title={lang === 'ar' ? 'رصيد محفظة سفر' : 'Safar Wallet Balance'}
            >
              <Wallet className="w-3 h-3 text-[#D4AF37]" />
              <span>{formatSYP(walletBalanceSYP)}</span>
              <span className="text-[10px] text-emerald-200/80">{lang === 'ar' ? 'ل.س' : 'SYP'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 text-xs font-bold text-emerald-100 hover:text-[#D4AF37] transition-colors py-0.5 px-1.5 rounded hover:bg-white/10"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Syrian Golden Eagle Brand Logo */}
          <div 
            onClick={() => onSelectTab('search')} 
            className="cursor-pointer select-none py-2"
          >
            <SyrianEagleLogo lang={lang} size={50} variant="gold" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0D472B] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]/30'
                      : 'text-[#141C17] hover:text-[#0D472B] hover:bg-emerald-50/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#0D472B]/70'}`} />
                  <span>{lang === 'ar' ? link.labelAr : link.labelEn}</span>
                  {link.id === 'wallet' && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] bg-[#D4AF37]/20 text-[#967515] font-bold">
                      {loyalty.tier === 'gold' ? 'ذهب' : loyalty.tier === 'silver' ? 'فضة' : 'برونز'}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Book CTA Action */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenQuickBook}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#0D472B] to-[#125B37] hover:from-[#0A3822] hover:to-[#0D472B] text-[#D4AF37] font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-[#D4AF37]/40"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'احجز رحلتك الآن' : 'Book a Trip'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#0D472B] hover:bg-emerald-50 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-900/10 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <div className="p-3 mb-2 rounded-xl bg-emerald-50 border border-emerald-900/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <div className="text-xs text-emerald-900/70">{lang === 'ar' ? 'رصيد محفظة سفر' : 'Safar Balance'}</div>
                <div className="font-bold text-[#0D472B]">{formatSYP(walletBalanceSYP)} {lang === 'ar' ? 'ل.س' : 'SYP'}</div>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenWallet();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#0D472B] text-[#D4AF37] text-xs font-bold"
            >
              {lang === 'ar' ? 'شحن المحفظة' : 'Top Up'}
            </button>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#0D472B] text-[#D4AF37]'
                    : 'text-[#141C17] hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : 'text-[#0D472B]'}`} />
                <span>{lang === 'ar' ? link.labelAr : link.labelEn}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              onOpenQuickBook();
              setMobileMenuOpen(false);
            }}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0D472B] text-[#D4AF37] font-bold text-sm shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>{lang === 'ar' ? 'احجز رحلتك الآن' : 'Book a Trip'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
