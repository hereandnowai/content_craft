
import React from 'react';
import { Link } from 'react-router-dom';
import { BRANDING_CONFIG, SVG_ICONS } from '../constants';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { brand } = BRANDING_CONFIG;

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 px-4 py-2 flex items-center justify-between shadow-md h-16"
      style={{ backgroundColor: brand.colors.secondary, color: brand.colors.primary }}
    >
      <div className="flex items-center">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 mr-2 rounded-md hover:bg-[rgba(255,223,0,0.2)]"
          aria-label="Toggle menu"
        >
          {SVG_ICONS.menu}
        </button>
        <Link to="/" className="flex items-center space-x-3">
          <img src={brand.logo.title} alt={`${brand.shortName} Logo`} className="h-10" />
          {/* <span className="text-xl font-bold tracking-tight hidden sm:block">{brand.shortName}</span> */}
        </Link>
      </div>
      <div className="flex items-center space-x-3">
        <p className="text-sm hidden md:block italic opacity-80">{brand.slogan}</p>
        <img 
          src={brand.chatbot.avatar} 
          alt="Caramel AI Avatar" 
          className="h-10 w-10 rounded-full border-2"
          style={{ borderColor: brand.colors.primary }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
