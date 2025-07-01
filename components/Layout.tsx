
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { BRANDING_CONFIG, SVG_ICONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="flex flex-1 pt-16"> {/* pt-16 to offset fixed Navbar height */}
        <Sidebar isOpen={isSidebarOpen} />
        <main 
          className={`flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}
          style={{ backgroundColor: '#F7FAFC' /* Light gray-blue for content background */ }}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
