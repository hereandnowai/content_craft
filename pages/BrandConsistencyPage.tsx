
import React, { useState, useCallback } from 'react';
import { BRANDING_CONFIG, SVG_ICONS } from '../constants';
import { callGeminiApi } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ToneAnalysisResult, SloganCheckResult, BrandingConfig } from '../types';

interface BrandConsistencyPageProps {
  apiKey: string | undefined;
}

const BrandConsistencyPage: React.FC<BrandConsistencyPageProps> = ({ apiKey }) => {
  const { brand } = BRANDING_CONFIG;

  // --- Tone Analysis State ---
  const [toneInputText, setToneInputText] = useState('');
  const [toneAnalysisResult, setToneAnalysisResult] = useState<ToneAnalysisResult | null>(null);
  const [isToneLoading, setIsToneLoading] = useState(false);
  const [toneError, setToneError] = useState<string | null>(null);

  // --- Slogan Check State ---
  const [sloganInputText, setSloganInputText] = useState('');
  const [sloganCheckResult, setSloganCheckResult] = useState<SloganCheckResult | null>(null);
  const [isSloganLoading, setIsSloganLoading] = useState(false);
  const [sloganError, setSloganError] = useState<string | null>(null);

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

  // --- Tone Analysis Logic ---
  const generateToneAnalysisPrompt = (text: string, brandProfile: BrandingConfig['brand']): string => {
    return `
You are an expert Brand Analyst for ${brandProfile.shortName}.
Our brand voice is defined as: "Professional yet approachable, innovation-focused".

Analyze the following text content for its tone of voice:
"""
${text}
"""

Provide the following:
1.  **identifiedTone**: A concise description of the dominant tone(s) you identify in the text (e.g., "Formal and academic", "Friendly and conversational", "Enthusiastic and persuasive").
2.  **alignmentFeedback**: Your assessment of how well the identified tone aligns with our brand voice ("Professional yet approachable, innovation-focused"). Be specific.
3.  **suggestions**: A list of actionable suggestions (2-3) to better align the text with our brand voice, if necessary. If it's well-aligned, suggest ways to maintain or enhance it.

Output the result as a JSON object with the exact structure:
{
  "identifiedTone": "Your identified tone(s)",
  "alignmentFeedback": "Your detailed feedback on alignment with 'Professional yet approachable, innovation-focused'.",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
Ensure the JSON is valid.
`;
  };

  const handleToneAnalysisSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setToneError("API Key is not configured.");
      return;
    }
    if (!toneInputText.trim()) {
      setToneError("Please provide text content for tone analysis.");
      return;
    }
    setIsToneLoading(true);
    setToneError(null);
    setToneAnalysisResult(null);
    try {
      const prompt = generateToneAnalysisPrompt(toneInputText, brand);
      const geminiResponse = await callGeminiApi(apiKey, prompt);
      const parsedOutput = parseJsonResponse<ToneAnalysisResult>(
        geminiResponse,
        (obj): obj is ToneAnalysisResult => obj && typeof obj.identifiedTone === 'string' && typeof obj.alignmentFeedback === 'string' && Array.isArray(obj.suggestions),
        'tone analysis'
      );
      if (parsedOutput) setToneAnalysisResult(parsedOutput);
    } catch (apiError: any) {
      setToneError(apiError.message || "An unexpected error occurred during tone analysis.");
    } finally {
      setIsToneLoading(false);
    }
  }, [apiKey, toneInputText, brand]);

  // --- Slogan Check Logic ---
  const generateSloganCheckPrompt = (text: string, slogan: string, brandName: string): string => {
    return `
You are a Brand Compliance Checker for ${brandName}.
Our company slogan is: "${slogan}".

Analyze the following text content to determine if the slogan is present and used appropriately.
"""
${text}
"""

Provide the following:
1.  **isSloganPresent**: A boolean value (true or false) indicating if the exact slogan is found.
2.  **sloganFoundText** (optional): If present, the exact text snippet where the slogan was identified.
3.  **usageContext** (optional): If present, briefly describe the context of its use (e.g., "Found in the concluding paragraph", "Used as a tagline under a heading").
4.  **suggestions**: A list of actionable suggestions (1-2) regarding the slogan's use. If not present, suggest if and where it might be appropriate. If present, comment on its effectiveness.

Output the result as a JSON object with the exact structure:
{
  "isSloganPresent": true/false,
  "sloganFoundText": "The exact slogan text if found",
  "usageContext": "Context of slogan usage if found",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
Ensure the JSON is valid.
`;
  };

  const handleSloganCheckSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setSloganError("API Key is not configured.");
      return;
    }
    if (!sloganInputText.trim()) {
      setSloganError("Please provide text content for slogan checking.");
      return;
    }
    setIsSloganLoading(true);
    setSloganError(null);
    setSloganCheckResult(null);
    try {
      const prompt = generateSloganCheckPrompt(sloganInputText, brand.slogan, brand.shortName);
      const geminiResponse = await callGeminiApi(apiKey, prompt);
      const parsedOutput = parseJsonResponse<SloganCheckResult>(
        geminiResponse,
        (obj): obj is SloganCheckResult => obj && typeof obj.isSloganPresent === 'boolean' && Array.isArray(obj.suggestions),
        'slogan check'
      );
      if (parsedOutput) setSloganCheckResult(parsedOutput);
    } catch (apiError: any) {
      setSloganError(apiError.message || "An unexpected error occurred during slogan check.");
    } finally {
      setIsSloganLoading(false);
    }
  }, [apiKey, sloganInputText, brand]);

  return (
    <div className="p-4 md:p-6 space-y-8">
      <header className="flex items-center mb-6">
        <span className="p-3 rounded-full mr-4" style={{ backgroundColor: brand.colors.secondary, color: brand.colors.primary }}>
            {React.cloneElement(SVG_ICONS.brand, { className: 'w-8 h-8' })}
        </span>
        <h1 className="text-3xl font-bold" style={{ color: brand.colors.secondary }}>Brand Consistency Engine</h1>
      </header>
      
      <p className="text-gray-700 mb-6">
        Maintain a cohesive brand identity across all your content. Utilize the tools below to ensure your messaging aligns perfectly with {brand.shortName}'s standards.
      </p>

      {/* Tone of Voice Enforcement */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-1" style={{ color: brand.colors.secondary }}>
          1. Tone of Voice Enforcement
        </h2>
        <p className="text-sm text-gray-600 mb-4">Analyze content to ensure it aligns with our brand voice: <em>"Professional yet approachable, innovation-focused."</em></p>
        <form onSubmit={handleToneAnalysisSubmit} className="space-y-4">
          <div>
            <label htmlFor="toneInputText" className={labelClass}>
              Content for Tone Analysis: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="toneInputText"
              name="toneInputText"
              rows={6}
              value={toneInputText}
              onChange={(e) => setToneInputText(e.target.value)}
              className={inputClass}
              placeholder="Paste your content here..."
              required
            />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isToneLoading || !apiKey || !toneInputText.trim()} className={buttonClass(isToneLoading, !apiKey || !toneInputText.trim())}>
              {isToneLoading ? ( <span className="flex items-center justify-center"> <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Analyzing Tone... </span> ) : ( <span className="flex items-center justify-center"> {React.cloneElement(SVG_ICONS.brand, {className: "w-5 h-5"})} <span className="ml-2">Analyze Tone</span> </span> )}
            </button>
            {!apiKey && <p className="text-xs text-red-600 mt-2 text-left">API Key not configured.</p>}
          </div>
        </form>
        {toneError && ( <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"> <p>{toneError}</p> </div> )}
        {isToneLoading && <LoadingSpinner />}
        {toneAnalysisResult && !isToneLoading && !toneError && (
          <div className="mt-6 space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm">
            <h3 className="text-lg font-semibold mb-2" style={{ color: brand.colors.secondary }}>Tone Analysis Results:</h3>
            <p><strong>Identified Tone:</strong> {toneAnalysisResult.identifiedTone}</p>
            <div><strong>Alignment Feedback:</strong> <p className="pl-1 text-gray-700 whitespace-pre-wrap">{toneAnalysisResult.alignmentFeedback}</p></div>
            {toneAnalysisResult.suggestions.length > 0 && (
              <div><strong>Suggestions:</strong> <ul className="list-disc list-inside ml-4 text-gray-700">{toneAnalysisResult.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}</ul></div>
            )}
          </div>
        )}
      </section>

      {/* Slogan Integration Check */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-1" style={{ color: brand.colors.secondary }}>
          2. Slogan Integration Check
        </h2>
        <p className="text-sm text-gray-600 mb-4">Verify if our slogan <em>"{brand.slogan}"</em> is present and appropriately used in your content.</p>
        <form onSubmit={handleSloganCheckSubmit} className="space-y-4">
          <div>
            <label htmlFor="sloganInputText" className={labelClass}>
              Content for Slogan Check: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="sloganInputText"
              name="sloganInputText"
              rows={6}
              value={sloganInputText}
              onChange={(e) => setSloganInputText(e.target.value)}
              className={inputClass}
              placeholder="Paste your content here..."
              required
            />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isSloganLoading || !apiKey || !sloganInputText.trim()} className={buttonClass(isSloganLoading, !apiKey || !sloganInputText.trim())}>
              {isSloganLoading ? ( <span className="flex items-center justify-center"> <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Checking Slogan... </span> ) : ( <span className="flex items-center justify-center"> {React.cloneElement(SVG_ICONS.brand, {className: "w-5 h-5"})} <span className="ml-2">Check Slogan</span> </span> )}
            </button>
            {!apiKey && <p className="text-xs text-red-600 mt-2 text-left">API Key not configured.</p>}
          </div>
        </form>
        {sloganError && ( <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"> <p>{sloganError}</p> </div> )}
        {isSloganLoading && <LoadingSpinner />}
        {sloganCheckResult && !isSloganLoading && !sloganError && (
          <div className="mt-6 space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm">
            <h3 className="text-lg font-semibold mb-2" style={{ color: brand.colors.secondary }}>Slogan Check Results:</h3>
            <p><strong>Slogan Present:</strong> <span className={sloganCheckResult.isSloganPresent ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{sloganCheckResult.isSloganPresent ? 'Yes' : 'No'}</span></p>
            {sloganCheckResult.isSloganPresent && sloganCheckResult.sloganFoundText && (
              <p><strong>Found Text:</strong> <em className="text-gray-700">"{sloganCheckResult.sloganFoundText}"</em></p>
            )}
            {sloganCheckResult.isSloganPresent && sloganCheckResult.usageContext && (
              <p><strong>Usage Context:</strong> {sloganCheckResult.usageContext}</p>
            )}
            {sloganCheckResult.suggestions.length > 0 && (
              <div><strong>Suggestions:</strong> <ul className="list-disc list-inside ml-4 text-gray-700">{sloganCheckResult.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}</ul></div>
            )}
          </div>
        )}
      </section>
      
    </div>
  );
};

export default BrandConsistencyPage;
