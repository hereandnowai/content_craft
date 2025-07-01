
import React from 'react';
import { BrandingConfig, ContentType, NavItem } from './types';

export const BRANDING_CONFIG: BrandingConfig = {
  brand: {
    shortName: "HERE AND NOW AI",
    longName: "HERE AND NOW AI - Artificial Intelligence Research Institute",
    website: "https://hereandnowai.com",
    email: "info@hereandnowai.com",
    mobile: "+91 996 296 1000",
    slogan: "designed with passion for innovation",
    colors: {
      primary: "#FFDF00", // Golden Yellow
      secondary: "#004040", // Teal
    },
    logo: {
      title: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png",
      favicon: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/favicon-logo-with-name.png",
    },
    chatbot: {
      avatar: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel.jpeg",
      face: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel-face.jpeg",
    },
    socialMedia: {
      blog: "https://hereandnowai.com/blog",
      linkedin: "https://www.linkedin.com/company/hereandnowai/",
      instagram: "https://instagram.com/hereandnow_ai",
      github: "https://github.com/hereandnowai",
      x: "https://x.com/hereandnow_ai",
      youtube: "https://youtube.com/@hereandnow_ai",
    },
  },
};

export const CONTENT_TYPE_OPTIONS = Object.values(ContentType).map(value => ({
  value: value,
  label: value,
}));

// SVG Icons
const createSvgIcon = (path: string): React.ReactElement<React.SVGProps<SVGSVGElement>> => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);
const createSvgIconOutline = (path: string): React.ReactElement<React.SVGProps<SVGSVGElement>> => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);


export const SVG_ICONS = {
  home: createSvgIconOutline("M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M6.75 19.5V12h10.5v7.5A2.25 2.25 0 0115 21.75H9A2.25 2.25 0 016.75 19.5z"),
  generator: createSvgIconOutline("M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624L16.5 21.75l-.398-1.126a3.375 3.375 0 00-2.456-2.456L12.75 18l1.126-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.126a3.375 3.375 0 002.456 2.456L20.25 18l-1.126.398a3.375 3.375 0 00-2.456 2.456z"),
  seo: createSvgIconOutline("M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5"),
  brand: createSvgIconOutline("M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),
  audience: createSvgIconOutline("M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m0 0a9.949 9.949 0 00-5.032 0M18 18.72v-2.172c0-.953-.424-1.809-1.104-2.364a9.938 9.938 0 00-9.792 0c-.68.555-1.104 1.41-1.104 2.364v2.172M15 12a3 3 0 11-6 0 3 3 0 016 0z"),
  calendar: createSvgIconOutline("M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zm2.25-4.5h.008v.008H12v-.008zM15 12.75h.008v.008H15v-.008zm0 2.25h.008v.008H15v-.008zM9.75 12.75h.008v.008H9.75v-.008z"),
  blog: createSvgIcon("M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"), // Simple lines for blog
  linkedin: createSvgIcon("M19.5 3h-15A2.5 2.5 0 002 5.5v13A2.5 2.5 0 004.5 21h15a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0019.5 3zM6.75 17.25h-2.5V8.25h2.5v9zM5.5 6.75A1.25 1.25 0 114.25 5.5 1.25 1.25 0 015.5 6.75zM17.25 17.25h-2.5v-4.67c0-1.12-.02-2.55-1.55-2.55-1.55 0-1.79 1.21-1.79 2.47v4.75h-2.5V8.25h2.4v1.1h.03c.33-.63 1.15-1.29 2.37-1.29 2.54 0 3 1.67 3 3.85v4.39z"),
  instagram: createSvgIcon("M12 1.5A10.5 10.5 0 001.5 12v0A10.5 10.5 0 0012 22.5v0A10.5 10.5 0 0022.5 12v0A10.5 10.5 0 0012 1.5zM12 18a6 6 0 110-12 6 6 0 010 12zM12 15a3 3 0 100-6 3 3 0 000 6zM18.375 6.375a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"),
  github: createSvgIcon("M12 1.5a10.5 10.5 0 00-3.32 20.45 1.018 1.018 0 00.73-.34 1.018 1.018 0 00.28-1.21 7.558 7.558 0 01-.84-2.61c.04-.1.08-.19.12-.28a6.118 6.118 0 016.08-3.05 6.11 6.11 0 014.23 1.83 6.11 6.11 0 011.83 4.23 6.118 6.118 0 01-3.05 6.08c-.1.04-.19.08-.28.12a7.558 7.558 0 01-2.61-.84 1.018 1.018 0 00-1.21.28 1.018 1.018 0 00-.34.73A10.5 10.5 0 0012 22.5 10.5 10.5 0 0012 1.5zM12 6a3 3 0 100 6 3 3 0 000-6z"),
  x: createSvgIcon("M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"),
  youtube: createSvgIcon("M12 1.5A10.5 10.5 0 001.5 12v0A10.5 10.5 0 0012 22.5v0A10.5 10.5 0 0022.5 12v0A10.5 10.5 0 0012 1.5zM9.75 15.75V8.25L15.75 12l-6 3.75z"),
  chevronDown: createSvgIconOutline("M19.5 8.25l-7.5 7.5-7.5-7.5"),
  chevronUp: createSvgIconOutline("M4.5 15.75l7.5-7.5 7.5 7.5"),
  externalLink: createSvgIconOutline("M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"),
  info: createSvgIconOutline("M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"),
  menu: createSvgIconOutline("M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"),
  close: createSvgIconOutline("M6 18L18 6M6 6l12 12"),
};

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: SVG_ICONS.home },
  { name: 'Content Generator', path: '/generator', icon: SVG_ICONS.generator },
  { name: 'SEO Suite', path: '/seo', icon: SVG_ICONS.seo },
  { name: 'Brand Consistency', path: '/brand', icon: SVG_ICONS.brand },
  { name: 'Audience Targeting', path: '/audience', icon: SVG_ICONS.audience },
  // { name: 'Calendar & Automation', path: '/calendar', icon: SVG_ICONS.calendar }, // Removed
];

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
// export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002'; // If image generation is needed