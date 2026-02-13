import { GoogleGenAI } from "@google/genai";
import { MessageRequest } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateValentineMessage = async (request: MessageRequest): Promise<string> => {
  if (!apiKey) {
    // Fallback if no API key is present for demo purposes
    return "To my dearest Valentine,\n\nEvery moment with you is a treasure I hold close to my heart. You make my world brighter and my smile wider.\n\nForever yours.";
  }

  try {
    const prompt = `Write a short, heart-warming, and ${request.tone} Valentine's Day message for ${request.recipient || "my love"}. Keep it under 40 words so it fits on a card. Do not include quotes or explanations, just the message body.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Happy Valentine's Day! (AI Generation Failed)";
  } catch (error) {
    console.error("Error generating message:", error);
    return "To my wonderful Valentine,\n\nYou mean the world to me. I'm so lucky to have you in my life today and always.\n\nWith all my love.";
  }
};