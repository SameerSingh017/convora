import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import TermsModal from '../components/TermsModal';
import OnlineCount from '../components/OnlineCount';
import { useOnlineCount } from '../hooks/useOnlineCount';

const MODES = [
  {
    id: 'both',
    label: 'Text + Video',
    sub: 'Full experience',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: 'video',
    label: 'Video only',
    sub: 'Face to face',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Text only',
    sub: 'Stay anonymous',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

const TERMS_KEY = 'convora_terms_accepted';

export default function Home() {
  const navigate = useNavigate();
  const { mode, setMode } = useUser();
  const onlineCount = useOnlineCount();

  // Check if user already accepted terms this session
  const [termsAccepted, setTermsAccepted] = useState(
    () => sessionStorage.getItem(TERMS_KEY) === 'true'
  );
  const [showTerms, setShowTerms] = useState(false);

  const handleAcceptTerms = () => {
    sessionStorage.setItem(TERMS_KEY, 'true');
    setTermsAccepted(true);
    setShowTerms(false);
  };

  const handleStart = () => {
    if (!termsAccepted) {
      setShowTerms(true);
      return;
    }
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center px-4">
      {showTerms && (
        <TermsModal
          onAccept={handleAcceptTerms}
          onClose={() => setShowTerms(false)}
        />
      )}

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 bg-[#534AB7] rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span className="text-white text-2xl font-medium tracking-tight">Convora</span>
        </div>

        {/* Online count badge */}
        <div className="flex justify-center mb-6">
          <OnlineCount count={onlineCount} />
        </div>

        {/* Hero text */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-[#EEEDFE] text-[#3C3489] mb-4">
            100% anonymous · No sign-up
          </span>
          <h1 className="text-3xl font-medium text-white leading-tight mb-3">
            Talk to strangers.<br />Start a conversation.
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Connect instantly with someone new. Text, video, or both — your choice.
          </p>
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                mode === m.id
                  ? 'border-[#534AB7] bg-[#534AB7]/10 ring-1 ring-[#534AB7] text-[#534AB7]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80'
              }`}
            >
              {m.icon}
              <div>
                <p className="text-xs font-medium text-white text-center">{m.label}</p>
                <p className="text-xs text-gray-500 text-center mt-0.5">{m.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-3 bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-xl font-medium text-sm transition-colors"
        >
          Start chatting →
        </button>

        {/* Terms note */}
        <p className="text-center text-xs text-gray-600 mt-4">
          {termsAccepted ? (
            <span className="text-green-600 flex items-center justify-center gap-1">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Terms accepted
            </span>
          ) : (
            <>
              By continuing you accept our{' '}
              <button
                onClick={() => setShowTerms(true)}
                className="underline hover:text-gray-400 transition-colors"
              >
                community guidelines
              </button>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
