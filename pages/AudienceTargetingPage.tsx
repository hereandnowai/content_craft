
import React, { useState, useCallback } from 'react';
import { BRANDING_CONFIG, SVG_ICONS } from '../constants';
import { callGeminiApi } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { DemographicAdaptationResult, BrandingConfig } from '../types';

interface AudienceTargetingPageProps {
  apiKey: string | undefined;
}

const AudienceTargetingPage: React.FC<AudienceTargetingPageProps> = ({ apiKey }) => {
  const { brand } = BRANDING_CONFIG;

  const [originalContent, setOriginalContent] = useState('');
  const [targetDemographics, setTargetDemographics] = useState('');
  const [adaptationResult, setAdaptationResult] = useState<DemographicAdaptationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass = `w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[${brand.colors.primary}] focus:border-[${brand.colors.primary}] transition-shadow duration-150 shadow-sm bg-white text-black placeholder-gray-500`;
  const labelClass = `block text-sm font-medium mb-1 text-gray-700`;
  const buttonClass = (isLoading: boolean, isDisabled: boolean) =>
    `px-6 py-2.5 text-md font-semibold rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${isLoading || isDisabled
      ? `bg-gray-400 text-gray-700 cursor-not-allowed`
      : `text-[${brand.colors.secondary}] bg-[${brand.colors.primary}] hover:bg-yellow-300 focus:ring-[${brand.colors.primary}]`
    }`;

  const parseJsonResponse = <T,>(jsonStr: string, typeGuard: (obj: any) => obj is T, errorContext: string): T | null => {
    let cleanedJsonStr = jsonStr.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanedJsonStr.match(fenceRegex);
    if (match && match[2]) {
      cleanedJsonStr = match[2].trim();
    }
    try {
      const parsedOutput = JSON.parse(cleanedJsonStr);
      if (typeGuard(parsedOutput)) {
        return parsedOutput;
      }
      throw new Error(`Parsed JSON does not match expected ${errorContext} structure. Received: ${JSON.stringify(parsedOutput).substring(0,200)}`);
    } catch (parseError: any) {
      console.error(`Failed to parse JSON response for ${errorContext}:`, parseError);
      throw new Error(`Failed to parse AI response for ${errorContext}. Raw response snippet: ${jsonStr.substring(0, 300)}...`);
    }
  };

  const generateDemographicAdaptationPrompt = (content: string, demographics: string, brandProfile: BrandingConfig['brand']): string => {
    return `
You are an expert Content Personalization Strategist for ${brandProfile.shortName}.
Our brand voice is "Professional yet approachable, innovation-focused".
Our slogan is "${brandProfile.slogan}".

Analyze the following 'Original Content' and adapt a key snippet of it (or provide specific actionable suggestions) to better resonate with the 'Target Demographic' provided.
The goal is to make the content more engaging and relevant to this specific group without losing the core message or violating the brand voice.

Original Content:
"""
${content}
"""

Target Demographic:
"${demographics}"

Provide the following in your analysis and recommendations:
1.  **targetDemographic**: Confirm the target demographic you are addressing.
2.  **adaptedContentSnippet**: Provide an example of how a key part of the original content could be rewritten or adapted. This could be a direct rewrite of a sentence or paragraph, or specific examples of phrasing changes. If a direct rewrite isn't feasible for a snippet, provide highly concrete examples of changes.
3.  **adaptationRationale**: A list of 2-4 bullet points explaining why these specific adaptations (language, tone, examples, references, etc.) would appeal to the target demographic.
4.  **overallSuggestions**: A list of 2-3 broader suggestions for adapting the *entire* piece of content for this demographic, beyond the snippet.

Output the result as a JSON object with the exact structure:
{
  "targetDemographic": "The specified target demographic",
  "adaptedContentSnippet": "The adapted content snippet or highly specific examples of changes.",
  "adaptationRationale": ["Rationale point 1...", "Rationale point 2..."],
  "overallSuggestions": ["Overall suggestion 1...", "Overall suggestion 2..."]
}
Ensure the JSON is valid. Focus on actionable advice.
`;
  };

  const handleAdaptationSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setError("API Key is not configured.");
      return;
    }
    if (!originalContent.trim() || !targetDemographics.trim()) {
      setError("Please provide both original content and target demographics.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAdaptationResult(null);
    try {
      const prompt = generateDemographicAdaptationPrompt(originalContent, targetDemographics, brand);
      const geminiResponse = await callGeminiApi(apiKey, prompt);
      const parsedOutput = parseJsonResponse<DemographicAdaptationResult>(
        geminiResponse,
        (obj): obj is DemographicAdaptationResult => 
          obj && 
          typeof obj.targetDemographic === 'string' &&
          typeof obj.adaptedContentSnippet === 'string' &&
          Array.isArray(obj.adaptationRationale) &&
          Array.isArray(obj.overallSuggestions),
        'demographic adaptation'
      );
      if (parsedOutput) setAdaptationResult(parsedOutput);
    } catch (apiError: any) {
      setError(apiError.message || "An unexpected error occurred during content adaptation.");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, originalContent, targetDemographics, brand]);

  const otherFeatures = [
    "Psychographic Profiling Assistance",
    "Industry-Specific Messaging Tools",
    "Buyer Persona Integration",
    "Customer Journey Stage Optimization",
    "A/B Testing Content Variations Support",
    "Engagement Pattern Analysis Insights",
    "Conversion Optimization Suggestions",
  ];

  return (
    <div className="p-4 md:p-6 space-y-8">
      <header className="flex items-center mb-6">
        <span className="p-3 rounded-full mr-4" style={{ backgroundColor: brand.colors.secondary, color: brand.colors.primary }}>
            {React.cloneElement(SVG_ICONS.audience, { className: 'w-8 h-8' })}
        </span>
        <h1 className="text-3xl font-bold" style={{ color: brand.colors.secondary }}>Audience Targeting & Personalization</h1>
      </header>
      
      {/* Demographic-Based Content Adaptation Tool */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-1" style={{ color: brand.colors.secondary }}>
          1. Demographic-Based Content Adaptation
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Adapt your content to better resonate with specific demographic groups.
        </p>
        <form onSubmit={handleAdaptationSubmit} className="space-y-4">
          <div>
            <label htmlFor="originalContent" className={labelClass}>
              Original Content: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="originalContent"
              name="originalContent"
              rows={8}
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              className={inputClass}
              placeholder="Paste your full content here..."
              required
            />
          </div>
          <div>
            <label htmlFor="targetDemographics" className={labelClass}>
              Target Demographics (e.g., "Tech-savvy millennials", "Parents of young children"): <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="targetDemographics"
              name="targetDemographics"
              value={targetDemographics}
              onChange={(e) => setTargetDemographics(e.target.value)}
              className={inputClass}
              placeholder="Describe the target demographic group..."
              required
            />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isLoading || !apiKey || !originalContent.trim() || !targetDemographics.trim()} className={buttonClass(isLoading, !apiKey || !originalContent.trim() || !targetDemographics.trim())}>
              {isLoading ? ( <span className="flex items-center justify-center"> <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Adapting Content... </span> ) : ( <span className="flex items-center justify-center"> {React.cloneElement(SVG_ICONS.audience, {className: "w-5 h-5"})} <span className="ml-2">Adapt for Demographic</span> </span> )}
            </button>
            {!apiKey && <p className="text-xs text-red-600 mt-2 text-left">API Key not configured.</p>}
          </div>
        </form>
        {error && ( <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"> <p>{error}</p> </div> )}
        {isLoading && <LoadingSpinner />}
        {adaptationResult && !isLoading && !error && (
          <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm">
            <h3 className="text-lg font-semibold mb-2" style={{ color: brand.colors.secondary }}>Adaptation Results for: <em className="italic">{adaptationResult.targetDemographic}</em></h3>
            
            <div>
              <strong className="block mb-1">Adapted Content Snippet / Key Suggestions:</strong>
              <div className="p-3 bg-white border border-gray-300 rounded-md shadow-sm whitespace-pre-wrap">{adaptationResult.adaptedContentSnippet}</div>
            </div>
            
            {adaptationResult.adaptationRationale.length > 0 && (
              <div>
                <strong className="block mb-1">Rationale for Adaptations:</strong>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  {adaptationResult.adaptationRationale.map((rationale, i) => <li key={i}>{rationale}</li>)}
                </ul>
              </div>
            )}
            
            {adaptationResult.overallSuggestions.length > 0 && (
              <div>
                <strong className="block mb-1">Overall Suggestions for Full Content:</strong>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                  {adaptationResult.overallSuggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Other Features Placeholder */}
      <section className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: brand.colors.secondary }}>
          More Audience Targeting Tools (Coming Soon)
        </h2>
        <p className="text-gray-700 mb-4">
          We're continuously expanding our suite of tools to help you connect more effectively with your audience. Future enhancements will include:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 pl-4">
          {otherFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
         <p className="mt-6 text-md font-semibold text-center py-6 px-4 rounded-md" style={{ backgroundColor: brand.colors.primary, color: brand.colors.secondary }}>
          Stay tuned for these exciting additions!
        </p>
      </section>
    </div>
  );
};

export default AudienceTargetingPage;