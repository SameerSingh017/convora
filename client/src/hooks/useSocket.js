import { useEffect, useRef } from 'react';
import { useSocketContext } from '../context/SocketContext';

export const useSocket = (eventHandlers = {}) => {
  const { socket, connected } = useSocketContext();
  const handlersRef = useRef(eventHandlers);

  useEffect(() => {
    handlersRef.current = eventHandlers;
  });

  useEffect(() => {
    if (!socket) return;

    const entries = Object.entries(handlersRef.current);
    entries.forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      entries.forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]);

  const emit = (event, data) => {
    if (socket) socket.emit(event, data);
  };

  return { socket, connected, emit };
};
