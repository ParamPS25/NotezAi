import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType
    }
  };
}

export const generateSummaryFromImages = async (images) => {
  const parts = images.map(({ buffer, mimeType }) =>
    fileToGenerativePart(buffer, mimeType)
  );

  const prompt = {
    role: 'user',
    parts: [
      { text: 'These are screenshots of the notes. make a clean , detailed and understandable notes based on these screenshots.' },
      ...parts
    ]
  };

  const result = await model.generateContent({
    contents: [prompt]
  });

  const response = result.response;
  return response.text();
};
