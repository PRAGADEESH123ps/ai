import type { GenerativePart } from '../types';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the data:mime/type;base64, part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function fileToGenerativePart(file: File): Promise<GenerativePart> {
  const base64EncodedData = await fileToBase64(file);
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export function base64UrlToGenerativePart(url: string): GenerativePart {
    const match = url.match(/^data:(image\/.+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid base64 URL format for conversion.");
    }
    const mimeType = match[1];
    const data = match[2];

    return {
        inlineData: {
            data,
            mimeType,
        },
    };
}