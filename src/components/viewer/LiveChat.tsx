import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  userId: string;
  message: string;
}

let socket: Socket | null = null;

const LiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    socket = io('/', {
      auth: { userId: localStorage.getItem('userId') || '' },
    });

    socket.on('chat-message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('chat-error', (err: string) => {
      setError(err);
    });

    socket.on('connect_error', (err) => {
      setError(err.message);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket?.emit('chat-message', input.trim());
      setInput('');
    }
  };

  const blockUser = (userId: string) => {
    socket?.emit('block-user', userId);
  };

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="h-64 overflow-y-auto border p-2 mb-2">
        {messages.map((m, idx) => (
          <div key={idx}>
            <span className="font-bold mr-1">{m.userId}:</span>
            <span>{m.message}</span>
            <button
              className="ml-2 text-xs text-red-500"
              onClick={() => blockUser(m.userId)}
            >
              Block
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="px-2 bg-blue-500 text-white" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
