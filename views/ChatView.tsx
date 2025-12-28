
import React, { useState, useEffect, useRef } from 'react';
import { Unit } from '../types';
import { geminiService } from '../services/geminiService';
import { X, Send, User, Bot, Volume2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatViewProps {
  unit: Unit;
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ unit, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我们可以开始练习对话了吗？(Nǐ hǎo! Wǒmen kěyǐ kāishǐ liànxí duìhuà le ma?) - Hello! Shall we start practicing our conversation?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`);
    const reply = await geminiService.getChatReply(history, userMsg, unit.title);
    
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setIsLoading(false);
  };

  const playAudio = (text: string) => {
    const chinesePart = text.split('(')[0].trim() || text;
    geminiService.playText(chinesePart, 'Puck');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-gray-400"><X /></button>
          <div>
            <h3 className="font-bold text-gray-900 leading-none">AI Role-play</h3>
            <span className="text-xs text-teal-600 font-medium">Topic: {unit.title}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-amber-100 text-amber-700'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl relative shadow-sm ${
                msg.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => playAudio(msg.content)}
                    className="mt-2 text-teal-600 flex items-center space-x-1 text-xs font-bold"
                  >
                    <Volume2 size={14} />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t pb-8">
        <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl pl-4">
          <input 
            type="text" 
            placeholder="Type your reply in Chinese..."
            className="flex-1 bg-transparent outline-none text-sm py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
