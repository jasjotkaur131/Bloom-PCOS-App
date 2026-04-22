import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const model = "gemini-3-flash-preview";

export async function generateText(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
}

export async function generateJSON(prompt: string, schema: any, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API JSON Error:", error);
    return null;
  }
}

export async function analyzeImage(base64Image: string, prompt: string, schema?: any) {
  try {
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    };
    const textPart = {
      text: prompt,
    };
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
      config: schema ? {
        responseMimeType: "application/json",
        responseSchema: schema,
      } : undefined,
    });
    
    if (schema) {
      return JSON.parse(response.text || "{}");
    }
    return response.text;
  } catch (error) {
    console.error("Gemini API Image Error:", error);
    return null;
  }
}
