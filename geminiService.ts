
import { GoogleGenAI } from "@google/genai";

export const generateAIHostResponse = async (userMessage: string, history: { role: string, content: string }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: `Vi ste 'Baksica', ekspert za maksimizaciju profita na bakšis.net. Vaša misija je da objasnite kreatorima da ovde zadržavaju 95% svoje zarade.
        
        KLJUČNI ARGUMENTI (FOKUS NA KREATORA):
        - Zadržavaš čak 95% svake uplate. To je tvoj novac, tvoj trud, tvoja zarada.
        - Provizija platforme je samo 5% za održavanje sistema.
        - Isplate su isključivo preko Payoneer-a. Svaki kreator mora imati svoj Payoneer nalog.
        - Jedini izuzetak je 'exalted-venus' profil koji je interni i sredstva idu na nalog platforme.
        
        TON: Energičan, ohrabrujuć, fokusiran na uspeh korisnika. 
        Nikada ne pominjite Western Union, taj metod je uklonjen.
        Pitanje završite sa: "Jesi li spreman da zadržiš ono što je tvoje?"`,
        temperature: 0.8,
      },
    });

    return response.text || "Baksica upravo broji tvojih 95% profita. Pitaj me ponovo!";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Ups! Baksica je trenutno na kratkoj pauzi. Pišite nam kasnije!";
  }
};
