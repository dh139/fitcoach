import { useState, useEffect, useCallback } from 'react';
import { Bot, Trash2, TrendingUp, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import ChatWindow       from '../components/coach/ChatWindow';
import ChatInput        from '../components/coach/ChatInput';
import QuickPrompts     from '../components/coach/QuickPrompts';
import SmartAlerts      from '../components/coach/SmartAlerts';
import ImprovementScore from '../components/coach/ImprovementScore';
import {
  getChatHistory, clearChatHistory,
  getImprovementScore, streamChat,
} from '../api/coach';

export default function CoachPage() {
  const [messages,         setMessages]         = useState([]);
  const [input,            setInput]            = useState('');
  const [isStreaming,      setIsStreaming]       = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [scoreData,        setScoreData]        = useState(null);
  const [loadingScore,     setLoadingScore]     = useState(true);
  const [loadingHistory,   setLoadingHistory]   = useState(true);
  const [showScore,        setShowScore]        = useState(true);
  const [showAlerts,       setShowAlerts]       = useState(true);
  const [error,            setError]            = useState('');

  // Load chat history + improvement score
  useEffect(() => {
    Promise.all([
      getChatHistory(),
      getImprovementScore(),
    ]).then(([hist, score]) => {
      setMessages(hist.data || []);
      setScoreData(score.data);
    }).catch(console.error)
      .finally(() => {
        setLoadingHistory(false);
        setLoadingScore(false);
      });
  }, []);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || isStreaming) return;

    setInput('');
    setError('');

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setIsStreaming(true);
    setStreamingContent('');

    await streamChat(
      msg,
      // onDelta — append to streaming content
      (delta) => setStreamingContent((prev) => prev + delta),
      // onDone — commit streamed message
      () => {
        setIsStreaming(false);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          // Avoid duplicate if content already committed
          if (last?.role === 'assistant') return prev;
          return [...prev, { role: 'assistant', content: streamingContent }];
        });
        // Re-fetch history to get the saved version
        getChatHistory().then((h) => setMessages(h.data || []));
        setStreamingContent('');
      },
      // onError
      (err) => {
        setIsStreaming(false);
        setStreamingContent('');
        setError(err || 'Something went wrong. Please try again.');
      }
    );
  }, [input, isStreaming, streamingContent]);

  const handleClear = async () => {
    await clearChatHistory();
    setMessages([]);
  };

  const handleAlertAction = (action) => {
    setInput(action);
  };

  return (
    <div className="flex flex-col h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">FitCoach AI</p>
            <p className="text-xs text-gray-500">Personalised to your data</p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="w-8 h-8 rounded-xl bg-dark-800 border border-white/10 text-gray-500 hover:text-red-400 flex items-center justify-center transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable top panel — score + alerts */}
      <div className="flex-shrink-0 px-4 pt-4 space-y-3 max-h-[45vh] overflow-y-auto">

        {/* Improvement score — collapsible */}
        {!loadingScore && scoreData && (
          <div>
            <button
              onClick={() => setShowScore((v) => !v)}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors mb-2"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Improvement score
              {showScore ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showScore && <ImprovementScore data={scoreData} />}
          </div>
        )}

        {/* Smart alerts */}
        {!loadingScore && scoreData?.alerts?.length > 0 && (
          <div>
            <button
              onClick={() => setShowAlerts((v) => !v)}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors mb-2"
            >
              Smart alerts ({scoreData.alerts.length})
              {showAlerts ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showAlerts && (
              <SmartAlerts
                alerts={scoreData.alerts}
                onActionClick={handleAlertAction}
              />
            )}
          </div>
        )}
      </div>

      {/* Chat window — fills remaining space */}
      {loadingHistory ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : (
        <ChatWindow
          messages={messages}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
        />
      )}

      {/* Bottom area — quick prompts + input */}
      <div className="flex-shrink-0 px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
        {/* Quick prompts — only when no conversation yet */}
        {messages.length === 0 && !isStreaming && (
          <QuickPrompts onSelect={(p) => sendMessage(p)} disabled={isStreaming} />
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 px-1">{error}</p>
        )}

        {/* Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => sendMessage()}
          disabled={isStreaming}
          placeholder="Ask about workouts, diet, progress..."
        />

        <p className="text-center text-xs text-gray-700">
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </div>
  );
}