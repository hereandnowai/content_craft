
import React from 'react';
import { BRANDING_CONFIG, SVG_ICONS } from '../constants';

const ApiKeyBanner: React.FC = () => {
  const { brand } = BRANDING_CONFIG;
  return (
    <div 
      className="p-3 text-center text-sm font-medium" 
      style={{ backgroundColor: brand.colors.primary, color: brand.colors.secondary }}
    >
      <div className="flex items-center justify-center">
        <span className="w-5 h-5 mr-2">{SVG_ICONS.info}</span>
        <span>
          <strong>Important:</strong> For AI features to function correctly, please ensure the <code>API_KEY</code> environment variable is set in your deployment environment. This application reads the key from <code>process.env.API_KEY</code>.
        </span>
      </div>
    </div>
  );
};

export default ApiKeyBanner;
