import api from './api';

export const getStatus = () => api.get('/auth/status');

export const submitReport = (data, socketId) =>
  api.post('/chat/report', data, {
    headers: { 'x-socket-id': socketId },
  });
