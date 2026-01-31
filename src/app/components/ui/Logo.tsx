import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'symbol';
  className?: string;
  imageClassName?: string;
  showText?: boolean;
}

export function Logo({ variant = 'horizontal', className = '', imageClassName = '', showText = false }: LogoProps) {
  const src = variant === 'horizontal' 
    ? '/logo/horizontal/png_sem_fundo/1.png' 
    : '/logo/Simbolo/png/1.png';
    
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img 
        src={src} 
        alt="SportConnect" 
        className={`w-full h-full object-contain ${imageClassName}`}
      />
      {showText && (
        <p className="mt-4 text-xl text-white font-medium italic font-montserrat tracking-tight">
          Conecte. Jogue. Evolua.
        </p>
      )}
    </div>
  );
}
