import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Bot } from 'lucide-react';

const WELCOME = {
  role:    'assistant',
  content: 'Hey! I\'m your FitCoach AI. I know your workout history, XP progress, and fitness goals — so ask me anything. I can build you a workout plan, suggest Indian-friendly meals, explain your improvement score, or just give you a push when you need it. **What\'s on your mind?**',
};

export default function ChatWindow({ messages, streamingContent, isStreaming }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const allMessages = messages.length === 0 ? [WELCOME] : messages;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
      {allMessages.map((msg, i) => (
        <ChatMessage
          key={i}
          message={msg}
          isStreaming={false}
        />
      ))}

      {/* Live streaming message */}
      {isStreaming && streamingContent !== undefined && (
        <ChatMessage
          message={{ role: 'assistant', content: streamingContent || '' }}
          isStreaming={true}
        />
      )}

      {/* Empty spacer for scroll target */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}