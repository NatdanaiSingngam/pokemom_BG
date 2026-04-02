const { generateBoardMap } = require('../utils/boardHelpers');

class GameStore {
  constructor() {
    // เก็บ GameState ไว้ในหน่วยความจำชั่วคราว
    // รองรับการแก้ไขเป็น Redis ในอนาคต
    this.rooms = {};
  }

  createInitialGameState(roomId) {
    return {
      roomId: roomId,
      status: 'WAITING', // 'WAITING' | 'PLAYING'
      hostId: null,      // socket.id ของหัวห้อง (ใช้อะเรย์ socket.id อ้างอิง)
      turnCount: 1,
      currentPlayerIndex: 0,
      currentPhase: "DRAW",
      players: [],
      boardEvents: [],
      boardMap: generateBoardMap(), 
      currentEvent: null 
    };
  }

  getRoom(roomId) {
    return this.rooms[roomId];
  }

  createRoom(roomId) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = this.createInitialGameState(roomId);
    }
    return this.rooms[roomId];
  }

  deleteRoom(roomId) {
    delete this.rooms[roomId];
  }

  saveRoom(roomId, state) {
    this.rooms[roomId] = state;
  }

  getAllRooms() {
    return this.rooms;
  }
}

// Export เป็น Singleton เพื่อใช้ร่วมกันทั้งแอปพลิเคชัน
const gameStore = new GameStore();
module.exports = gameStore;
