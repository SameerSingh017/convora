import { useState, useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';

export const useOnlineCount = () => {
  const { socket } = useSocketContext();
  const [onlineCount, setOnlineCount] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handler = ({ count }) => setOnlineCount(count);
    socket.on('online_count', handler);

    return () => socket.off('online_count', handler);
  }, [socket]);

  return onlineCount;
};
