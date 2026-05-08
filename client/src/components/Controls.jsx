export default function Controls({ isMuted, isCameraOff, onToggleMute, onToggleCamera, onSkip, onDisconnect, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={onSkip}
          className="px-3 py-1 bg-[#534AB7] text-white text-xs rounded-lg font-medium hover:bg-[#3C3489] transition-colors"
        >
          Next ›
        </button>
        <button
          onClick={onDisconnect}
          className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg font-medium hover:bg-red-500/30 transition-colors"
        >
          End
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <CtrlBtn
        onClick={onToggleMute}
        active={isMuted}
        activeClass="bg-red-500/20 border-red-500/30 text-red-400"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </CtrlBtn>

      <CtrlBtn
        onClick={onToggleCamera}
        active={isCameraOff}
        activeClass="bg-red-500/20 border-red-500/30 text-red-400"
        aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
      >
        {isCameraOff ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /><line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        )}
      </CtrlBtn>

      <button
        onClick={onSkip}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#534AB7] text-white text-xs rounded-xl font-medium hover:bg-[#3C3489] transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
        </svg>
        Next
      </button>

      <CtrlBtn
        onClick={onDisconnect}
        activeClass="bg-red-500/20 border-red-500/30 text-red-400"
        active
        aria-label="End chat"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </CtrlBtn>
    </div>
  );
}

function CtrlBtn({ children, onClick, active, activeClass, ...props }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
        active
          ? activeClass
          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
