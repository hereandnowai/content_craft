
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BRANDING_CONFIG, NAVIGATION_ITEMS } from '../constants';
import { NavItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { brand } = BRANDING_CONFIG;

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ backgroundColor: brand.colors.secondary }}
    >
      <div className="p-4 space-y-2">
        {NAVIGATION_ITEMS.map((item: NavItem) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-md transition-colors duration-150 ease-in-out text-sm font-medium
               ${isActive 
                  ? `bg-[${brand.colors.primary}] text-[${brand.colors.secondary}]` 
                  : `text-gray-200 hover:bg-[rgba(255,223,0,0.2)] hover:text-[${brand.colors.primary}]`
               }`
            }
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
      {/* Copyright text removed from here to be handled by the main Footer component */}
    </aside>
  );
};

export default Sidebar;