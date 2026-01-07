
import React, { useState, useEffect, useRef } from 'react';
import { EXALTED_VENUS, MOCK_FOLLOWER } from '../constants';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(EXALTED_VENUS.id);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      senderId: EXALTED_VENUS.id, 
      text: 'Zdravo! Hvala ti na podršci i bakšišu. Vidim da si novi pretplatnik, šta te najviše zanima u vezi tvojih aspekata danas?', 
      timestamp: new Date(Date.now() - 3600000) 
    },
    { 
      id: '2', 
      senderId: MOCK_FOLLOWER.id, 
      text: 'Zanima me tumačenje moje natalne karte za ovaj mesec, posebno vezano za posao i nove projekte.', 
      timestamp: new Date(Date.now() - 1800000) 
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newMsg: Message = { 
      id: Date.now().toString(), 
      senderId: MOCK_FOLLOWER.id, 
      text: input, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: EXALTED_VENUS.id,
          text: 'Razumem tvoju brigu. Jupiter ti trenutno tranzitira kroz desetu kuću karijere, što je fantastičan znak! Preporučujem da sačekaš sledeći utorak za potpisivanje važnih ugovora.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, reply]);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-white overflow-hidden md:rounded-[2.5rem] md:shadow-2xl md:mt-4 md:mb-4 md:mx-auto md:max-w-6xl md:border md:border-gray-100">
      
      {/* Sidebar - Message List */}
      <div className={`w-full md:w-96 bg-white border-r border-gray-100 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 bg-white border-b border-gray-50">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-black tracking-tighter text-gray-900">Poruke</h2>
             <button className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all group">
                <svg className="w-5 h-5 group-active:scale-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
             </button>
          </div>
          <div className="relative">
             <input 
              type="text" 
              placeholder="Pretraži četove..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-300 text-gray-900" 
             />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 scrollbar-hide">
          <div 
            onClick={() => setActiveChatId(EXALTED_VENUS.id)}
            className={`p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all relative ${activeChatId === EXALTED_VENUS.id ? 'bg-indigo-50/50' : ''}`}
          >
            <div className="relative">
              <img src={EXALTED_VENUS.avatar} className="w-14 h-14 rounded-2xl border-2 border-white shadow-md object-cover" alt="" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-black text-gray-900 truncate text-sm uppercase tracking-tight">{EXALTED_VENUS.displayName}</h3>
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Sada</span>
              </div>
              <p className="text-xs text-gray-500 truncate leading-relaxed font-medium">
                {messages[messages.length - 1]?.text}
              </p>
            </div>
            {activeChatId === EXALTED_VENUS.id && (
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div>
            )}
          </div>
        </div>
      </div>

      {/* Main Conversation Area */}
      <div className={`flex-1 flex flex-col bg-gray-50/50 relative ${activeChatId ? 'flex' : 'hidden md:flex'}`}>
        {activeChatId ? (
          <>
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-xl p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveChatId(null)} 
                  className="md:hidden text-indigo-600 p-2 hover:bg-indigo-50 rounded-2xl transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="relative">
                  <img src={EXALTED_VENUS.avatar} className="w-12 h-12 rounded-xl shadow-sm border border-gray-100" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900 uppercase tracking-tight">{EXALTED_VENUS.displayName}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">Sada na mreži</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m) => {
                const isMe = m.senderId === MOCK_FOLLOWER.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] md:max-w-[65%] group`}>
                      <div className={`px-5 py-4 rounded-[1.75rem] shadow-sm text-sm leading-relaxed font-medium relative ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-indigo-100/20'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-5 py-4 rounded-[1.75rem] rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={msgEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="max-w-4xl mx-auto relative flex items-end gap-3 bg-gray-50 p-2 rounded-[2rem] border border-gray-200">
                <textarea 
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Napiši poruku..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 px-2 resize-none max-h-32 scrollbar-hide text-gray-900"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-lg active:scale-95 ${
                    input.trim() 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-4">Vaš Inbox</h3>
            <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
              Izaberite konverzaciju da biste započeli ćaskanje.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
