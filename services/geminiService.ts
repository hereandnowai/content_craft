
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ContentGenerationParams, BrandingConfig } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

export const generateContentCraftAiPrompt = (params: ContentGenerationParams, brandConfig: BrandingConfig['brand']): string => {
  // Construct the detailed prompt based on user inputs and brand identity
  // This prompt structure is derived from the user's extensive requirements.
  
  let prompt = `You are ContentCraft AI, the flagship content creation engine for ${brandConfig.longName}.
Slogan: "${brandConfig.slogan}"
Brand Colors: Primary ${brandConfig.colors.primary}, Secondary ${brandConfig.colors.secondary}
Brand Voice: Professional yet approachable, innovation-focused.

CONTEXT ANALYSIS:
- Content Type: ${params.contentType}
- Target Audience: ${params.targetAudience || 'Not specified'}
- Business Objective: ${params.businessObjective || 'Not specified'}
- Brand Voice: Professional yet approachable, innovation-focused (${brandConfig.shortName})
- Content Goals: ${params.contentGoals || 'Not specified'}

CONTENT SPECIFICATIONS:
- Word Count: ${params.wordCount || 'Platform appropriate'}
- Tone: ${params.tone || `Align with ${brandConfig.shortName} brand personality (Professional, innovative, approachable)`}
- Keywords: ${params.keywords || 'Not specified, use general best practices'}
- CTAs: ${params.ctas || 'Suggest relevant CTAs'}
- Visual Elements: ${params.visualElements || 'Suggest relevant visual elements'}

PLATFORM OPTIMIZATION:
- Format Requirements: ${params.formatRequirements || 'Standard for the specified content type/platform'}
- Engagement Tactics: ${params.engagementTactics || 'Suggest relevant engagement tactics'}
- Algorithm Considerations: ${params.algorithmConsiderations || 'General best practices for visibility'}
- Cross-Platform Adaptation: ${params.crossPlatformAdaptation || 'Consider how this content could be adapted'}

OUTPUT DELIVERY:
Please provide a JSON response object with the following 10 keys. Ensure the content for each key is comprehensive and directly usable.
The JSON object should have exactly these keys: "primaryContent", "seoMetadata", "socialMediaVariants", "hashtagStrategies", "visualContentDescriptions", "performanceOptimizationTips", "abTestingVariations", "contentCalendarPlacementSuggestions", "crossPlatformRepurposingIdeas", "engagementEnhancementStrategies".

Example structure for the JSON response (fill with actual generated content):
\`\`\`json
{
  "primaryContent": "The main generated content for ${params.contentType}. Should be well-formatted, potentially with Markdown if appropriate (e.g., for blog posts).",
  "seoMetadata": {
    "title": "SEO-optimized Title (approx 50-60 chars)",
    "description": "Compelling meta description (approx 150-160 chars)",
    "keywords": ["primary_keyword", "secondary_keyword", "long_tail_keyword"],
    "altText": "Descriptive alt text for a representative image, if applicable."
  },
  "socialMediaVariants": [
    { "platform": "Instagram Post", "content": "Short, engaging Instagram caption with relevant emojis and call to action. Max 2200 chars." },
    { "platform": "LinkedIn Post", "content": "Professional LinkedIn post focusing on value and insights. Include relevant hashtags. Max 3000 chars." },
    { "platform": "X (Twitter) Thread (3 Tweets)", "content": "Tweet 1: Hook...\\nTweet 2: Main point...\\nTweet 3: CTA/Link... (each tweet max 280 chars)" }
  ],
  "hashtagStrategies": {
    "trending": ["#relevantTrendingHashtag1", "#relevantTrendingHashtag2"],
    "niche": ["#nicheSpecificHashtag1", "#nicheSpecificHashtag2", "#brandHashtag"]
  },
  "visualContentDescriptions": [
    "Description for a hero image: A vibrant image representing [topic], conveying [emotion/concept].",
    "Concept for a short video: A quick tutorial demonstrating [key point], ending with a call to action."
  ],
  "performanceOptimizationTips": [
    "Tip 1: Ensure fast page load speed for better user experience and SEO.",
    "Tip 2: Use clear and compelling CTAs to guide user actions."
  ],
  "abTestingVariations": [
    { "variationA": "Headline Option A for A/B testing.", "variationB": "Headline Option B for A/B testing.", "notes": "Test which headline gets more clicks." },
    { "variationA": "CTA Option A for A/B testing.", "variationB": "CTA Option B for A/B testing.", "notes": "Test which CTA converts better." }
  ],
  "contentCalendarPlacementSuggestions": [
    "Suggestion 1: Publish this blog post on a Tuesday morning for optimal B2B reach.",
    "Suggestion 2: Schedule social media promotion throughout the week following publication."
  ],
  "crossPlatformRepurposingIdeas": [
    "Idea 1: Turn key points from this blog post into an infographic.",
    "Idea 2: Create a short video summarizing the main content for TikTok or Instagram Reels."
  ],
  "engagementEnhancementStrategies": [
    "Strategy 1: Ask open-ended questions in social media posts to encourage comments.",
    "Strategy 2: Run a poll related to the content topic to boost interaction."
  ]
}
\`\`\`

Adhere to all Quality Assurance Protocols: fact-checking, originality, brand compliance, SEO best practices (Flesch score 60+), conversion optimization, legal compliance (if applicable, e.g., disclaimers for ad copy), and accessibility.
The content MUST reflect ${brandConfig.shortName}'s commitment to innovation and embody the spirit of "${brandConfig.slogan}". Prioritize user experience, engagement, and conversion.
Generate the JSON output now.
`;
  return prompt;
};


export const callGeminiApi = async (apiKey: string, prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey }); // Use apiKey from function argument
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json", // Request JSON output
        temperature: 0.7, // Adjust for creativity vs. factuality
        topP: 0.95,
        topK: 64,
        // For ContentCraft AI, thinking should generally be enabled for higher quality.
        // Omit thinkingConfig to use default (enabled).
        // If low latency is ever critical for a specific sub-feature:
        // thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text; // The text property contains the raw string, hopefully JSON
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    if (error.message && error.message.includes('API key not valid')) {
        throw new Error('Gemini API Error: The provided API key is not valid. Please check your API_KEY environment variable.');
    }
    if (error.message && error.message.includes('quota')) {
        throw new Error('Gemini API Error: You have exceeded your API quota. Please check your Google Cloud Console.');
    }
    throw new Error(`Gemini API Error: ${error.message || 'An unknown error occurred'}`);
  }
};
