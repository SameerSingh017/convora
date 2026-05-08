import { useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useUser } from '../context/UserContext';

export const STATES = {
  IDLE: 'idle',
  WAITING: 'waiting',
  CONNECTED: 'connected',
};

export const useMatchmaking = ({ onMatch, onPartnerLeft }) => {
  const [state, setState] = useState(STATES.IDLE);
  const [roomId, setRoomId] = useState(null);
  const { mode } = useUser();

  const { emit } = useSocket({
    waiting: () => setState(STATES.WAITING),
    match_found: ({ roomId: rid, mode: matchedMode }) => {
      setRoomId(rid);
      setState(STATES.CONNECTED);
      onMatch?.({ roomId: rid, mode: matchedMode });
    },
    partner_left: ({ reason }) => {
      setState(STATES.IDLE);
      setRoomId(null);
      onPartnerLeft?.(reason);
    },
  });

  const findMatch = useCallback(() => {
    setState(STATES.WAITING);
    emit('find_match', { mode });
  }, [emit, mode]);

  const skip = useCallback(() => {
    emit('skip');
    setState(STATES.WAITING);
    setRoomId(null);
  }, [emit]);

  const disconnect = useCallback(() => {
    emit('skip');
    setState(STATES.IDLE);
    setRoomId(null);
  }, [emit]);

  return { state, roomId, findMatch, skip, disconnect };
};
