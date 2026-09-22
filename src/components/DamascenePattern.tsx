import React from 'react';

export const DamasceneJasmineIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 20,
  color = '#D4AF37',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 5 Petals of Damascene Jasmine */}
      <g fill={color} fillOpacity="0.85">
        <path d="M12 4 C10.5 7.5 10.5 9 12 11 C13.5 9 13.5 7.5 12 4 Z" />
        <path d="M19.6 9.5 C16.5 9.5 15 10.5 13.5 12 C15.5 12.8 17 13.2 19.6 9.5 Z" />
        <path d="M16.7 18.5 C14.5 16 13.5 15 12 13.5 C12 15.5 12.5 17 16.7 18.5 Z" />
        <path d="M7.3 18.5 C11.5 17 12 15.5 12 13.5 C10.5 15 9.5 16 7.3 18.5 Z" />
        <path d="M4.4 9.5 C7 13.2 8.5 12.8 10.5 12 C9 10.5 7.5 9.5 4.4 9.5 Z" />
      </g>
      {/* Golden Pistil Centre */}
      <circle cx="12" cy="12" r="2" fill="#E5C158" />
    </svg>
  );
};

export const DamasceneZakhrafaBanner: React.FC<{ className?: string; opacity?: number; color?: string }> = ({
  className = '',
  opacity = 0.08,
  color = '#D4AF37',
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="damascene-arabesque" width="60" height="60" patternUnits="userSpaceOnUse">
            {/* Eight-pointed Star Geometry (Damascene Zakhrafa) */}
            <path
              d="M30 0 L40 10 L50 0 L50 20 L60 30 L50 40 L60 50 L40 50 L30 60 L20 50 L0 50 L10 40 L0 30 L10 20 L0 0 L20 10 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.75"
            />
            <circle cx="30" cy="30" r="8" fill="none" stroke={color} strokeWidth="0.75" />
            <circle cx="30" cy="30" r="14" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" />
            {/* Corner Jasmine Buds */}
            <circle cx="0" cy="0" r="3" fill="none" stroke={color} strokeWidth="0.75" />
            <circle cx="60" cy="0" r="3" fill="none" stroke={color} strokeWidth="0.75" />
            <circle cx="0" cy="60" r="3" fill="none" stroke={color} strokeWidth="0.75" />
            <circle cx="60" cy="60" r="3" fill="none" stroke={color} strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#damascene-arabesque)" />
      </svg>
    </div>
  );
};

export const TatreezDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 py-1 ${className}`}>
      <span className="h-[1px] w-12 bg-linear-to-r from-transparent to-[#D4AF37]/50" />
      <span className="text-[#D4AF37] text-xs">❖</span>
      <DamasceneJasmineIcon size={14} color="#D4AF37" />
      <span className="text-[#D4AF37] text-xs">❖</span>
      <span className="h-[1px] w-12 bg-linear-to-l from-transparent to-[#D4AF37]/50" />
    </div>
  );
};
