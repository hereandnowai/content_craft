
import React from 'react';
import { BRANDING_CONFIG, SVG_ICONS } from '../constants';

const Footer: React.FC = () => {
  const { brand } = BRANDING_CONFIG;

  const socialLinks = [
    { name: 'Blog', href: brand.socialMedia.blog, icon: SVG_ICONS.blog },
    { name: 'LinkedIn', href: brand.socialMedia.linkedin, icon: SVG_ICONS.linkedin },
    { name: 'Instagram', href: brand.socialMedia.instagram, icon: SVG_ICONS.instagram },
    { name: 'GitHub', href: brand.socialMedia.github, icon: SVG_ICONS.github },
    { name: 'X', href: brand.socialMedia.x, icon: SVG_ICONS.x },
    { name: 'YouTube', href: brand.socialMedia.youtube, icon: SVG_ICONS.youtube },
  ];

  return (
    <footer className="p-6 text-white" style={{ backgroundColor: brand.colors.secondary }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h5 className="font-bold text-lg mb-2" style={{ color: brand.colors.primary }}>{brand.shortName}</h5>
            <p className="text-sm opacity-80">{brand.longName}</p>
            <p className="text-sm italic mt-2 opacity-90">"{brand.slogan}"</p>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-2" style={{ color: brand.colors.primary }}>Contact Us</h5>
            <p className="text-sm opacity-80">
              <a href={`mailto:${brand.email}`} className="hover:underline">{brand.email}</a>
            </p>
            <p className="text-sm opacity-80">
              <a href={`tel:${brand.mobile.replace(/\s/g, '')}`} className="hover:underline">{brand.mobile}</a>
            </p>
             <p className="text-sm opacity-80">
              <a href={brand.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {brand.website}
              </a>
            </p>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-2" style={{ color: brand.colors.primary }}>Follow Us</h5>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map(social => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title={social.name}
                  className={`hover:text-[${brand.colors.primary}] transition-colors`}
                >
                  {React.cloneElement(social.icon, { className: 'w-6 h-6' })}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[rgba(255,223,0,0.3)] text-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} {brand.shortName}. All rights reserved.</p>
          <p className="mt-1">Developed by Adhithya J [ AI Products Engineering Team ]</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;