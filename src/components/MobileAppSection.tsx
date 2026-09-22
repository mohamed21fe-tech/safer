import React from 'react';
import { Language } from '../types';
import { DamasceneZakhrafaBanner, DamasceneJasmineIcon } from './DamascenePattern';
import { SyrianEagleLogo } from './SyrianEagleLogo';
import { 
  Smartphone, 
  MapPin, 
  Wallet, 
  Bell, 
  WifiOff, 
  QrCode, 
  Apple, 
  PlayCircle,
  Download,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const MobileAppSection: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden bg-linear-to-r from-[#0A3822] via-[#0D472B] to-[#072415] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#D4AF37]/40 shadow-2xl">
        <DamasceneZakhrafaBanner opacity={0.12} color="#D4AF37" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Text Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold">
              <DamasceneJasmineIcon size={14} color="#D4AF37" />
              <span>{lang === 'ar' ? 'تطبيق سفر للهواتف الذكية' : 'Safar Mobile App (iOS & Android)'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {lang === 'ar' ? (
                <>
                  رحلتك بين <span className="text-[#D4AF37]">المحافظات السورية</span> بلمسة واحدة
                </>
              ) : (
                <>
                  Your Intercity Trips in Syria, <span className="text-[#D4AF37]">One Tap Away</span>
                </>
              )}
            </h2>

            <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
              {lang === 'ar'
                ? 'حمّل تطبيق سفر مجاناً على هاتفك لتجربة سفر متكاملة مستوحاة من أفضل التطبيقات العالمية: تتبع فوري لموقع البولمان عبر الـ GPS، دفع مباشر عبر محفظة شام كاش وسيريتل كاش، وتذاكر رقمية تعمل حتى دون اتصال بالإنترنت.'
                : 'Download Safar app for seamless travel: real-time GPS bus tracking, instant ShamCash & Syriatel Cash checkout, offline QR boarding passes, and trip notifications.'}
            </p>

            {/* App Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">{lang === 'ar' ? 'تتبع GPS مباشر للباص' : 'Live Bus GPS Tracking'}</div>
                  <div className="text-[11px] text-emerald-100/70">{lang === 'ar' ? 'معرفة موعد الوصول الدقيق للمحطة' : 'Real-time arrival prediction at garages'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">{lang === 'ar' ? 'تذاكر بدون إنترنت (Offline)' : 'Offline Ticket Access'}</div>
                  <div className="text-[11px] text-emerald-100/70">{lang === 'ar' ? 'إظهار رمز QR حتى في حال انقطاع الشبكة' : 'Present QR pass even without mobile data'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">{lang === 'ar' ? 'محفظة رقمية بنقرة واحدة' : 'Instant 1-Tap Safar Wallet'}</div>
                  <div className="text-[11px] text-emerald-100/70">{lang === 'ar' ? 'شحن فوري ومكافآت كاش باك' : 'Fast top-up & cashback points'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">{lang === 'ar' ? 'تنبيهات انطلاق ذكية' : 'Smart Departure Alerts'}</div>
                  <div className="text-[11px] text-emerald-100/70">{lang === 'ar' ? 'تذكير بموعد الرحلة ورقم رصيف الصعود' : 'Timely reminders & gate notifications'}</div>
                </div>
              </div>
            </div>

            {/* Download Badges */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href="#download-ios"
                onClick={(e) => { e.preventDefault(); alert(lang === 'ar' ? 'رابط تحميل تطبيق iOS متاح قريباً على App Store' : 'iOS app coming soon on App Store'); }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black text-white hover:bg-gray-900 border border-[#D4AF37]/50 shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Apple className="w-6 h-6 text-white" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400">Download on the</div>
                  <div className="text-xs font-bold leading-tight">Apple App Store</div>
                </div>
              </a>

              <a
                href="#download-android"
                onClick={(e) => { e.preventDefault(); alert(lang === 'ar' ? 'رابط تحميل تطبيق أندرويد متاح قريباً على Google Play' : 'Android app coming soon on Google Play'); }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black text-white hover:bg-gray-900 border border-[#D4AF37]/50 shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <PlayCircle className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400">GET IT ON</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Phone Mockup Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-[500px] bg-black rounded-[42px] p-3 border-4 border-[#D4AF37] shadow-2xl ring-4 ring-black/40">
              {/* Speaker notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-900 rounded-full z-20" />

              {/* Phone Screen Container */}
              <div className="w-full h-full bg-[#0D472B] rounded-[34px] overflow-hidden flex flex-col justify-between p-4 text-white relative">
                <DamasceneZakhrafaBanner opacity={0.2} color="#D4AF37" />

                {/* Top Phone Status */}
                <div className="relative z-10 pt-4 flex items-center justify-between text-[10px] text-emerald-200">
                  <span>09:41</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Simulated In-App Boarding Pass */}
                <div className="relative z-10 my-auto bg-white text-gray-900 rounded-2xl p-3.5 shadow-lg border border-[#D4AF37]">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-[10px] font-bold text-[#0D472B]">سفر | SAFAR APP</span>
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37]">SYR-2026-9842</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-xs font-bold">
                    <span>دمشق (حرستا)</span>
                    <span className="text-[#D4AF37]">←</span>
                    <span>حلب (الراموسة)</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mb-2">
                    حافلة قدموس VIP • مقعد #12
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-[#0D472B]" />
                  </div>
                  <div className="text-center text-[9px] font-bold text-emerald-800 mt-1">
                    جاهز للصعود (Offline Ready)
                  </div>
                </div>

                {/* Bottom simulated navigation */}
                <div className="relative z-10 pt-2 flex items-center justify-around border-t border-white/20 text-[10px] text-emerald-200">
                  <span className="text-[#D4AF37] font-bold">الرئيسية</span>
                  <span>حجوزاتي</span>
                  <span>المحفظة</span>
                  <span>حسابي</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
