
import React, { useState, useCallback } from 'react';
import { BRANDING_CONFIG, CONTENT_TYPE_OPTIONS, SVG_ICONS } from '../constants';
import { ContentType, ContentGenerationParams, GeneratedContentOutput } from '../types';
import { generateContentCraftAiPrompt, callGeminiApi } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneratedOutputDisplay from '../components/GeneratedOutputDisplay';

interface ContentGeneratorPageProps {
  apiKey: string | undefined;
}

const ContentGeneratorPage: React.FC<ContentGeneratorPageProps> = ({ apiKey }) => {
  const { brand } = BRANDING_CONFIG;
  const [formData, setFormData] = useState<ContentGenerationParams>({
    contentType: ContentType.BLOG_POST,
    targetAudience: '',
    businessObjective: '',
    contentGoals: '',
    wordCount: '800-1200 words',
    tone: 'Professional yet approachable, innovation-focused',
    keywords: '',
    ctas: '',
    visualElements: '',
    formatRequirements: '',
    engagementTactics: '',
    algorithmConsiderations: '',
    crossPlatformAdaptation: '',
  });
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setError("API Key is not configured. Please ensure the API_KEY environment variable is set.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedOutput(null);

    try {
      const prompt = generateContentCraftAiPrompt(formData, brand);
      const geminiResponse = await callGeminiApi(apiKey, prompt);
      
      // Attempt to parse the JSON response
      let jsonStr = geminiResponse.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      try {
        const parsedOutput: GeneratedContentOutput = JSON.parse(jsonStr);
        // Basic validation of the parsed structure
        if (parsedOutput && parsedOutput.primaryContent && parsedOutput.seoMetadata) {
            setGeneratedOutput(parsedOutput);
        } else {
            throw new Error("Parsed JSON does not match expected structure.");
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response from AI:", parseError);
        setError(`Failed to parse AI response. Raw response: ${geminiResponse.substring(0,500)}...`);
        setGeneratedOutput({ // Provide a fallback structure with the raw response
            primaryContent: `Error: Could not parse AI response. Raw output:\n${geminiResponse}`,
            seoMetadata: { title: "Error", description: "Error processing response", keywords: [] },
            socialMediaVariants: [],
            hashtagStrategies: { trending: [], niche: [] },
            visualContentDescriptions: [],
            performanceOptimizationTips: [],
            abTestingVariations: [],
            contentCalendarPlacementSuggestions: [],
            crossPlatformRepurposingIdeas: [],
            engagementEnhancementStrategies: [],
        });
      }

    } catch (apiError: any) {
      console.error("Error generating content:", apiError);
      setError(apiError.message || "An unexpected error occurred while generating content.");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, formData, brand]);

  const inputClass = `w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[${brand.colors.primary}] focus:border-[${brand.colors.primary}] transition-shadow duration-150 shadow-sm bg-white text-black placeholder-gray-500`;
  const labelClass = `block text-sm font-medium mb-1 text-gray-700`;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: brand.colors.secondary }}>
          Content Generation Engine
        </h1>
        <p className="text-gray-600">
          Craft compelling content tailored to your needs. Fill in the details below to get started.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contentType" className={labelClass}>Content Type:</label>
            <select id="contentType" name="contentType" value={formData.contentType} onChange={handleInputChange} className={inputClass} required>
              {CONTENT_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="targetAudience" className={labelClass}>Target Audience (Demographics, interests, pain points):</label>
            <input type="text" id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} className={inputClass} required placeholder="e.g., Small business owners, tech enthusiasts, DIY crafters" />
          </div>
          <div>
            <label htmlFor="businessObjective" className={labelClass}>Business Objective (Lead gen, brand awareness, sales, engagement):</label>
            <input type="text" id="businessObjective" name="businessObjective" value={formData.businessObjective} onChange={handleInputChange} className={inputClass} required placeholder="e.g., Increase website traffic by 20%" />
          </div>
           <div>
            <label htmlFor="contentGoals" className={labelClass}>Content Goals (Inform, persuade, entertain, convert):</label>
            <input type="text" id="contentGoals" name="contentGoals" value={formData.contentGoals} onChange={handleInputChange} className={inputClass} required placeholder="e.g., Educate users about new features" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold pt-4 border-t border-gray-200" style={{ color: brand.colors.secondary }}>Content Specifications (Optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="wordCount" className={labelClass}>Word Count (e.g., 800-1200 words):</label>
            <input type="text" id="wordCount" name="wordCount" value={formData.wordCount} onChange={handleInputChange} className={inputClass} placeholder="e.g., 800-1200 words" />
          </div>
          <div>
            <label htmlFor="tone" className={labelClass}>Tone:</label>
            <input type="text" id="tone" name="tone" value={formData.tone} onChange={handleInputChange} className={inputClass} placeholder="e.g., Professional, witty, empathetic" />
          </div>
          <div>
            <label htmlFor="keywords" className={labelClass}>Keywords (comma-separated):</label>
            <input type="text" id="keywords" name="keywords" value={formData.keywords} onChange={handleInputChange} className={inputClass} placeholder="e.g., AI content, digital marketing, SEO trends" />
          </div>
          <div>
            <label htmlFor="ctas" className={labelClass}>Call-to-Actions (CTAs):</label>
            <input type="text" id="ctas" name="ctas" value={formData.ctas} onChange={handleInputChange} className={inputClass} placeholder="e.g., Learn more, Sign up, Get started" />
          </div>
        </div>
        <div>
            <label htmlFor="visualElements" className={labelClass}>Visual Elements (Image descriptions, video concepts):</label>
            <textarea id="visualElements" name="visualElements" value={formData.visualElements} onChange={handleInputChange} rows={3} className={inputClass} placeholder="e.g., Hero image of diverse team collaborating, short animated explainer video" />
        </div>

        <h2 className="text-xl font-semibold pt-4 border-t border-gray-200" style={{ color: brand.colors.secondary }}>Platform Optimization (Optional)</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="formatRequirements" className={labelClass}>Format Requirements (Character limits, hashtag strategies):</label>
                <input type="text" id="formatRequirements" name="formatRequirements" value={formData.formatRequirements} onChange={handleInputChange} className={inputClass} placeholder="e.g., Instagram: <2200 chars, 3-5 relevant hashtags" />
            </div>
            <div>
                <label htmlFor="engagementTactics" className={labelClass}>Engagement Tactics (Questions, polls, UGC):</label>
                <input type="text" id="engagementTactics" name="engagementTactics" value={formData.engagementTactics} onChange={handleInputChange} className={inputClass} placeholder="e.g., Ask a question, run a poll, encourage sharing" />
            </div>
         </div>
         <div>
            <label htmlFor="algorithmConsiderations" className={labelClass}>Algorithm Considerations (Platform best practices):</label>
            <textarea id="algorithmConsiderations" name="algorithmConsiderations" value={formData.algorithmConsiderations} onChange={handleInputChange} rows={2} className={inputClass} placeholder="e.g., Post during peak hours, use video for higher reach on Facebook" />
         </div>
         <div>
            <label htmlFor="crossPlatformAdaptation" className={labelClass}>Cross-Platform Adaptation Notes:</label>
            <textarea id="crossPlatformAdaptation" name="crossPlatformAdaptation" value={formData.crossPlatformAdaptation} onChange={handleInputChange} rows={2} className={inputClass} placeholder="e.g., Repurpose blog for LinkedIn article, create carousel for Instagram" />
         </div>

        <div className="pt-4 text-right">
          <button 
            type="submit" 
            disabled={isLoading || !apiKey}
            className={`px-8 py-3 text-lg font-semibold rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isLoading || !apiKey
                          ? `bg-gray-400 text-gray-700 cursor-not-allowed` 
                          : `text-[${brand.colors.secondary}] bg-[${brand.colors.primary}] hover:bg-yellow-300 focus:ring-[${brand.colors.primary}]`
                        }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                {SVG_ICONS.generator} <span className="ml-2">Generate Content</span>
              </span>
            )}
          </button>
          {!apiKey && <p className="text-xs text-red-600 mt-2 text-left">API Key not configured. Content generation is disabled.</p>}
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <h4 className="font-bold">Error</h4>
          <p>{error}</p>
        </div>
      )}

      {isLoading && <LoadingSpinner />}

      {generatedOutput && !isLoading && !error && (
        <GeneratedOutputDisplay output={generatedOutput} />
      )}
    </div>
  );
};

export default ContentGeneratorPage;
