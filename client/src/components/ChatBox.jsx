import { useEffect, useRef } from 'react';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBox({ messages, partnerTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 min-h-0">
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-white/20 text-center">Say hi to your new stranger!</p>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex flex-col max-w-[85%] ${msg.from === 'me' ? 'self-end items-end' : 'self-start items-start'}`}
        >
          <div
            className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
              msg.from === 'me'
                ? 'bg-[#534AB7] text-white rounded-br-sm'
                : 'bg-white/10 text-white/90 rounded-bl-sm'
            }`}
          >
            {msg.text}
          </div>
          <span className="text-xs text-white/25 mt-0.5 px-1">{formatTime(msg.timestamp)}</span>
        </div>
      ))}

      {partnerTyping && (
        <div className="self-start flex gap-1 items-center px-3 py-2 bg-white/10 rounded-2xl rounded-bl-sm">
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
