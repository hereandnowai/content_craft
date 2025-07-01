
import React from 'react';
import { Link } from 'react-router-dom';
import { BRANDING_CONFIG, NAVIGATION_ITEMS, SVG_ICONS } from '../constants';

const HomePage: React.FC = () => {
  const { brand } = BRANDING_CONFIG;

  const featureCards = NAVIGATION_ITEMS.filter(item => item.path !== '/');

  return (
    <div className="p-4 md:p-6 space-y-8">
      <header 
        className="p-8 rounded-xl shadow-lg text-center" 
        style={{ 
          background: `linear-gradient(135deg, ${brand.colors.secondary} 0%, ${brand.colors.primary} 100%)`,
          color: 'white' 
        }}
      >
        <img src={brand.logo.title} alt={`${brand.shortName} Logo`} className="h-20 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to ContentCraft AI</h1>
        <p className="text-xl md:text-2xl mb-4" style={{ color: brand.colors.primary, textShadow: `1px 1px 2px ${brand.colors.secondary}` }}>
          {brand.longName}
        </p>
        <p className="text-lg italic opacity-90">"{brand.slogan}"</p>
      </header>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center" style={{ color: brand.colors.secondary }}>
          Our Core Functionalities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature) => (
            <Link 
              key={feature.name} 
              to={feature.path} 
              className={`p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center bg-white border-2 border-transparent hover:border-[${brand.colors.primary}]`}
            >
              <div 
                className="p-3 rounded-full mb-4" 
                style={{ backgroundColor: brand.colors.secondary, color: brand.colors.primary }}
              >
                {React.cloneElement(feature.icon, { className: 'w-8 h-8' })}
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: brand.colors.secondary }}>
                {feature.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Access powerful tools for {feature.name.toLowerCase()}.
              </p>
              <span 
                className="mt-auto text-sm font-medium py-2 px-4 rounded-md"
                style={{ backgroundColor: brand.colors.primary, color: brand.colors.secondary }}
              >
                Go to {feature.name.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: brand.colors.secondary }}>
          About ContentCraft AI
        </h2>
        <p className="text-gray-700 mb-4">
          ContentCraft AI is the flagship content creation engine for {brand.longName}. We are a multi-functional AI assistant designed to revolutionize content marketing through intelligent automation and brand-consistent content generation. Our goal is to empower your brand with high-quality, engaging content that drives results.
        </p>
        <p className="text-gray-700">
          Explore our suite of tools to generate everything from SEO-optimized blog posts and compelling marketing copy to engaging social media updates and effective email campaigns. Every piece of content is crafted with passion for innovation and a commitment to your brand's success.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
