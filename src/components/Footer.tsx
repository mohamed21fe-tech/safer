import React from 'react';
import { SyrianEagleLogo } from './SyrianEagleLogo';
import { DamasceneZakhrafaBanner, DamasceneJasmineIcon } from './DamascenePattern';
import { Language } from '../types';
import { GOVERNORATES } from '../data/syriaData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  FileText,
  CreditCard,
  Heart
} from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate: (tab: string) => void;
  onSelectRoute: (fromId: string, toId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigate,
  onSelectRoute,
}) => {
  return (
    <footer className="bg-[#071E12] text-white pt-12 pb-8 border-t-2 border-[#D4AF37] relative overflow-hidden">
      <DamasceneZakhrafaBanner opacity={0.12} color="#D4AF37" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top Partner & Ministry Endorsement Row */}
        <div className="pb-8 border-b border-emerald-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <SyrianEagleLogo size={44} variant="white" lang={lang} />
            <div>
              <div className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase">
                {lang === 'ar' ? 'الجمهورية العربية السورية - وزارة النقل' : 'Syrian Arab Republic - Ministry of Transport'}
              </div>
              <div className="text-xs text-emerald-100/70">
                {lang === 'ar' ? 'المنظومة الرقمية الموحدة لخدمات النقل بين المحافظات' : 'Unified National Portal for Intercity Coach Transit'}
              </div>
            </div>
          </div>

          {/* Payment Partners Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-[#D4AF37]">شام كاش (ShamCash)</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-bold text-white">سيريتل كاش (Syriatel)</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-bold text-[#D4AF37]">محفظة سَفَر الذكية</span>
            </div>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          {/* Col 1: About Safar */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D4AF37] flex items-center gap-1.5">
              <DamasceneJasmineIcon size={14} color="#D4AF37" />
              <span>{lang === 'ar' ? 'عن منصة سَفَر' : 'About Safar'}</span>
            </h4>
            <p className="text-emerald-100/80 leading-relaxed">
              {lang === 'ar'
                ? 'البوابة السورية الموحدة لحجز تذاكر البولمان والحافلات بين المحافظات. نربط كراجات العاصمة دمشق وباقي المحافظات بأسطول حديث ومواعيد دقيقة ودفع إلكتروني آمن.'
                : 'Syria’s unified national bus booking gateway connecting all 14 governorates with certified operators, electronic ticketing, and 24/7 passenger care.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'تذاكر رقمية معتمدة ومؤمنة بالكامل' : 'Officially Certified Tickets'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D4AF37]">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-[#D4AF37] transition-colors">
                  {lang === 'ar' ? 'حجز رحلة جديدة' : 'Book a New Trip'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('routes')} className="hover:text-[#D4AF37] transition-colors">
                  {lang === 'ar' ? 'جدول المواعيد والأسعار' : 'Timetables & Fares'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-[#D4AF37] transition-colors">
                  {lang === 'ar' ? 'خريطة المحافظات ومواقع الكراجات' : 'Syrian Map & Bus Garages'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('operators')} className="hover:text-[#D4AF37] transition-colors">
                  {lang === 'ar' ? 'شركات النقل والأسطول' : 'Bus Operators Directory'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('app')} className="hover:text-[#D4AF37] transition-colors">
                  {lang === 'ar' ? 'تطبيق سفر للهواتف الذكية' : 'Safar Mobile App'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-[#D4AF37] transition-colors">
                  {lang === 'ar' ? 'بوابة إدارة المشغلين والمانيفست' : 'Transit Admin Portal'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Intercity Routes */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D4AF37]">
              {lang === 'ar' ? 'أشهر الخطوط السورية' : 'Top Syrian Routes'}
            </h4>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <button
                  onClick={() => onSelectRoute('damascus', 'aleppo')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {lang === 'ar' ? 'دمشق ⟵ حلب (كراج حرستا)' : 'Damascus → Aleppo (M5)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRoute('damascus', 'latakia')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {lang === 'ar' ? 'دمشق ⟵ اللاذقية (كراج الفاروس)' : 'Damascus → Latakia'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRoute('damascus', 'tartous')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {lang === 'ar' ? 'دمشق ⟵ طرطوس (كراج طرطوس)' : 'Damascus → Tartous'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRoute('damascus', 'homs')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {lang === 'ar' ? 'دمشق ⟵ حمص وحماة' : 'Damascus → Homs & Hama'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRoute('aleppo', 'latakia')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {lang === 'ar' ? 'حلب ⟵ اللاذقية وطرطوس' : 'Aleppo → Latakia'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Garages Hotline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D4AF37]">
              {lang === 'ar' ? 'خدمة المسافرين والكراجات' : '24/7 Passenger Support'}
            </h4>
            <div className="space-y-2 text-emerald-100/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-mono font-bold text-white">9880 / +963 11 531 2200</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-mono">support@safar.sy</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>{lang === 'ar' ? 'خدمة العملاء على مدار 24 ساعة' : 'Round-the-clock assistance'}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 text-[11px] text-emerald-200/70">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'كراجات حرستا المركزية، أوتوستراد حمص-دمشق الدولي'
                    : 'Central Harasta Garages, Damascus-Homs Highway'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 14 Governorates Badge Ribbon */}
        <div className="pt-6 border-t border-emerald-900/60 text-center space-y-2">
          <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
            {lang === 'ar' ? 'تغطية شاملة لجميع المحافظات السورية الـ 14' : 'Connecting All 14 Syrian Governorates'}
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] text-emerald-100/70">
            {GOVERNORATES.map((g) => (
              <span
                key={g.id}
                className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
              >
                {lang === 'ar' ? g.nameAr : g.nameEn}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright & Damascene Signoff */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-100/60 gap-4">
          <div>
            © {new Date().getFullYear()} منصة سَفَر السورية للنقل البري (Safar Syria). {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-1">
            <span>{lang === 'ar' ? 'صُنع بكل فخر واعتزاز لأجل سورية' : 'Crafted with pride for Syria'}</span>
            <DamasceneJasmineIcon size={12} color="#D4AF37" />
          </div>
        </div>
      </div>
    </footer>
  );
};
