
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Diagnosis } from "../types";

const SYSTEM_PROMPT = `আপনি বাংলাদেশের একজন বিশেষজ্ঞ কৃষিবিদ। 
আপনার কাজ হলো ব্যবহারকারীর দেওয়া ফসলের রোগের ছবি দেখে সেটি শনাক্ত করা এবং বাংলায় বিস্তারিত প্রতিকার প্রদান করা।

আপনাকে অবশ্যই নিচের ফরম্যাটে উত্তর দিতে হবে (JSON ফরম্যাটে):
1. রোগের নাম (diseaseName)
2. আক্রান্ত ফসল (cropName)
3. লক্ষণসমূহ (symptoms - string array)
4. জৈব প্রতিকার (remedyOrganic)
5. রাসায়নিক প্রতিকার (remedyChemical)
6. প্রতিরোধমূলক ব্যবস্থা (preventiveMeasures - string array)

ভাষা সবসময় সহজবোধ্য বাংলা হতে হবে যাতে সাধারণ কৃষকরা বুঝতে পারেন।`;

export const diagnoseCropDisease = async (base64Image: string): Promise<Diagnosis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1],
            },
          },
          {
            text: "এই ছবির শস্যের রোগটি শনাক্ত করুন এবং প্রতিকার বলুন। উত্তরটি অবশ্যই উপরে দেওয়া JSON স্কিমা অনুযায়ী হতে হবে।",
          },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          cropName: { type: Type.STRING },
          symptoms: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          remedyOrganic: { type: Type.STRING },
          remedyChemical: { type: Type.STRING },
          preventiveMeasures: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["diseaseName", "cropName", "symptoms", "remedyOrganic", "remedyChemical", "preventiveMeasures"]
      }
    },
  });

  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr) as Diagnosis;
};
