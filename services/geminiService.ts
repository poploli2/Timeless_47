import { GoogleGenAI } from "@google/genai";
import { DateIdeaParams, LoveLetterParams } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = 'gemini-2.5-flash';

/**
 * Polishes a memory entry to sound more poetic or correct grammar.
 */
export const polishMemoryContent = async (rawText: string, mood: string): Promise<string> => {
  if (!process.env.API_KEY) return rawText;
  
  try {
    const prompt = `You are a romantic editor. Rewrite the following diary entry to be more evocative, warm, and clear, matching the mood: ${mood}. Keep the original meaning but improve the flow. 
    
    Original text: "${rawText}"`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || rawText;
  } catch (error) {
    console.error("Error polishing memory:", error);
    return rawText;
  }
};

/**
 * Generates creative date ideas based on parameters.
 */
export const generateDateIdeas = async (params: DateIdeaParams): Promise<string> => {
  if (!process.env.API_KEY) return "Please configure your API Key to use this feature.";

  try {
    const prompt = `Suggest 3 creative and romantic date ideas for a couple. 
    Constraints:
    - Weather: ${params.weather}
    - Budget: ${params.budget}
    - Vibe: ${params.vibe}
    
    Format the output as a clean list with emojis.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Could not generate ideas at this time.";
  } catch (error) {
    console.error("Error generating date ideas:", error);
    return "Error connecting to AI service.";
  }
};

/**
 * Generates a love letter.
 */
export const generateLoveLetter = async (params: LoveLetterParams, partnerName: string): Promise<string> => {
  if (!process.env.API_KEY) return "Please configure your API Key to use this feature.";

  try {
    const prompt = `Write a ${params.length} love letter to my partner named ${partnerName}.
    Context/Occasion: ${params.context}.
    Tone: ${params.tone}.
    Make it sincere and personal.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Could not generate letter.";
  } catch (error) {
    console.error("Error generating letter:", error);
    return "Error connecting to AI service.";
  }
};

/**
 * Generates a relationship question for the quiz.
 */
export const generateRelationshipQuestion = async (): Promise<string> => {
  if (!process.env.API_KEY) return "What is your favorite memory of us?";

  try {
    const prompt = `Generate a single, fun, and thought-provoking question for a couple to answer about their relationship or each other. Keep it short and engaging.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text?.trim() || "What is your favorite memory of us?";
  } catch (error) {
    console.error("Error generating question:", error);
    return "What is your favorite memory of us?";
  }
};