
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { AIResponse, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiResponse = async (prompt: string, transcript: string, useSearch: boolean, systemInstruction?: string): Promise<AIResponse> => {
  const fullPrompt = `${prompt}\n\nHere is the full court transcript for context:\n\n---\n${transcript}\n---`;

  try {
    const config = {
      ...(systemInstruction && { systemInstruction }),
      ...(useSearch && { tools: [{ googleSearch: {} }] }),
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config,
    });
    
    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return { text, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return { text: `An error occurred: ${error.message}` };
    }
    return { text: "An unknown error occurred while contacting the AI." };
  }
};
