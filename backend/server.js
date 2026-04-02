const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Import Modules
const gameStore = require('./state/gameStore');
const registerGameHandlers = require('./socket/gameHandlers');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket] ผู้เล่นเชื่อมต่อเข้ามาใหม่: ${socket.id}`);
  
  // โหลด Logic ผู้เล่นทั้งหมดเข้าสู่ Socket
  registerGameHandlers(io, socket, gameStore);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 โปเกมอนบอร์ดเกม Backend Server รันอยู่ที่พอร์ต ${PORT} (Refactoring Ver.)`);
});
