
import React, { useState, useRef } from 'react';
import { ViewState } from '../../types';
import { Mic, Play, Square, Save, Trash2, Cloud, Loader2 } from 'lucide-react';
import { transcribeAudio } from '../../services/ai';

interface VoiceMemosProps {
  onChangeView: (view: ViewState) => void;
}

const VoiceMemos: React.FC<VoiceMemosProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [elapsed, setElapsed] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        
        timerRef.current = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);

    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = handleProcessAudio;
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const handleProcessAudio = async () => {
      setIsProcessing(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // CALL THE SERVICE (Supabase -> Google)
      // For now, since we don't have the backend key, we simulate the wait
      // const text = await transcribeAudio(audioBlob); 
      
      setTimeout(() => {
          setTranscript("I realized today that the anxiety I'm feeling isn't about the work itself, but about the expectation I've set for myself. It's time to redefine what 'enough' means.");
          setIsProcessing(false);
      }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-up max-w-2xl mx-auto pb-20 text-center">
      
      {/* Recorder */}
      <div className="bg-white p-12 rounded-[48px] border border-stone-200 shadow-card text-center mb-12 relative overflow-hidden">
         {/* Live Waveform Animation */}
         {isRecording && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="flex items-center gap-1 h-32">
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-2 bg-sage-dark rounded-full animate-pulse" 
                            style={{ 
                                height: `${Math.max(20, Math.random() * 100)}%`,
                                animationDuration: `${0.5 + Math.random() * 0.5}s`
                            }} 
                        />
                    ))}
                </div>
            </div>
         )}

         <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`
               relative z-10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500
               ${isRecording 
                 ? 'bg-clay shadow-[0_0_0_10px_rgba(196,127,106,0.2)] animate-pulse' 
                 : 'bg-sage-dark text-white hover:bg-sage hover:scale-105 shadow-xl shadow-sage/30'}
            `}
         >
            {isRecording ? <Square fill="currentColor" className="text-white" size={32} /> : <Mic className="text-white" size={36} strokeWidth={2} />}
         </button>
         
         <div className="relative z-10">
            <div className="text-sm font-medium text-text-secondary mb-2">
                {isProcessing ? 'Transcribing with Google...' : isRecording ? 'Listening...' : transcript.length > 0 ? 'Paused' : 'Tap to record'}
            </div>
            <div className="font-serif text-4xl text-text-primary tabular-nums mb-6">{formatTime(elapsed)}</div>
            
            {isProcessing && (
                <div className="flex justify-center mb-6">
                    <Loader2 className="animate-spin text-sage" size={24} />
                </div>
            )}

            {/* Live Transcript Preview */}
            {transcript && !isProcessing && (
                <div className="bg-stone-50 p-4 rounded-2xl text-left text-sm text-text-secondary font-serif leading-relaxed max-h-32 overflow-y-auto mb-4 border border-stone-100">
                    "{transcript}"
                </div>
            )}

            {transcript && !isRecording && !isProcessing && (
                <div className="flex items-center justify-center gap-4 animate-fade-in">
                    <button onClick={() => { setTranscript(''); setElapsed(0); }} className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <Trash2 size={20} />
                    </button>
                    <button className="px-6 py-2 bg-sage text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-sage-dark transition-all flex items-center gap-2">
                        <Save size={14} /> Save to Journal
                    </button>
                </div>
            )}
         </div>
      </div>

      <div className="mt-8 text-xs text-text-muted text-center max-w-xs mx-auto">
        Powered by Google Cloud Speech-to-Text & Supabase
      </div>
    </div>
  );
};

const VoiceMemo = ({ title, time, bars }: any) => (
   <div className="bg-white p-5 rounded-[24px] border border-stone-200 hover:shadow-card hover:border-sage/30 transition-all cursor-pointer flex items-center gap-5 group">
      <button className="w-12 h-12 rounded-full bg-sage-subtle text-sage flex items-center justify-center shrink-0 group-hover:bg-sage group-hover:text-white transition-colors">
         <Play size={20} fill="currentColor" className="ml-1" />
      </button>
      <div className="flex-1 min-w-0">
         <h4 className="font-medium text-text-primary mb-1 truncate">{title}</h4>
         <div className="text-xs text-text-muted">{time}</div>
      </div>
      <div className="flex items-center gap-1 h-8">
         {bars.map((h: number, i: number) => (
            <div 
               key={i} 
               className="w-1 rounded-full bg-sage/30 group-hover:bg-sage transition-colors" 
               style={{ height: `${h * 3}px` }} 
            />
         ))}
      </div>
   </div>
)

export default VoiceMemos;
