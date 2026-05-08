import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Chat from './pages/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
