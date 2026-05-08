import { useEffect, useRef } from 'react';

export default function VideoBox({ localStream, remoteStream }) {
  const remoteRef = useRef(null);
  const localRef = useRef(null);

  useEffect(() => {
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localRef.current && localStream) {
      localRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div className="relative flex-1 bg-[#111118] rounded-xl overflow-hidden min-h-0">
      {remoteStream ? (
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
            <span className="text-2xl text-white/20">👤</span>
          </div>
          <p className="text-xs text-white/30">Waiting for video...</p>
        </div>
      )}

      <span className="absolute top-3 left-3 text-xs text-white/50 bg-black/40 px-2 py-0.5 rounded-full">
        Stranger
      </span>

      <div className="absolute bottom-3 right-3 w-24 h-18 rounded-lg overflow-hidden bg-[#1a1a25] border border-white/10">
        {localStream ? (
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 text-sm">You</span>
          </div>
        )}
      </div>
    </div>
  );
}
