
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Abstract Premium Road Shield */}
    <rect x="5" y="5" width="90" height="90" rx="32" fill="#00ADB5" />
    <rect x="5" y="5" width="90" height="90" rx="32" fill="url(#logoGradient)" />
    
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="white" stopOpacity="0.2" />
        <stop offset="100%" stopColor="black" stopOpacity="0.2" />
      </linearGradient>
    </defs>

    {/* Minimalist Path representing the letter Y and a road merge */}
    <path 
      d="M30 30L50 55L70 30" 
      stroke="white" 
      strokeWidth="12" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M50 55V75" 
      stroke="white" 
      strokeWidth="12" 
      strokeLinecap="round" 
    />
    
    {/* Sleek shadow effect */}
    <path 
      d="M30 30L50 55" 
      stroke="black" 
      strokeOpacity="0.1"
      strokeWidth="12" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      transform="translate(3, 3)"
    />
  </svg>
);
