import { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ChatInput({ value, onChange, onSend, disabled, placeholder }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-dark-800 border border-white/10 rounded-2xl p-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Ask your AI coach anything...'}
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 resize-none focus:outline-none px-2 py-1.5 leading-relaxed disabled:opacity-50"
        style={{ maxHeight: 120 }}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
          value.trim() && !disabled
            ? 'bg-brand-500 hover:bg-brand-600 text-white'
            : 'bg-dark-700 text-gray-600 cursor-not-allowed'
        }`}
      >
        {disabled
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Send    className="w-4 h-4" />
        }
      </button>
    </div>
  );
}