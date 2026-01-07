
import { GoogleGenAI, Type } from "@google/genai";

// Pomoćna funkcija za dobijanje AI klijenta sa validnim ključem
const getAI = () => {
  const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;
  if (!apiKey) {
    console.warn("⚠️ Gemini API ključ nedostaje. AI funkcije neće raditi.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const parsePriceList = async (rawText: string) => {
  const ai = getAI();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parsiraj sledeći tekst u listu digitalnih proizvoda za platformu bakšis.net. 
      Svaki proizvod mora imati: name, description, price (broj), i type (izaberi najlogičniji od: TAROT_READING, EBOOK, SERVICE, CONSULTATION).
      
      Tekst kreatora: "${rawText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            products: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  type: { type: Type.STRING }
                },
                required: ["name", "price", "type"]
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text).products;
  } catch (error) {
    console.error("AI Price Parser Error:", error);
    return null;
  }
};

export const generateAIHostResponse = async (userMessage: string, history: { role: string, content: string }[]) => {
  const ai = getAI();
  if (!ai) return "Trenutno sam na pauzi (nedostaje API ključ), ali bakšis.net i dalje čuva tvojih 95% zarade!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: "Ti si Baksica, digitalni agent za bakšis.net. Tvoj cilj je da ubediš kreatore da pređu kod nas jer zadržavaju 95% zarade. Isplate su isključivo na Payoneer.",
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (e) {
    return "Izgleda da je nastala mala greška u komunikaciji, ali suština je ista: Ne daj svoje procente drugima!";
  }
};
