
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface ResearchResult {
  summary: string;
  sources: { uri: string; title: string }[];
}

export const generateBlogDraft = async (topic: string): Promise<{ title: string; content: string; tags: string[] }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a high-quality blog post about "${topic}". The output must be valid JSON with fields: title, content (in markdown), and tags (array of strings).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "content", "tags"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const researchTopic = async (topic: string): Promise<ResearchResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Provide a detailed factual summary and latest news about "${topic}" for a blog research paper. Include key dates and statistics.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const summary = response.text || "No summary available.";
  const sources: { uri: string; title: string }[] = [];

  // Extract URLs from grounding metadata
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  chunks.forEach((chunk: any) => {
    if (chunk.web) {
      sources.push({
        uri: chunk.web.uri,
        title: chunk.web.title || "Reference"
      });
    }
  });

  return { summary, sources };
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A futuristic, artistic, high-resolution header image for a blog post about: ${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return 'https://picsum.photos/1200/600';
  } catch (error) {
    console.error("Image generation failed:", error);
    return 'https://picsum.photos/1200/600';
  }
};

export const chatWithPost = async (postContent: string, userMessage: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an assistant for a blog. The context is the following article: \n\n${postContent}\n\nUser Question: ${userMessage}`,
    config: {
      systemInstruction: "Keep your answers concise and professional. Refer only to the provided article if possible."
    }
  });
  return response.text || "I'm sorry, I couldn't process that.";
};
