import { useState, useRef, useCallback } from 'react';

export default function MessageInput({ onSend, onTypingStart, onTypingStop }) {
  const [value, setValue] = useState('');
  const typingRef = useRef(false);
  const typingTimerRef = useRef(null);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      onTypingStart?.();
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      typingRef.current = false;
      onTypingStop?.();
    }, 1500);
  }, [onTypingStart, onTypingStop]);

  const handleSend = useCallback(() => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
    clearTimeout(typingTimerRef.current);
    typingRef.current = false;
    onTypingStop?.();
  }, [value, onSend, onTypingStop]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-2 border-t border-white/5">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        maxLength={500}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#534AB7] transition-colors"
      />
      <button
        onClick={handleSend}
        disabled={!value.trim()}
        className="w-8 h-8 bg-[#534AB7] rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-[#3C3489] transition-colors"
        aria-label="Send message"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
