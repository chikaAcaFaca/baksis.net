
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
      2. Viralni 'Hook' (titlovana rečenica koja ide na početak).
      3. Kompletne 'Captions' (titlove) za ceo klip.
      4. Optimizovan opis za TikTok, Instagram i X.
      
      Fokusiraj se na 'Portrait' format (9:16) kao primarni za Shorts/Reels.`,
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

    const parsed = JSON.parse(response.text || '{"suggestions":[]}');
    // Default vrednosti za format i rezoluciju
    return parsed.suggestions.map((s: any) => ({
      ...s,
      selectedRatio: '9:16',
      selectedRes: '1080p'
    }));
  } catch (error) {
    console.error("AI Clipping Error:", error);
    return null;
  }
};

export const getSalesExpertAdvice = async (userMessage: string, isRegistered: boolean, userData?: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemPrompt = isRegistered 
    ? `Ti si Baksica, vrhunski Sales Expert za bakšis.net. Korisnik JE REGISTROVAN. 
       PRODAJ MU: Growth Boost za samo 4.99$. Objasni da za tu cenu dobija 100 MINUTA AI video clippinga.
       Poređenje: Drugi alati koštaju po 20-30$, mi mu dajemo sve za 5$ uz čuvanje 95% zarade.
       Budi profesionalna, ali i "drugarica" koja mu štedi pare.`
    : `Ti si Baksica, Sales Expert. Korisnik NIJE REGISTROVAN. 
       Cilj: Prodaj mu ideju bakšis.net-a. Fokusiraj se na to da OnlyFans uzima 20%, a mi 5%. 
       Nagovesti mu 'Social Orbit' alat koji mu omogućava da 100 minuta videa pretvori u stotine Shortsa za samo 4.99$.`;

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
