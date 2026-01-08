
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeVideoForSocials = async (videoUrl: string, creatorContext: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Ti si Social Media Director za bakšis.net. Analiziraj video: ${videoUrl}.
      Kreator se bavi: ${creatorContext}.
      
      ZADATAK: Predloži 3 viralna segmenta (klipa). Za svaki klip generiši:
      1. Tačno vreme početka i kraja (npr. "01:20" do "02:10").
      2. Viralni 'Hook' (rečenica koja se pojavljuje na ekranu u prve 3 sekunde).
      3. Kompletne 'Captions' (titlove) za ceo trajanje klipa, formatirane za lako čitanje.
      4. Predlog najboljeg formata (9:16 ili 16:9) i rezolucije (720p/1080p).
      5. Optimizovan opis za TikTok, Instagram i X.
      
      OSIGURAJ da titlovi budu privlačni i prilagođeni balkanskom slengu ako je prikladno.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  startTime: { type: Type.STRING },
                  endTime: { type: Type.STRING },
                  duration: { type: Type.NUMBER },
                  hook: { type: Type.STRING },
                  captions: { type: Type.STRING },
                  selectedRatio: { type: Type.STRING },
                  selectedRes: { type: Type.STRING },
                  platformCaptions: {
                    type: Type.OBJECT,
                    properties: {
                      tiktok: { type: Type.STRING },
                      instagram: { type: Type.STRING },
                      x: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text || '{"suggestions":[]}';
    const parsed = JSON.parse(text);
    
    return parsed.suggestions.map((s: any) => ({
      ...s,
      selectedRatio: s.selectedRatio || '9:16',
      selectedRes: s.selectedRes || '1080p'
    }));
  } catch (error) {
    console.error("AI Clipping Error:", error);
    return null;
  }
};

export const getSalesExpertAdvice = async (userMessage: string, isRegistered: boolean, userData?: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemPrompt = isRegistered 
    ? `Ti si Baksica, Sales Expert za bakšis.net. Korisnik JE REGISTROVAN. 
       FOKUS: Prodaj 'Growth Boost' ($4.99/100 min).
       Objasni da sa 100 minuta mogu pokriti ceo mesec sadržaja na 3 mreže.
       Budi podrška, profesionalna i malo "bossy" oko njihovog vremena.`
    : `Ti si Baksica, Sales Expert. Korisnik NIJE REGISTROVAN. 
       FOKUS: Zašto OnlyFans nije za njih (uzimaju im previše).
       Pomeni 'Social Orbit' alat koji pretvara YouTube u novac.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9,
      },
    });
    return response.text || "Registruj se i iskoristi 100 minuta AI magije za rast profila.";
  } catch (e) {
    return "Mreža je puna kreatora. Probaj ponovo za sekund.";
  }
};

export const parsePriceList = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Pretvori ovaj tekstualni opis usluga u strukturirani JSON niz proizvoda za prodavnicu.
      Tekst: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              type: { type: Type.STRING }
            },
            required: ["name", "description", "price", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Price Parse Error:", error);
    return null;
  }
};
