import React from 'react';

interface AromaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const AromaLogo: React.FC<AromaLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-tight',
    md: 'text-base font-bold tracking-tight',
    lg: 'text-xl font-extrabold tracking-tight',
    xl: 'text-2xl font-black tracking-tight'
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Pure unencapsulated vector icon */}
      <svg
        className={`${iconDimensions[size]} shrink-0 transition-transform hover:scale-105 duration-200`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Aroma Flowers Logo"
      >
        {/* Greenhouse curved arch structure */}
        <path
          d="M20 85 V45 C20 28 34 15 50 15 C66 15 80 28 80 45 V85"
          stroke="#15803d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Internal greenhouse lines */}
        <path d="M50 15 V85" stroke="#16a34a" strokeWidth="1.8" strokeDasharray="3 3" />
        <path d="M20 50 H80" stroke="#16a34a" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M20 68 H80" stroke="#16a34a" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M14 85 H86" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

        {/* Stem & Leaves */}
        <path d="M50 85 Q49 60 50 48" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        {/* Left emerald leaf */}
        <path
          d="M49 66 C38 64 34 52 38 48 C44 50 48 58 49 64 Z"
          fill="#16a34a"
          stroke="#15803d"
          strokeWidth="1"
        />
        {/* Right emerald leaf */}
        <path
          d="M51 60 C62 56 66 46 62 42 C56 44 52 52 51 58 Z"
          fill="#22c55e"
          stroke="#16a34a"
          strokeWidth="1"
        />

        {/* Blooming Rose Petals in Crimson Red (#dc2626) */}
        <circle cx="50" cy="38" r="14" fill="#dc2626" />
        {/* Overlapping stylized petal cuts */}
        <path
          d="M43 31 C40 37 42 45 49 48 C56 45 59 38 56 32 C51 35 46 33 43 31 Z"
          fill="#ef4444"
        />
        {/* Core spiral */}
        <path
          d="M47 35 C46 37 48 40 51 40 C53 40 54 38 53 36 C51 34 49 34 47 35 Z"
          fill="#991b1b"
        />
        <circle cx="50" cy="37" r="1.8" fill="#fef08a" />
      </svg>

      <div className="flex flex-col leading-tight">
        <span className={`${titleSizes[size]} text-stone-900 font-serif tracking-wide flex items-center gap-1`}>
          <span>AROMA</span>
          <span className="text-emerald-700 font-sans font-extrabold">FLOWERS</span>
        </span>
        {showSubtitle && (
          <span className={`${subtitleSizes[size]} text-stone-500 uppercase tracking-widest font-medium`}>
            Excelencia que florece
          </span>
        )}
      </div>
    </div>
  );
};
