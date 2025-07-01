
import React from 'react';
import { BRANDING_CONFIG } from '../constants';

const LoadingSpinner: React.FC = () => {
  const { brand } = BRANDING_CONFIG;
  return (
    <div className="flex justify-center items-center my-8">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4"
        style={{ borderColor: brand.colors.primary, borderTopColor: brand.colors.secondary }}
      ></div>
      <p className="ml-4 text-lg font-semibold" style={{ color: brand.colors.secondary }}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
