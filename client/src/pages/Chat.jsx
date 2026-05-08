import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useMatchmaking, STATES } from '../hooks/useMatchmaking';
import { useWebRTC } from '../hooks/useWebRTC';
import { useOnlineCount } from '../hooks/useOnlineCount';
import VideoBox from '../components/VideoBox';
import ChatBox from '../components/ChatBox';
import MessageInput from '../components/MessageInput';
import Controls from '../components/Controls';
import StatusBanner from '../components/StatusBanner';
import SkipConfirm from '../components/SkipConfirm';
import OnlineCount from '../components/OnlineCount';
import { useSocket } from '../hooks/useSocket';

export default function Chat() {
  const navigate = useNavigate();
  const { mode } = useUser();
  const onlineCount = useOnlineCount();
  const [messages, setMessages] = useState([]);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const { emit } = useSocket({
    receive_message: ({ message, timestamp }) => {
      setMessages((prev) => [...prev, { from: 'stranger', text: message, timestamp }]);
    },
    partner_typing: ({ typing }) => setPartnerTyping(typing),
  });

  const handleMatch = useCallback(({ roomId: rid }) => {
    setRoomId(rid);
    setMessages([]);
    setStatusMsg('Connected to a stranger!');
    setTimeout(() => setStatusMsg(''), 2500);
  }, []);

  const handlePartnerLeft = useCallback((reason) => {
    setStatusMsg(reason === 'skipped' ? 'Stranger skipped.' : 'Stranger disconnected.');
    setRoomId(null);
    setMessages([]);
    setPartnerTyping(false);
  }, []);

  const { state, findMatch, skip, disconnect } = useMatchmaking({
    onMatch: handleMatch,
    onPartnerLeft: handlePartnerLeft,
  });

  const videoEnabled = mode === 'video' || mode === 'both';
  const { localStream, remoteStream, isMuted, isCameraOff, toggleMute, toggleCamera } = useWebRTC({
    roomId,
    enabled: videoEnabled && state === STATES.CONNECTED,
  });

  const sendMessage = useCallback((text) => {
    if (!text.trim() || state !== STATES.CONNECTED) return;
    emit('send_message', { message: text });
    setMessages((prev) => [...prev, { from: 'me', text, timestamp: Date.now() }]);
  }, [emit, state]);

  // Skip with confirm if connected, else skip directly
  const handleSkipClick = () => {
    if (state === STATES.CONNECTED) {
      setShowSkipConfirm(true);
    } else {
      skip();
    }
  };

  const handleSkipConfirm = () => {
    setShowSkipConfirm(false);
    skip();
  };

  const handleExit = () => {
    disconnect();
    navigate('/');
  };

  // ── IDLE ──
  if (state === STATES.IDLE) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center gap-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-[#534AB7] rounded-xl flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-white text-xl font-medium">Convora</span>
        </div>
        <OnlineCount count={onlineCount} />
        <button
          onClick={findMatch}
          className="px-8 py-3 bg-[#534AB7] text-white rounded-xl font-medium text-sm hover:bg-[#3C3489] transition-colors"
        >
          Find a stranger →
        </button>
        <button onClick={handleExit} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          ← Back to home
        </button>
      </div>
    );
  }

  // ── WAITING ──
  if (state === STATES.WAITING) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-[#534AB7] rounded-xl flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-white text-xl font-medium">Convora</span>
        </div>
        <OnlineCount count={onlineCount} />
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#534AB7] rounded-full animate-spin mt-2" />
        <p className="text-white font-medium text-sm">Finding you a stranger...</p>
        <p className="text-gray-500 text-xs">Usually takes a few seconds</p>
        <button
          onClick={handleExit}
          className="mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  // ── CONNECTED ──
  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      {showSkipConfirm && (
        <SkipConfirm
          onConfirm={handleSkipConfirm}
          onCancel={() => setShowSkipConfirm(false)}
        />
      )}

      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#534AB7] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-white font-medium text-sm">Convora</span>
        </div>

        <StatusBanner message={statusMsg} />

        <div className="flex items-center gap-3">
          <OnlineCount count={onlineCount} />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-green-400">Connected</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-3 p-3 min-h-0 overflow-hidden">
        {videoEnabled && (
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <VideoBox localStream={localStream} remoteStream={remoteStream} />
            <Controls
              isMuted={isMuted}
              isCameraOff={isCameraOff}
              onToggleMute={toggleMute}
              onToggleCamera={toggleCamera}
              onSkip={handleSkipClick}
              onDisconnect={handleExit}
            />
          </div>
        )}

        <div
          className={`flex flex-col bg-[#1a1a22] rounded-xl border border-white/5 overflow-hidden ${
            videoEnabled ? 'w-72 flex-shrink-0' : 'flex-1 max-w-xl mx-auto'
          }`}
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs font-medium text-white">Stranger</span>
            </div>
            {!videoEnabled && (
              <Controls
                isMuted={isMuted}
                isCameraOff={isCameraOff}
                onToggleMute={toggleMute}
                onToggleCamera={toggleCamera}
                onSkip={handleSkipClick}
                onDisconnect={handleExit}
                compact
              />
            )}
          </div>
          <ChatBox messages={messages} partnerTyping={partnerTyping} />
          <MessageInput
            onSend={sendMessage}
            onTypingStart={() => emit('typing_start')}
            onTypingStop={() => emit('typing_stop')}
          />
        </div>
      </div>
    </div>
  );
}
