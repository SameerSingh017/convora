# Convora

Anonymous real-time chat app — talk to strangers instantly via text and video.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Socket.IO client + simple-peer (WebRTC)
- **Backend**: Node.js + Express + Socket.IO
- **Database**: MongoDB (Mongoose) + Redis (matchmaking queue)
- **Real-time**: Socket.IO for signalling, WebRTC P2P for video/audio

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI
- Redis running locally

### Install & Run

```bash
# Install all dependencies
npm run install:all

# Copy and fill in your .env
cp .env .env.local

# Start both client and server in dev mode
npm run dev
```

Server runs on http://localhost:5000  
Client runs on http://localhost:5173

### With Docker

```bash
docker-compose up --build
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `CLIENT_URL` | Frontend URL for CORS |
| `TURN_SERVER_URL` | TURN server URL for WebRTC NAT traversal |
| `TURN_SERVER_USERNAME` | TURN credentials |
| `TURN_SERVER_CREDENTIAL` | TURN credentials |

## Project Structure

```
convora/
├── server/          # Node.js backend
│   ├── sockets/     # Socket.IO event handlers
│   ├── utils/       # Redis queue & room manager
│   └── ...
├── client/          # React frontend
│   └── src/
│       ├── hooks/   # useSocket, useWebRTC, useMatchmaking
│       ├── pages/   # Home, Chat
│       └── components/
└── docker-compose.yml
```

## Features
- Anonymous matching — no sign-up required
- Text + video chat modes
- Skip to next stranger instantly
- Typing indicators
- Report system
- Redis-backed matchmaking queue
- WebRTC P2P video with TURN fallback

---

## Live Demo

🌐 [View Live Page](https://convora-three.vercel.app)

---


## Author

**Sameer Singh**

📧 Email: sameer0555singh@gmail.com
