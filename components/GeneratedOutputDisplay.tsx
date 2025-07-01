
import React, { useState } from 'react';
import { GeneratedContentOutput, SeoMetadata, SocialMediaVariant, HashtagStrategies, ABTestingVariation } from '../types';
import { BRANDING_CONFIG, SVG_ICONS } from '../constants';

interface GeneratedOutputDisplayProps {
  output: GeneratedContentOutput;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const { brand } = BRANDING_CONFIG;

  return (
    <div className="border border-gray-300 rounded-lg mb-3 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold focus:outline-none transition-colors duration-150"
        style={{ 
          backgroundColor: isOpen ? brand.colors.secondary : '#E2E8F0', /* bg-gray-200 */
          color: isOpen ? brand.colors.primary : brand.colors.secondary,
        }}
      >
        <span>{title}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {SVG_ICONS.chevronDown}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

const GeneratedOutputDisplay: React.FC<GeneratedOutputDisplayProps> = ({ output }) => {
  const { brand } = BRANDING_CONFIG;
  
  const renderSeoMetadata = (data: SeoMetadata) => (
    <div className="space-y-2 text-sm">
      <p><strong>Title:</strong> {data.title}</p>
      <p><strong>Description:</strong> {data.description}</p>
      <p><strong>Keywords:</strong> {data.keywords.join(', ')}</p>
      {data.altText && <p><strong>Alt Text:</strong> {data.altText}</p>}
    </div>
  );

  const renderSocialMediaVariants = (data: SocialMediaVariant[]) => (
    <div className="space-y-3">
      {data.map((variant, index) => (
        <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="font-semibold text-md mb-1" style={{color: brand.colors.secondary}}>{variant.platform}</h4>
          <p className="whitespace-pre-wrap text-sm">{variant.content}</p>
        </div>
      ))}
    </div>
  );

  const renderHashtagStrategies = (data: HashtagStrategies) => (
    <div className="space-y-2 text-sm">
      <p><strong>Trending:</strong> {data.trending.join(', ')}</p>
      <p><strong>Niche:</strong> {data.niche.join(', ')}</p>
    </div>
  );
  
  const renderList = (items: string[], title: string) => (
    <div className="text-sm">
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>
  );

  const renderABTestingVariations = (data: ABTestingVariation[]) => (
     <div className="space-y-3">
      {data.map((variant, index) => (
        <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="font-semibold text-md mb-1" style={{color: brand.colors.secondary}}>Variation Pair {index + 1}</h4>
          <p className="text-sm"><strong>A:</strong> {variant.variationA}</p>
          <p className="text-sm"><strong>B:</strong> {variant.variationB}</p>
          {variant.notes && <p className="text-xs mt-1 text-gray-600"><em>Notes: {variant.notes}</em></p>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-2xl font-semibold mb-4" style={{ color: brand.colors.secondary }}>
        Generated Content Output
      </h3>

      <AccordionItem title="1. Primary Content" initiallyOpen={true}>
        <div className="prose max-w-none whitespace-pre-wrap p-2 bg-gray-50 rounded-md border border-gray-200">
          {output.primaryContent}
        </div>
      </AccordionItem>

      <AccordionItem title="2. SEO Metadata">
        {renderSeoMetadata(output.seoMetadata)}
      </AccordionItem>

      <AccordionItem title="3. Social Media Variants (3-5 platform-specific versions)">
        {renderSocialMediaVariants(output.socialMediaVariants)}
      </AccordionItem>

      <AccordionItem title="4. Hashtag Strategies (trending and niche-specific)">
        {renderHashtagStrategies(output.hashtagStrategies)}
      </AccordionItem>

      <AccordionItem title="5. Visual Content Descriptions (for image/video creation)">
        {renderList(output.visualContentDescriptions, "Visual Content Descriptions")}
      </AccordionItem>

      <AccordionItem title="6. Performance Optimization Tips">
        {renderList(output.performanceOptimizationTips, "Performance Optimization Tips")}
      </AccordionItem>

      <AccordionItem title="7. A/B Testing Variations">
        {renderABTestingVariations(output.abTestingVariations)}
      </AccordionItem>

      <AccordionItem title="8. Content Calendar Placement Suggestions">
        {renderList(output.contentCalendarPlacementSuggestions, "Content Calendar Placement Suggestions")}
      </AccordionItem>

      <AccordionItem title="9. Cross-Platform Repurposing Ideas">
        {renderList(output.crossPlatformRepurposingIdeas, "Cross-Platform Repurposing Ideas")}
      </AccordionItem>

      <AccordionItem title="10. Engagement Enhancement Strategies">
        {renderList(output.engagementEnhancementStrategies, "Engagement Enhancement Strategies")}
      </AccordionItem>
    </div>
  );
};

export default GeneratedOutputDisplay;
