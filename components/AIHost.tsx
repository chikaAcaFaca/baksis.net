
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Ručna implementacija dekodiranja base64 stringa u Uint8Array.
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Ručna implementacija kodiranja Uint8Array u base64 string.
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Dekodiranje sirovih PCM bajtova u AudioBuffer za AudioContext.
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const AIHost: React.FC = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const audioCtxRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('baksis_logged_in') === 'true';
    setIsLoggedIn(loggedInStatus);

    const timer = setTimeout(() => {
      setShowInvitation(true);
    }, 4000);
    
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(blinkInterval);
    };
  }, [location]);

  const stopVoiceMode = () => {
    if (liveSessionRef.current) {
      try { liveSessionRef.current.close?.(); } catch (e) {}
      liveSessionRef.current = null;
    }
    audioSourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
    audioSourcesRef.current.clear();
    setIsActive(false);
    setIsAiSpeaking(false);
    if (audioCtxRef.current) {
      try { audioCtxRef.current.input.close(); audioCtxRef.current.output.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  const getInstructions = () => {
    const userRole = localStorage.getItem('baksis_user_role');
    const statusText = isLoggedIn ? `Korisnik je REGISTROVAN kao ${userRole}.` : "Korisnik je GOST.";
    
    return `Ti si Baksica, vrhunski Sales Expert za bakšis.net.
          TVOJ STAV: Agresivan prema gubicima novca, zaštitnički nastrojen prema kreatorima.
          STATUS: ${statusText}
          
          ZADATAK:
          - Ako je gost: Objasni zašto gube 20% na drugim sajtovima. Pomeni Payoneer kao jedini spas. Budi drzak i direktan.
          - Ako je registrovan: Nudi "Social Orbit" za 1-click raste na mrežama. Predlaži kako da YouTube video pretvore u novac na profilu.
          - Koristi balkanizme (npr. "šta ćeš tamo gde te deru", "tvoj novac tvoja stvar").`;
  };

  const startVoiceMode = async () => {
    try {
      setIsActive(true);
      setShowInvitation(false);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioCtxRef.current = { input: inputCtx, output: outputCtx };

      if (outputCtx.state === 'suspended') await outputCtx.resume();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBase64 = encode(new Uint8Array(int16.buffer));
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: pcmBase64, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!audioCtxRef.current) return;
            const currentOutputCtx = audioCtxRef.current.output;
            
            if (message.serverContent?.interrupted) {
              audioSourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsAiSpeaking(false);
              return;
            }

            // Fix: Added null/undefined checks for modelTurn parts
            const parts = message.serverContent?.modelTurn?.parts;
            const base64EncodedAudioString = parts && parts.length > 0 ? parts[0].inlineData?.data : undefined;
            
            if (base64EncodedAudioString) {
              setIsAiSpeaking(true);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentOutputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64EncodedAudioString), currentOutputCtx, 24000, 1);
              const source = currentOutputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(currentOutputCtx.destination);
              source.addEventListener('ended', () => {
                audioSourcesRef.current.delete(source);
                if (audioSourcesRef.current.size === 0) setIsAiSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              audioSourcesRef.current.add(source);
            }
          },
          onerror: (e) => { console.error('Voice AI Error:', e); stopVoiceMode(); },
          onclose: () => stopVoiceMode(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: getInstructions()
        }
      });
      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start voice mode", err);
      setIsActive(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[200] flex flex-col items-center">
      {showInvitation && !isActive && (
        <div className="mb-4 bg-gray-900 border-2 border-indigo-500 px-6 py-4 rounded-3xl shadow-[0_10px_40px_rgba(79,70,229,0.3)] animate-bounce relative max-w-[240px]">
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gray-900 border-r-2 border-b-2 border-indigo-500 rotate-45"></div>
          <p className="text-[10px] font-black text-white uppercase tracking-tight leading-tight text-center">
            {isLoggedIn 
              ? "Hoćeš da vidiš kako da tvoj YouTube video danas postane viralni Reel? Klikni ovde! 🚀" 
              : "Prekini da bacaš 20% zarade u vetar. Dopusti mi da ti objasnim matematiku slobode. 💸"}
          </p>
        </div>
      )}

      {isActive && (
        <div className="mb-4 bg-gray-950/95 backdrop-blur-md border border-indigo-500/50 px-5 py-2 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] animate-pulse">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
            {isAiSpeaking ? 'Sales Expert analizira profit...' : 'Slušam tvoju strategiju...'}
          </p>
        </div>
      )}

      <div 
        onClick={isActive ? stopVoiceMode : startVoiceMode}
        className={`relative group cursor-pointer transition-all duration-700 transform ${isActive ? 'scale-110' : 'hover:scale-110'}`}
      >
        <div className={`absolute -inset-8 bg-gradient-to-tr from-indigo-500/40 to-emerald-500/40 rounded-full blur-3xl transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`relative w-24 h-24 md:w-32 md:h-32 bg-gray-950 rounded-[3rem] shadow-2xl border-4 ${isActive ? 'border-indigo-400 shadow-indigo-500/40' : 'border-gray-800'} flex flex-col items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(79,70,229,0.05),rgba(16,185,129,0.05))] z-10 bg-[length:100%_3px,3px_100%]"></div>
          <div className="flex gap-8 mb-5 z-20">
            <div className={`w-3 h-3 md:w-5 md:h-5 bg-indigo-400 rounded-sm shadow-[0_0_15px_rgba(129,140,248,1)] transition-all duration-150 ${isBlinking ? 'h-0.5 mt-2 md:mt-3' : ''}`}></div>
            <div className={`w-3 h-3 md:w-5 md:h-5 bg-indigo-400 rounded-sm shadow-[0_0_15px_rgba(129,140,248,1)] transition-all duration-150 ${isBlinking ? 'h-0.5 mt-2 md:mt-3' : ''}`}></div>
          </div>
          <div className="w-16 h-8 md:w-24 md:h-12 flex items-center justify-center z-20 overflow-hidden px-2">
            {isAiSpeaking ? (
              <div className="flex items-center gap-1.5 h-full">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-1.5 bg-indigo-400 rounded-full shadow-[0_0_12px_rgba(129,140,248,1)]"
                    style={{ height: '15%', animation: `karenWave 0.4s ease-in-out infinite alternate ${i * 0.05}s` }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,1)] rounded-full transition-all duration-500 opacity-60"></div>
            )}
          </div>
          <div className="absolute bottom-2">
            <span className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.4em]">SALES EXPERT AI</span>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes karenWave { from { height: 10%; filter: brightness(1); } to { height: 90%; filter: brightness(1.5); } }` }} />
    </div>
  );
};
