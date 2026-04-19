 import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { streamChat } from '../../api/coach';

export default function VoiceCoach({ onTranscript }) {
  const [listening,  setListening]  = useState(false);
  const [speaking,   setSpeaking]   = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported,  setSupported]  = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }

    const recognition = new SpeechRecognition();
    recognition.lang           = 'en-IN'; // Indian English
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');
      setTranscript(text);
      if (e.results[e.results.length - 1].isFinal) {
        setListening(false);
        handleVoiceQuery(text);
      }
    };

    recognition.onend  = () => setListening(false);
    recognition.onerror= () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const handleVoiceQuery = async (text) => {
    if (!text.trim()) return;
    onTranscript?.(text);

    let fullResponse = '';
    await streamChat(
      text,
      (delta) => { fullResponse += delta; },
      () => speakResponse(fullResponse),
      console.error
    );
  };

  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 400));
    utterance.lang  = 'en-IN';
    utterance.rate  = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => setSpeaking(false);

    // Prefer an English Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.lang.includes('en-IN') || v.name.includes('India'));
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  };

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setListening(true);
    }
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleListen}
        className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          listening
            ? 'bg-red-500 text-white'
            : 'bg-dark-700 border border-white/10 text-gray-400 hover:text-white hover:border-brand-500/40'
        }`}
        title={listening ? 'Stop listening' : 'Speak to your coach'}
      >
        {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        {listening && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
        )}
      </button>

      {speaking && (
        <div className="flex items-center gap-2 text-xs text-purple-400">
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          Coach is speaking...
        </div>
      )}

      {transcript && !speaking && (
        <p className="text-xs text-gray-500 truncate max-w-[200px]">"{transcript}"</p>
      )}
    </div>
  );
}