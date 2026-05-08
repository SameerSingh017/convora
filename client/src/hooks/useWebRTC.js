import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { useSocket } from './useSocket';

export const useWebRTC = ({ roomId, enabled = true }) => {
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const isInitiator = useRef(false);

  const { socket, emit } = useSocket({
    webrtc_offer: ({ offer, from }) => {
      if (!peerRef.current) createPeer(false);
      peerRef.current?.signal(offer);
    },
    webrtc_answer: ({ answer }) => {
      peerRef.current?.signal(answer);
    },
    webrtc_ice_candidate: ({ candidate }) => {
      peerRef.current?.signal(candidate);
    },
  });

  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('[WebRTC] Could not get media:', err);
      return null;
    }
  }, []);

  const createPeer = useCallback((initiator) => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }

    isInitiator.current = initiator;

    const peer = new SimplePeer({
      initiator,
      stream: localStreamRef.current || undefined,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          {
            urls: import.meta.env.VITE_TURN_URL || 'turn:openrelay.metered.ca:80',
            username: import.meta.env.VITE_TURN_USER || 'openrelayproject',
            credential: import.meta.env.VITE_TURN_CRED || 'openrelayproject',
          },
        ],
      },
    });

    peer.on('signal', (data) => {
      if (data.type === 'offer') emit('webrtc_offer', { offer: data });
      else if (data.type === 'answer') emit('webrtc_answer', { answer: data });
      else emit('webrtc_ice_candidate', { candidate: data });
    });

    peer.on('stream', (stream) => {
      setRemoteStream(stream);
    });

    peer.on('error', (err) => console.error('[Peer error]', err));
    peer.on('close', () => setRemoteStream(null));

    peerRef.current = peer;
  }, [emit]);

  useEffect(() => {
    if (!enabled || !roomId) return;

    let cancelled = false;

    (async () => {
      const stream = await getLocalStream();
      if (cancelled || !stream) return;
      createPeer(true);
    })();

    return () => {
      cancelled = true;
      peerRef.current?.destroy();
      peerRef.current = null;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      setRemoteStream(null);
    };
  }, [roomId, enabled]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((prev) => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsCameraOff((prev) => !prev);
  }, []);

  return { localStream, remoteStream, isMuted, isCameraOff, toggleMute, toggleCamera };
};
