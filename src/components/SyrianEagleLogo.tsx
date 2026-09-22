import React from 'react';

interface SyrianEagleLogoProps {
  className?: string;
  size?: number;
  variant?: 'gold' | 'white' | 'dark' | 'full';
  showText?: boolean;
  lang?: 'ar' | 'en';
}

export const SyrianEagleLogo: React.FC<SyrianEagleLogoProps> = ({
  className = '',
  size = 48,
  variant = 'gold',
  showText = true,
  lang = 'ar',
}) => {
  const goldColor = '#D4AF37';
  const deepGreen = '#0D472B';
  const eagleFill = variant === 'white' ? '#FFFFFF' : variant === 'dark' ? deepGreen : goldColor;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0" 
        style={{ width: size, height: size }}
      >
        {/* Halo Glow for Gold */}
        {variant === 'gold' && (
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/15 blur-md transform scale-110" />
        )}

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Damascene Jasmine Ring */}
          <circle cx="50" cy="50" r="47" stroke={eagleFill} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          <circle cx="50" cy="50" r="43" stroke={eagleFill} strokeWidth="0.8" opacity="0.6" />

          {/* Golden Eagle Head with Crown & Beak */}
          <path
            d="M50 14 C53 14 55 17 56 21 C57 24 55 26 58 27 C61 28 62 26 62 29 C62 31 59 32 58 34 C56 36 53 37 50 37 C47 37 44 36 42 34 C41 32 38 31 38 29 C38 26 39 28 42 27 C45 26 43 24 44 21 C45 17 47 14 50 14 Z"
            fill={eagleFill}
          />
          {/* Eagle Eye */}
          <circle cx="52" cy="22" r="1.5" fill={variant === 'white' ? deepGreen : '#0A2518'} />

          {/* Left Wing - 7 Feathers representing 7 of 14 Syrian Governorates */}
          <g fill={eagleFill}>
            {/* Feather 1 */}
            <path d="M44 32 C38 28 28 26 20 28 C24 33 32 35 41 36 Z" opacity="0.95" />
            {/* Feather 2 */}
            <path d="M42 36 C34 32 23 32 16 35 C21 40 30 41 39 41 Z" opacity="0.92" />
            {/* Feather 3 */}
            <path d="M40 41 C30 38 19 39 13 44 C19 48 28 47 38 46 Z" opacity="0.9" />
            {/* Feather 4 */}
            <path d="M39 46 C29 45 18 47 12 53 C18 56 27 54 37 51 Z" opacity="0.88" />
            {/* Feather 5 */}
            <path d="M38 51 C29 52 19 56 14 62 C20 64 28 61 36 56 Z" opacity="0.85" />
            {/* Feather 6 */}
            <path d="M37 56 C29 60 21 66 18 72 C24 72 30 68 36 61 Z" opacity="0.82" />
            {/* Feather 7 */}
            <path d="M37 61 C30 67 24 74 23 80 C28 78 33 73 37 66 Z" opacity="0.8" />
          </g>

          {/* Right Wing - 7 Feathers representing remaining 7 of 14 Syrian Governorates */}
          <g fill={eagleFill}>
            {/* Feather 8 */}
            <path d="M56 32 C62 28 72 26 80 28 C76 33 68 35 59 36 Z" opacity="0.95" />
            {/* Feather 9 */}
            <path d="M58 36 C66 32 77 32 84 35 C79 40 70 41 61 41 Z" opacity="0.92" />
            {/* Feather 10 */}
            <path d="M60 41 C70 38 81 39 87 44 C81 48 72 47 62 46 Z" opacity="0.9" />
            {/* Feather 11 */}
            <path d="M61 46 C71 45 82 47 88 53 C82 56 73 54 63 51 Z" opacity="0.88" />
            {/* Feather 12 */}
            <path d="M62 51 C71 52 81 56 86 62 C80 64 72 61 64 56 Z" opacity="0.85" />
            {/* Feather 13 */}
            <path d="M63 56 C71 60 79 66 82 72 C76 72 70 68 64 61 Z" opacity="0.82" />
            {/* Feather 14 */}
            <path d="M63 61 C70 67 76 74 77 80 C72 78 67 73 63 66 Z" opacity="0.8" />
          </g>

          {/* Central Shield with Stylized Bus Motif & 3 Syrian Red Stars */}
          <path
            d="M50 35 C58 35 63 42 61 58 C60 67 55 72 50 76 C45 72 40 67 39 58 C37 42 42 35 50 35 Z"
            fill={variant === 'white' ? deepGreen : '#0A2D1B'}
            stroke={eagleFill}
            strokeWidth="1.5"
          />

          {/* Stylized Modern Pullman Bus Silhouette inside Eagle Shield */}
          <rect x="44" y="44" width="12" height="18" rx="2.5" fill={eagleFill} />
          {/* Bus Windshield & Windows */}
          <rect x="45.5" y="46" width="9" height="4" rx="1" fill={variant === 'white' ? deepGreen : '#081D12'} />
          <rect x="45.5" y="52" width="2" height="3" rx="0.5" fill={variant === 'white' ? deepGreen : '#081D12'} />
          <rect x="49" y="52" width="2" height="3" rx="0.5" fill={variant === 'white' ? deepGreen : '#081D12'} />
          <rect x="52.5" y="52" width="2" height="3" rx="0.5" fill={variant === 'white' ? deepGreen : '#081D12'} />
          {/* Bus Wheels */}
          <circle cx="46.5" cy="62" r="1.2" fill="#E5C158" />
          <circle cx="53.5" cy="62" r="1.2" fill="#E5C158" />

          {/* 3 Red Independence Stars */}
          <circle cx="46" cy="40" r="1.1" fill="#CE1126" />
          <circle cx="50" cy="39" r="1.2" fill="#CE1126" />
          <circle cx="54" cy="40" r="1.1" fill="#CE1126" />

          {/* 5 Tail Feathers for Syria's 5 Geographic Regions (North, East, West, South, Centre) */}
          <g fill={eagleFill}>
            {/* Center: Centre region */}
            <path d="M49 76 L51 76 L51.5 90 L48.5 90 Z" />
            {/* North */}
            <path d="M47 75 L49 75 L46 88 L44 87 Z" opacity="0.9" />
            {/* South */}
            <path d="M51 75 L53 75 L56 87 L54 88 Z" opacity="0.9" />
            {/* West */}
            <path d="M45 73 L47 74 L42 85 L40 83 Z" opacity="0.8" />
            {/* East */}
            <path d="M53 74 L55 73 L60 83 L58 85 Z" opacity="0.8" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold tracking-tight ${lang === 'ar' ? 'font-serif text-2xl' : 'text-xl font-sans tracking-wide'} ${
              variant === 'white' ? 'text-white' : 'text-[#0D472B]'
            }`}>
              {lang === 'ar' ? 'سَفَر' : 'SAFAR'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D4AF37] text-[#0A2D1B] tracking-wider shadow-xs">
              {lang === 'ar' ? 'سورية' : 'SYRIA'}
            </span>
          </div>
          <span className={`text-[11px] font-medium ${
            variant === 'white' ? 'text-emerald-100/80' : 'text-emerald-900/70'
          }`}>
            {lang === 'ar' 
              ? 'بوابة حجز الحافلات بين المحافظات' 
              : 'Intercity Bus Booking Portal'}
          </span>
        </div>
      )}
    </div>
  );
};
