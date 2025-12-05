
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerativePart, AspectRatio, ImageResolution } from '../types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GenerateOptions {
    model: string;
    resolution: ImageResolution;
    aspectRatio: AspectRatio;
}

function mapAspectRatio(ar: AspectRatio): string {
    // The type AspectRatio now matches the API expected strings exactly
    return ar;
}

export async function generateImageFromParts(
    parts: (GenerativePart | { text: string })[],
    options: GenerateOptions
): Promise<string | null> {
  let retries = 0;
  const maxRetries = 5;
  
  // Create a new instance for every call to ensure the latest API key is used
  // This is crucial when the user selects a key via window.aistudio.openSelectKey()
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  while (true) {
      try {
        const imageConfig: any = {
            aspectRatio: mapAspectRatio(options.aspectRatio)
        };

        if (options.model === 'gemini-3-pro-image-preview') {
            imageConfig.imageSize = options.resolution;
        }

        const response = await ai.models.generateContent({
          model: options.model,
          contents: {
            parts: parts,
          },
          config: {
            responseModalities: [Modality.IMAGE],
            imageConfig: imageConfig,
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              const mimeType = part.inlineData.mimeType;
              return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        return null;

      } catch (error: any) {
        let message = '';
        let status: number | string | undefined;

        if (error instanceof Error) {
            message = error.message;
            // @ts-ignore
            status = error.status || error.code;
        } else if (typeof error === 'object') {
             if (error.error) {
                 message = error.error.message || '';
                 status = error.error.code || error.error.status;
             } else {
                 message = JSON.stringify(error);
                 status = error.status || error.code;
             }
        }
        
        const isQuotaError = status == 429 || status === 'RESOURCE_EXHAUSTED' || message.includes('RESOURCE_EXHAUSTED') || message.includes('429');

        if (isQuotaError) {
             if (retries < maxRetries) {
                 retries++;
                 // Exponential backoff: 4s, 8s, 16s, 32s, 64s
                 const delay = 4000 * Math.pow(2, retries - 1);
                 console.log(`Quota exceeded (429). Retrying in ${delay}ms... (Attempt ${retries}/${maxRetries})`);
                 await wait(delay);
                 continue;
             }
             throw new Error("You exceeded your current quota. Please check your plan and billing details.");
        }
        
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate image. Please check your prompt or API key.");
      }
  }
}
