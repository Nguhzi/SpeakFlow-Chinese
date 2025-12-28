
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const geminiService = {
  // Use Gemini for TTS
  async playText(text: string, voiceName: 'Kore' | 'Puck' = 'Kore') {
    if (!API_KEY) return;
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say this naturally in Mandarin Chinese: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const buffer = audioContext.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  },

  // Scoring user speech (Simulated via text-based model since pure audio scoring is complex)
  async scoreSpeech(targetText: string, recognizedText: string): Promise<{ score: number, feedback: string }> {
    if (!API_KEY) return { score: 80, feedback: "Great pronunciation!" };
    
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The target Chinese text was "${targetText}". The speech recognition engine captured "${recognizedText}". On a scale of 0-100, how accurate is this? Provide feedback in English. Return as JSON: { "score": number, "feedback": "string" }`,
        config: { responseMimeType: "application/json" }
      });
      
      const result = JSON.parse(response.text || '{"score": 70, "feedback": "Good attempt!"}');
      return result;
    } catch (error) {
      return { score: 75, feedback: "Keep it up!" };
    }
  },

  // Generate a conversation reply
  async getChatReply(history: string[], userInput: string, scenario: string) {
    if (!API_KEY) return "你好！很高兴见到你。(Ni hao! Hen gaoxing jiandao ni.)";
    
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are playing a role in a Chinese conversation. Scenario: ${scenario}. 
        Previous history: ${history.join('\n')}. 
        User says: ${userInput}. 
        Respond in short, simple Chinese (suitable for a beginner/intermediate learner), include Pinyin in brackets, and then the English translation.`,
      });
      return response.text;
    } catch (error) {
      return "对不起，我不明白。(Dui bu qi, wo bu ming bai.) - Sorry, I don't understand.";
    }
  }
};
