
import React from 'react';

export interface BrandingConfig {
  brand: {
    shortName: string;
    longName: string;
    website: string;
    email: string;
    mobile: string;
    slogan: string;
    colors: {
      primary: string;
      secondary: string;
    };
    logo: {
      title: string;
      favicon: string;
    };
    chatbot: {
      avatar: string;
      face: string;
    };
    socialMedia: {
      blog: string;
      linkedin: string;
      instagram: string;
      github: string;
      x: string;
      youtube: string;
    };
  };
}

export enum ContentType {
  BLOG_POST = "Blog Post (SEO-optimized, 800-3000 words)",
  MARKETING_COPY = "Marketing Copy (sales pages, landing pages, product descriptions)",
  SOCIAL_MEDIA_CONTENT = "Social Media Content (platform-specific optimization)",
  EMAIL_MARKETING = "Email Marketing Campaigns (sequences, newsletters, promotions)",
  AD_COPY = "Ad Copy & Headlines (Google Ads, Facebook Ads, display ads)",
  VIDEO_SCRIPT = "Video Scripts (YouTube, TikTok, Instagram Reels)",
  PODCAST_SCRIPT = "Podcast Scripts & Show Notes",
  PRESS_RELEASE = "Press Releases & Media Kits",
  WEBSITE_COPY = "Website Copy (About pages, service descriptions)",
  LEAD_MAGNET = "Lead Magnets (eBooks, whitepapers, checklists)",
}

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  altText?: string;
}

export interface SocialMediaVariant {
  platform: string;
  content: string;
}

export interface HashtagStrategies {
  trending: string[];
  niche: string[];
}

export interface ABTestingVariation {
  variationA: string;
  variationB: string;
  notes?: string;
}

export interface GeneratedContentOutput {
  primaryContent: string;
  seoMetadata: SeoMetadata;
  socialMediaVariants: SocialMediaVariant[];
  hashtagStrategies: HashtagStrategies;
  visualContentDescriptions: string[];
  performanceOptimizationTips: string[];
  abTestingVariations: ABTestingVariation[];
  contentCalendarPlacementSuggestions: string[];
  crossPlatformRepurposingIdeas: string[];
  engagementEnhancementStrategies: string[];
}

export interface ContentGenerationParams {
  contentType: ContentType;
  targetAudience: string;
  businessObjective: string;
  contentGoals: string;
  wordCount?: string;
  tone?: string;
  keywords?: string;
  ctas?: string;
  visualElements?: string;
  formatRequirements?: string;
  engagementTactics?: string;
  algorithmConsiderations?: string;
  crossPlatformAdaptation?: string;
}

// For navigation
export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

// For SEO Suite - Meta Tag Generator
export interface SeoMetaTags {
  metaTitle: string;
  metaDescription: string;
}

// For SEO Suite - Header Analysis
export interface HeaderAnalysisResult {
  h1Count: number;
  issues: string[];
  suggestions: string[];
  structureSummary: string; // e.g., "H1: Main Title, H2: Section A..."
}

// For SEO Suite - Readability Scores
export interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGradeLevel: number;
  interpretation: string; // Brief explanation of the scores
}

// For Brand Consistency - Tone Analysis
export interface ToneAnalysisResult {
  identifiedTone: string; // e.g., "Formal, Optimistic"
  alignmentFeedback: string; // e.g., "The tone is well-aligned with the brand voice." or "The tone is slightly too casual."
  suggestions: string[]; // e.g., ["Consider using more active voice.", "Incorporate industry-specific terminology if appropriate."]
}

// For Brand Consistency - Slogan Check
export interface SloganCheckResult {
  isSloganPresent: boolean;
  sloganFoundText?: string; // The exact text where the slogan was found, if present
  usageContext?: string; // e.g., "Slogan found at the end of the document."
  suggestions: string[]; // e.g., ["Slogan used effectively.", "Consider integrating the slogan in the conclusion."]
}

// For Audience Targeting - Demographic-Based Content Adaptation
export interface DemographicAdaptationResult {
  targetDemographic: string;
  adaptedContentSnippet: string; // Could be a fully rewritten snippet or key suggested changes
  adaptationRationale: string[]; // List of reasons for the changes
  overallSuggestions: string[]; // Broader suggestions for adapting the full content
}