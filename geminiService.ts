
import { GoogleGenAI, Type } from "@google/genai";

export const syncYouTubeChannel = async (handle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Pronađi najnovije informacije o YouTube kanalu korisnika ${handle}. 
      Potrebni su mi:
      1. URL profilne slike.
      2. URL banner slike (header).
      3. Lista od 5 najnovijih standardnih videa (naslov i URL).
      4. Lista od 5 najnovijih Shorts videa (naslov i URL).
      5. Kratak opis kanala.
      6. Glavne boje brenda (hex kodovi).`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            avatarUrl: { type: Type.STRING },
            bannerUrl: { type: Type.STRING },
            bio: { type: Type.STRING },
            brandColors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            latestVideos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  thumbnail: { type: Type.STRING }
                }
              }
            },
            latestShorts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("YouTube Sync Error:", error);
    return null;
  }
};

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
      5. Optimizovan opis za TikTok, Instagram i X.`,
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
