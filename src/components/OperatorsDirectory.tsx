import React from 'react';
import { BUS_OPERATORS } from '../data/syriaData';
import { Language } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  Star, 
  Bus, 
  Wifi, 
  Tv, 
  Coffee, 
  Zap, 
  Wind, 
  ChevronRight,
  Sparkles 
} from 'lucide-react';

interface OperatorsDirectoryProps {
  lang: Language;
  onSelectOperator: (operatorName: string) => void;
}

export const OperatorsDirectory: React.FC<OperatorsDirectoryProps> = ({
  lang,
  onSelectOperator,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0D472B] border border-emerald-200 text-xs font-bold mb-3">
          <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{lang === 'ar' ? 'شركات النقل المعتمدة في سورية' : 'Certified Syrian Bus Operators'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {lang === 'ar' ? 'أسطول شركات البولمان الشريكة في منصة سفر' : 'Partner Bus Companies & Fleets'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {lang === 'ar'
            ? 'نعمل جنباً إلى جنب مع كبرى شركات النقل الجماعي السورية المعتمدة والمرخصة لضمان أعلى معايير الأمان والراحة.'
            : 'Partnered with licensed Syrian transport carriers ensuring top-tier safety, comfort, and regular departures.'}
        </p>
      </div>

      {/* Operators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BUS_OPERATORS.map((op) => (
          <div
            key={op.id}
            className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-[#D4AF37] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {lang === 'ar' ? op.nameAr : op.nameEn}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold text-[#0D472B] bg-emerald-50 px-2 py-0.5 rounded">
                      {lang === 'ar' ? `أسطول: ${op.fleetCount || 48} حافلة` : `Fleet: ${op.fleetCount || 48} buses`}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {lang === 'ar' ? `تأسست عام ${op.establishedYear || 1992}` : `Est. ${op.establishedYear || 1992}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl text-amber-800 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{op.rating}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 my-4 leading-relaxed">
                {lang === 'ar' ? op.descriptionAr : op.descriptionEn}
              </p>

              {/* Amenities / Features */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-bold text-gray-500 uppercase">
                  {lang === 'ar' ? 'تجهيزات ومزايا الأسطول:' : 'Fleet Amenities:'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(op.amenities || op.features || []).map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Routes Served */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[11px] font-bold text-gray-500 uppercase">
                  {lang === 'ar' ? 'المسارات الرئيسية المغطاة:' : 'Key Routes:'}
                </div>
                <div className="text-xs text-gray-800 font-medium">
                  {lang === 'ar'
                    ? (op.routesServedAr?.join(' • ') || 'دمشق • حلب • اللاذقية • طرطوس • حمص')
                    : (op.routesServedEn?.join(' • ') || 'Damascus • Aleppo • Latakia • Tartous • Homs')}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'ar' ? 'مرخّص ومؤمّن' : 'Certified & Insured'}</span>
              </div>

              <button
                onClick={() => onSelectOperator(op.nameAr)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#0D472B] text-[#0D472B] hover:text-[#D4AF37] font-bold text-xs transition-all flex items-center gap-1"
              >
                <span>{lang === 'ar' ? 'عرض الرحلات' : 'View Trips'}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
