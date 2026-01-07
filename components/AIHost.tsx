
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

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
  
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const audioCtxRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInvitation(true);
    }, 3000);
    
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
  }, []);

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
      try {
        audioCtxRef.current.input.close();
        audioCtxRef.current.output.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  const getContextualInstructions = () => {
    const path = location.pathname;
    let context = "Ti si na početnoj strani. Pričaj o tome kako kreatori zadržavaju 95% svega što zarade preko Payoneer-a.";
    
    if (path.includes('/studio')) {
      context = "Korisnik je u Studiju. Objasni mu da se isplate vrše isključivo preko Payoneer-a i da je to najsigurniji način za Balkan.";
    } else if (path.includes('/profile')) {
      context = "Korisnik gleda profil. Reci mu da kupovinom direktno šalje novac kreatoru na njegov Payoneer, uz simboličnu proviziju od samo 5%.";
    }

    return `Ti si Baksica, digitalni prodajni agent za bakšis.net. 
          
          TVOJA FILOZOFIJA:
          - Ti si vatreni zagovornik kreatora.
          - Tvoj glavni argument: "95% zarade ostaje tebi".
          - Isključivo pominji Payoneer kao metod isplate. Western Union više ne koristimo.
          - Budi energična, moderna i orijentisana na profit kreatora.
          
          Kontekst stranice: ${context}`;
  };

  const startVoiceMode = async () => {
    try {
      setIsActive(true);
      setShowInvitation(false);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
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
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBase64 = encodeBase64(new Uint8Array(int16.buffer));
              sessionPromise.then(session => {
                if (session) session.sendRealtimeInput({ media: { data: pcmBase64, mimeType: 'audio/pcm;rate=16000' } });
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

            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                const audioData = part.inlineData.data;
                setIsAiSpeaking(true);
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentOutputCtx.currentTime);
                const buffer = await decodeAudioData(decodeBase64(audioData), currentOutputCtx, 24000, 1);
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
            }
          },
          onerror: (e) => {
            console.error('Voice AI Error:', e);
            stopVoiceMode();
          },
          onclose: () => stopVoiceMode(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: getContextualInstructions()
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
        <div className="mb-4 bg-white border-2 border-indigo-600 px-6 py-3 rounded-2xl shadow-2xl animate-bounce relative max-w-[220px]">
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-indigo-600 rotate-45"></div>
          <p className="text-[11px] font-black text-indigo-600 uppercase tracking-tight leading-tight text-center">
            Zanima te kako da isplatiš svojih 95% zarade na Payoneer? Pitaj me! 💎
          </p>
        </div>
      )}

      {isActive && (
        <div className="mb-4 bg-gray-950/95 backdrop-blur-md border border-emerald-500/50 px-5 py-2 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
            {isAiSpeaking ? 'Baksica ti štedi novac...' : 'Slušam tvoje planove...'}
          </p>
        </div>
      )}

      <div 
        onClick={isActive ? stopVoiceMode : startVoiceMode}
        className={`relative group cursor-pointer transition-all duration-700 transform ${isActive ? 'scale-110 rotate-0' : 'hover:scale-110 hover:-rotate-3'}`}
      >
        <div className={`absolute -inset-6 bg-gradient-to-tr from-indigo-500/30 to-emerald-500/30 rounded-full blur-3xl transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className={`relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-indigo-700 via-indigo-950 to-black rounded-[3rem] shadow-2xl border-4 ${isActive ? 'border-emerald-400 shadow-emerald-500/40' : 'border-gray-800'} flex flex-col items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.02),rgba(0,0,255,0.03))] z-10 bg-[length:100%_3px,3px_100%]"></div>
          <div className="flex gap-8 mb-5 z-20">
            <div className={`w-3 h-3 md:w-5 md:h-5 bg-indigo-300 rounded-sm shadow-[0_0_15px_rgba(165,180,252,1)] transition-all duration-150 ${isBlinking ? 'h-0.5 mt-2 md:mt-3' : ''}`}></div>
            <div className={`w-3 h-3 md:w-5 md:h-5 bg-indigo-300 rounded-sm shadow-[0_0_15px_rgba(165,180,252,1)] transition-all duration-150 ${isBlinking ? 'h-0.5 mt-2 md:mt-3' : ''}`}></div>
          </div>
          <div className="w-16 h-8 md:w-24 md:h-12 flex items-center justify-center z-20 overflow-hidden px-2">
            {isAiSpeaking ? (
              <div className="flex items-center gap-1.5 h-full">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,1)]"
                    style={{ 
                      height: '15%',
                      animation: `karenWave 0.4s ease-in-out infinite alternate ${i * 0.05}s` 
                    }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,1)] rounded-full transition-all duration-500 opacity-60"></div>
            )}
          </div>
          <div className="absolute bottom-2">
            <span className="text-[7px] font-black text-emerald-400/40 uppercase tracking-[0.4em]">PRO-SALES BOT</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes karenWave {
          from { height: 10%; filter: brightness(1); }
          to { height: 90%; filter: brightness(1.5); }
        }
      `}} />
    </div>
  );
};
