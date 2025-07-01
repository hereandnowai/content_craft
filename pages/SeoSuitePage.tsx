
import React, { useState, useCallback } from 'react';
import { BRANDING_CONFIG, SVG_ICONS } from '../constants';
import { callGeminiApi } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { SeoMetaTags, HeaderAnalysisResult, ReadabilityScores } from '../types';

interface SeoSuitePageProps {
  apiKey: string | undefined;
}

const SeoSuitePage: React.FC<SeoSuitePageProps> = ({ apiKey }) => {
  const { brand } = BRANDING_CONFIG;

  // --- Meta Title & Description State ---
  const [metaInputText, setMetaInputText] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [generatedMeta, setGeneratedMeta] = useState<SeoMetaTags | null>(null);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);

  // --- Header Analysis State ---
  const [headerInputText, setHeaderInputText] = useState('');
  const [headerAnalysisResult, setHeaderAnalysisResult] = useState<HeaderAnalysisResult | null>(null);
  const [isHeaderLoading, setIsHeaderLoading] = useState(false);
  const [headerError, setHeaderError] = useState<string | null>(null);

  // --- Readability Score State ---
  const [readabilityInputText, setReadabilityInputText] = useState('');
  const [readabilityScores, setReadabilityScores] = useState<ReadabilityScores | null>(null);
  const [isReadabilityLoading, setIsReadabilityLoading] = useState(false);
  const [readabilityError, setReadabilityError] = useState<string | null>(null);


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
      throw new Error(`Parsed JSON does not match expected ${errorContext} structure.`);
    } catch (parseError: any) {
      console.error(`Failed to parse JSON response for ${errorContext}:`, parseError);
      throw new Error(`Failed to parse AI response for ${errorContext}. Raw response snippet: ${jsonStr.substring(0, 300)}...`);
    }
  };


  // --- Meta Title & Description Logic ---
  const generateMetaPrompt = (text: string, kw: string): string => {
    return `
You are an expert SEO copywriter for ${brand.shortName} (${brand.website}).
Our slogan is "${brand.slogan}".
Based on the following input text (which could be a topic, existing content, or a URL that you should conceptually understand) and optional target keywords, generate an SEO-optimized meta title and meta description.

Input Text:
"""
${text}
"""

Target Keywords (optional): "${kw}"

Constraints for the output:
- Meta Title: Must be compelling, click-worthy, and strictly between 50-60 characters.
- Meta Description: Must be engaging, informative, encourage clicks, and strictly between 150-160 characters.
- Incorporate target keywords naturally if provided and relevant.
- Reflect the brand's innovative and professional tone.

Output the result as a JSON object with the following exact structure:
{
  "metaTitle": "Your generated meta title",
  "metaDescription": "Your generated meta description"
}
Ensure the JSON is valid.
`;
  };

  const handleMetaSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setMetaError("API Key is not configured.");
      return;
    }
    if (!metaInputText.trim()) {
      setMetaError("Please provide some input text (topic, content, or URL).");
      return;
    }
    setIsMetaLoading(true);
    setMetaError(null);
    setGeneratedMeta(null);
    try {
      const prompt = generateMetaPrompt(metaInputText, metaKeywords);
      const geminiResponse = await callGeminiApi(apiKey, prompt);
      const parsedOutput = parseJsonResponse<SeoMetaTags>(
        geminiResponse, 
        (obj): obj is SeoMetaTags => obj && typeof obj.metaTitle === 'string' && typeof obj.metaDescription === 'string',
        'meta tags'
      );
      if (parsedOutput) setGeneratedMeta(parsedOutput);
    } catch (apiError: any) {
      setMetaError(apiError.message || "An unexpected error occurred.");
    } finally {
      setIsMetaLoading(false);
    }
  }, [apiKey, metaInputText, metaKeywords, brand]);

  const CharacterCount: React.FC<{text: string, max: number, idealMin?: number}> = ({ text, max, idealMin }) => {
    const count = text.length;
    let colorClass = 'text-green-600';
    if (count > max || (idealMin && count < idealMin)) {
      colorClass = 'text-red-600 font-semibold';
    } else if (idealMin && (count < idealMin * 1.1 || count > max * 0.9) && !(count >= idealMin && count <=max) ) {
        colorClass = 'text-yellow-600';
    } else if (count === 0 && idealMin === undefined) { // For cases like optional keywords
        return null;
    }
    return <span className={`text-xs ml-2 ${colorClass}`}>({count} chars)</span>;
  };

  // --- Header Analysis Logic ---
  const generateHeaderAnalysisPrompt = (text: string): string => {
    return `
You are an SEO expert for ${brand.shortName}.
Analyze the heading structure (H1-H6) of the following text content.
The input might be plain text, Markdown, or HTML. Identify headings based on common conventions (e.g., '# Title' in Markdown, '<h1>Title</h1>' in HTML, or lines that appear to be titles in plain text).

Input Text:
"""
${text}
"""

Provide the following:
1.  Count of H1 headings.
2.  A list of structural issues (e.g., "Multiple H1 tags found", "Skipped heading level from H2 to H4", "No H1 tag found", "H1 tag is not the first heading").
3.  A list of actionable suggestions for improvement (e.g., "Ensure there is only one H1 tag per page", "Use headings in sequential order").
4.  A brief text summary of the heading structure found (e.g., "H1: Main Title, H2: Section A, H3: Subsection A.1...").

Output the result as a JSON object with the following exact structure:
{
  "h1Count": 0,
  "issues": ["Issue 1", "Issue 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "structureSummary": "H1: Example Title, H2: Example Section..."
}
Ensure the JSON is valid. If no headings are identifiable, report that in the structureSummary and h1Count as 0.
`;
  };

  const handleHeaderAnalysisSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setHeaderError("API Key is not configured.");
      return;
    }
    if (!headerInputText.trim()) {
      setHeaderError("Please provide text content for header analysis.");
      return;
    }
    setIsHeaderLoading(true);
    setHeaderError(null);
    setHeaderAnalysisResult(null);
    try {
      const prompt = generateHeaderAnalysisPrompt(headerInputText);
      const geminiResponse = await callGeminiApi(apiKey, prompt);
      const parsedOutput = parseJsonResponse<HeaderAnalysisResult>(
        geminiResponse,
        (obj): obj is HeaderAnalysisResult => obj && typeof obj.h1Count === 'number' && Array.isArray(obj.issues) && Array.isArray(obj.suggestions) && typeof obj.structureSummary === 'string',
        'header analysis'
      );
      if (parsedOutput) setHeaderAnalysisResult(parsedOutput);
    } catch (apiError: any) {
      setHeaderError(apiError.message || "An unexpected error occurred.");
    } finally {
      setIsHeaderLoading(false);
    }
  }, [apiKey, headerInputText, brand]);

  // --- Readability Score Logic ---
  const generateReadabilityPrompt = (text: string): string => {
    return `
You are an SEO and content expert for ${brand.shortName}.
Calculate the Flesch Reading Ease score and Flesch-Kincaid Grade Level for the following text.
Provide a brief, helpful interpretation of these scores in the context of web content readability.

Input Text:
"""
${text}
"""

Output the result as a JSON object with the following exact structure:
{
  "fleschReadingEase": 0.0,
  "fleschKincaidGradeLevel": 0.0,
  "interpretation": "Brief interpretation of the scores and what they mean for general web audience."
}
Ensure the JSON is valid. If the text is too short to calculate meaningful scores, indicate this in the interpretation.
`;
  };

  const handleReadabilitySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setReadabilityError("API Key is not configured.");
      return;
    }
    if (!readabilityInputText.trim()) {
      setReadabilityError("Please provide text content for readability analysis.");
      return;
    }
    setIsReadabilityLoading(true);
    setReadabilityError(null);
    setReadabilityScores(null);
    try {
      const prompt = generateReadabilityPrompt(readabilityInputText);
      const geminiResponse = await callGeminiApi(apiKey, prompt);
       const parsedOutput = parseJsonResponse<ReadabilityScores>(
        geminiResponse,
        (obj): obj is ReadabilityScores => obj && typeof obj.fleschReadingEase === 'number' && typeof obj.fleschKincaidGradeLevel === 'number' && typeof obj.interpretation === 'string',
        'readability scores'
      );
      if (parsedOutput) setReadabilityScores(parsedOutput);
    } catch (apiError: any) {
      setReadabilityError(apiError.message || "An unexpected error occurred.");
    } finally {
      setIsReadabilityLoading(false);
    }
  }, [apiKey, readabilityInputText, brand]);

  // All JavaScript and JSX blocks must be correctly structured.
  return (
    <div className="p-4 md:p-6 space-y-8">
      <header className="flex items-center mb-6">
        <span className="p-3 rounded-full mr-4" style={{ backgroundColor: brand.colors.secondary, color: brand.colors.primary }}>
            {React.cloneElement(SVG_ICONS.seo, { className: 'w-8 h-8' })}
        </span>
        <h1 className="text-3xl font-bold" style={{ color: brand.colors.secondary }}>SEO Optimization Suite</h1>
      </header>

      {/* Meta Title & Description Generator */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: brand.colors.secondary }}>
          1. Meta Title & Description Generator
        </h2>
        <form onSubmit={handleMetaSubmit} className="space-y-4">
          <div>
            <label htmlFor="metaInputText" className={labelClass}>
              Topic / Existing Content / URL: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="metaInputText"
              name="metaInputText"
              rows={4}
              value={metaInputText}
              onChange={(e) => setMetaInputText(e.target.value)}
              className={inputClass}
              placeholder="Enter a blog post topic, paste existing content, or provide a URL..."
              required
            />
          </div>
          <div>
            <label htmlFor="metaKeywords" className={labelClass}>
              Target Keywords (comma-separated, optional):
            </label>
            <input
              type="text"
              id="metaKeywords"
              name="metaKeywords"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              className={inputClass}
              placeholder="e.g., AI content marketing, SEO best practices"
            />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isMetaLoading || !apiKey || !metaInputText.trim()} className={buttonClass(isMetaLoading, !apiKey || !metaInputText.trim())}>
              {isMetaLoading ? ( <span className="flex items-center justify-center"> <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Generating... </span> ) : ( <span className="flex items-center justify-center"> {React.cloneElement(SVG_ICONS.generator, {className: "w-5 h-5"})} <span className="ml-2">Generate Meta Tags</span> </span> )}
            </button>
            {!apiKey && <p className="text-xs text-red-600 mt-2 text-left">API Key not configured.</p>}
          </div>
        </form>
        {metaError && ( <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"> <p>{metaError}</p> </div> )}
        {isMetaLoading && <LoadingSpinner />}
        {generatedMeta && !isMetaLoading && !metaError && (
          <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold" style={{ color: brand.colors.secondary }}>Generated Meta Tags:</h3>
            <div>
              <label className={`${labelClass} text-md`}> Meta Title: <CharacterCount text={generatedMeta.metaTitle} max={60} idealMin={50} /> </label>
              <div className="p-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-black"> {generatedMeta.metaTitle} </div>
            </div>
            <div>
              <label className={`${labelClass} text-md`}> Meta Description: <CharacterCount text={generatedMeta.metaDescription} max={160} idealMin={150} /> </label>
              <div className="p-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-black whitespace-pre-wrap"> {generatedMeta.metaDescription} </div>
            </div>
          </div>
        )}
      </section>

      {/* Header Structure Optimization */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: brand.colors.secondary }}>
          2. Header Structure Optimization (H1-H6 Analysis)
        </h2>
        <form onSubmit={handleHeaderAnalysisSubmit} className="space-y-4">
          <div>
            <label htmlFor="headerInputText" className={labelClass}>
              Content for Header Analysis (Paste HTML, Markdown, or plain text): <span className="text-red-500">*</span>
            </label>
            <textarea
              id="headerInputText"
              name="headerInputText"
              rows={8}
              value={headerInputText}
              onChange={(e) => setHeaderInputText(e.target.value)}
              className={inputClass}
              placeholder="Paste your article content here..."
              required
            />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isHeaderLoading || !apiKey || !headerInputText.trim()} className={buttonClass(isHeaderLoading, !apiKey || !headerInputText.trim())}>
              {isHeaderLoading ? ( <span className="flex items-center justify-center"> <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Analyzing Headers... </span> ) : ( <span className="flex items-center justify-center"> {React.cloneElement(SVG_ICONS.seo, {className: "w-5 h-5"})} <span className="ml-2">Analyze Headers</span> </span> )}
            </button>
            {!apiKey && <p className="text-xs text-red-600 mt-2 text-left">API Key not configured.</p>}
          </div>
        </form>
        {headerError && ( <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"> <p>{headerError}</p> </div> )}
        {isHeaderLoading && <LoadingSpinner />}
        {headerAnalysisResult && !isHeaderLoading && !headerError && (
          <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold" style={{ color: brand.colors.secondary }}>Header Analysis Results:</h3>
            <p><strong>H1 Count:</strong> {headerAnalysisResult.h1Count}</p>
            <div><strong>Structure Summary:</strong> <pre className="whitespace-pre-wrap text-sm bg-white p-2 border rounded">{headerAnalysisResult.structureSummary || 'N/A'}</pre></div>
            {headerAnalysisResult.issues.length > 0 && (
              <div><strong>Issues Found:</strong> <ul className="list-disc list-inside ml-4 text-sm">{headerAnalysisResult.issues.map((issue, i) => <li key={i}>{issue}</li>)}</ul></div>
            )}
            {headerAnalysisResult.suggestions.length > 0 && (
              <div><strong>Suggestions:</strong> <ul className="list-disc list-inside ml-4 text-sm">{headerAnalysisResult.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}</ul></div>
            )}
          </div>
        )}
      </section>

      {/* Readability Score Analysis */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: brand.colors.secondary }}>
          3. Readability Score Analysis (Flesch-Kincaid)
        </h2>
        <form onSubmit={handleReadabilitySubmit} className="space-y-4">
          <div>
            <label htmlFor="readabilityInputText" className={labelClass}>
              Content for Readability Analysis: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="readabilityInputText"
              name="readabilityInputText"
              rows={8}
              value={readabilityInputText}
              onChange={(e) => setReadabilityInputText(e.target.value)}
              className={inputClass}
              placeholder="Paste your text content here to check its readability..."
              required
            />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isReadabilityLoading || !apiKey || !readabilityInputText.trim()} className={buttonClass(isReadabilityLoading, !apiKey || !readabilityInputText.trim())}>
              {isReadabilityLoading ? ( <span className="flex items-center justify-center"> <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Analyzing Readability... </span> ) : ( <span className="flex items-center justify-center"> {React.cloneElement(SVG_ICONS.seo, {className: "w-5 h-5"})} <span className="ml-2">Analyze Readability</span> </span> )}
            </button>
            {!apiKey && <p className="text-xs text-red-600 mt-2 text-left">API Key not configured.</p>}
          </div>
        </form>
        {readabilityError && ( <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"> <p>{readabilityError}</p> </div> )}
        {isReadabilityLoading && <LoadingSpinner />}
        {readabilityScores && !isReadabilityLoading && !readabilityError && (
          <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold" style={{ color: brand.colors.secondary }}>Readability Analysis Results:</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div className="p-3 bg-white border rounded-md">
                    <p className="font-semibold">Flesch Reading Ease:</p>
                    <p className="text-2xl" style={{color: brand.colors.secondary}}>{readabilityScores.fleschReadingEase.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-white border rounded-md">
                    <p className="font-semibold">Flesch-Kincaid Grade Level:</p>
                    <p className="text-2xl" style={{color: brand.colors.secondary}}>{readabilityScores.fleschKincaidGradeLevel.toFixed(1)}</p>
                </div>
            </div>
            <div className="mt-3">
              <strong className="text-sm font-semibold">Interpretation:</strong>
              <p className="whitespace-pre-wrap text-sm bg-white p-3 border rounded-md mt-1 shadow-sm">{readabilityScores.interpretation || 'N/A'}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SeoSuitePage;
