import api from './axiosInstance';

export const getChatHistory      = ()      => api.get('/coach/history').then(r => r.data);
export const clearChatHistory    = ()      => api.delete('/coach/history').then(r => r.data);
export const getImprovementScore = ()      => api.get('/coach/improvement-score').then(r => r.data);

// Streaming chat — returns an EventSource-compatible fetch stream
export const streamChat = async (message, onDelta, onDone, onError) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/api/coach/chat', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const err = await response.json();
      onError(err.message || 'Request failed');
      return;
    }

    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    let   buffer  = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const json = JSON.parse(line.slice(6));
          if (json.error) { onError(json.error); return; }
          if (json.done)  { onDone(); return; }
          if (json.delta) onDelta(json.delta);
        } catch { /* skip malformed chunk */ }
      }
    }
    onDone();
  } catch (err) {
    onError(err.message);
  }
};