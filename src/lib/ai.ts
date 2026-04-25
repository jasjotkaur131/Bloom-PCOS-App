import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" 
});

export async function generateText(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: { systemInstruction },
    });
    return response.text || "No response. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong. Please try again.";
  }
}

export async function generateJSON(
  prompt: string,
  schema: any,
  systemInstruction?: string
): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini JSON Error:", error);
    return null;
  }
}

export async function analyzeImage(
  base64Image: string,
  prompt: string,
  schema?: any
): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt },
        ],
      },
      config: schema ? {
        responseMimeType: "application/json",
        responseSchema: schema,
      } : undefined,
    });
    if (schema) return JSON.parse(response.text || "{}");
    return response.text;
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return null;
  }
}