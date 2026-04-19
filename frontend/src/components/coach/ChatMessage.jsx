import { User, Bot } from 'lucide-react';

// Minimal markdown renderer — bold, bullet lists, numbered lists
function renderMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    // Bold: **text**
    const renderInline = (str) => {
      const parts = str.split(/\*\*(.*?)\*\*/g);
      return parts.map((p, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold text-white">{p}</strong>
          : <span key={i}>{p}</span>
      );
    };

    // Bullet list
    if (/^[-*•]\s/.test(trimmed)) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 my-0.5">
          <span className="text-brand-500 mt-1 flex-shrink-0 text-xs">•</span>
          <span>{renderInline(trimmed.replace(/^[-*•]\s/, ''))}</span>
        </div>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const num  = trimmed.match(/^(\d+)\./)[1];
      const rest = trimmed.replace(/^\d+\.\s/, '');
      elements.push(
        <div key={key++} className="flex items-start gap-2 my-0.5">
          <span className="text-brand-500 font-medium flex-shrink-0 text-xs min-w-[16px]">{num}.</span>
          <span>{renderInline(rest)}</span>
        </div>
      );
      continue;
    }

    elements.push(<p key={key++} className="my-0.5 leading-relaxed">{renderInline(trimmed)}</p>);
  }

  return elements;
}

export default function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
        isUser ? 'bg-brand-500' : 'bg-purple-500/30'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-white" />
          : <Bot  className="w-4 h-4 text-purple-300" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
        isUser
          ? 'bg-brand-500 text-white rounded-tr-sm'
          : 'bg-dark-700 border border-white/10 text-gray-200 rounded-tl-sm'
      }`}>
        {isUser
          ? <p className="leading-relaxed">{message.content}</p>
          : <div className="space-y-0">{renderMarkdown(message.content)}</div>
        }

        {/* Streaming cursor */}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-purple-400 ml-0.5 animate-pulse rounded-sm align-middle" />
        )}
      </div>
    </div>
  );
}