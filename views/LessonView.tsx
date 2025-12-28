
import React, { useState, useEffect, useRef } from 'react';
import { Unit, LessonItem } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { geminiService } from '../services/geminiService';
import { X, Volume2, Mic, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';

interface LessonViewProps {
  unit: Unit;
  onComplete: (xp: number) => void;
  onBack: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ unit, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; text: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const currentItem = unit.items[currentIndex];

  // Speech Recognition
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'zh-CN';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = async (event: any) => {
        const result = event.results[0][0].transcript;
        setIsChecking(true);
        const evaluation = await geminiService.scoreSpeech(currentItem.chinese, result);
        setFeedback({ score: evaluation.score, text: evaluation.feedback });
        setIsChecking(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        setFeedback({ score: 0, text: "Didn't catch that. Try again!" });
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, [currentItem]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setFeedback(null);
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const nextStep = () => {
    if (currentIndex < unit.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback(null);
    } else {
      onComplete(unit.items.length * 10);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 flex items-center space-x-4 border-b">
        <button onClick={onBack} className="text-gray-400 p-1"><X /></button>
        <ProgressBar progress={((currentIndex + 1) / unit.items.length) * 100} height="h-3" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="text-sm font-bold text-teal-600 uppercase tracking-widest">Repeat after the audio</div>
          <h2 className="text-6xl font-bold text-gray-900">{currentItem.chinese}</h2>
          <div className="text-xl text-gray-500 font-medium">{currentItem.pinyin}</div>
          <div className="text-lg text-gray-400 italic">"{currentItem.english}"</div>
        </div>

        <button 
          onClick={() => geminiService.playText(currentItem.chinese)}
          className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center hover:bg-teal-100 transition-all active:scale-90 shadow-sm"
        >
          <Volume2 size={32} />
        </button>
      </div>

      {/* Feedback Area */}
      {feedback && (
        <div className={`p-6 mx-6 mb-4 rounded-3xl border-2 animate-in slide-in-from-bottom-4 duration-300 ${
          feedback.score > 70 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'
        }`}>
          <div className="flex items-start space-x-3">
            {feedback.score > 70 ? <CheckCircle2 className="text-green-600" /> : <AlertCircle className="text-amber-600" />}
            <div>
              <div className="font-bold text-gray-900">Score: {feedback.score}%</div>
              <p className="text-sm text-gray-600 leading-tight mt-1">{feedback.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="p-6 bg-white border-t space-y-4">
        {!feedback ? (
          <button 
            onClick={toggleRecording}
            className={`w-full py-5 rounded-2xl flex items-center justify-center space-x-3 font-bold transition-all active:scale-95 shadow-lg ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-600 text-white'
            }`}
          >
            {isChecking ? (
              <span className="flex items-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div> Analysing...</span>
            ) : (
              <><Mic size={24} /> <span>{isRecording ? 'Listening...' : 'Hold to Speak'}</span></>
            )}
          </button>
        ) : (
          <Button size="xl" onClick={nextStep}>
            Continue <ChevronRight className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
