"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
let GLOBAL_ROOM_ID = 1;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    generateRoomId() {
        return GLOBAL_ROOM_ID++;
    }
    createRoom(user1, user2) {
        const roomId = this.generateRoomId().toString();
        this.rooms.set(roomId, { user1, user2 });
        // Emitting event second offer from both users.
        console.log("INFO - Asking both users to send offer.");
        user1.socket.emit("send-offer", { roomId });
        user2.socket.emit("send-offer", { roomId });
    }
    onOffer(roomId, sdp, sendersSocketId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === sendersSocketId ? room.user2 : room.user1;
        // If receiving user is found, send an offer from his side.
        console.log("INFO - User has received an offer.");
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("offer", { sdp, roomId });
        console.log("INFO - Emitted the offer from the backend");
    }
    onAnswer(roomId, sdp, sendersSocketId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        console.log("INFO - User has received an answer.");
        const receivingUser = room.user1.socket.id === sendersSocketId ? room.user2 : room.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("answer", { sdp, roomId });
    }
    onAddIceCandidate(roomId, sendersSocketId, candidate, type) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const reveivingUser = (room === null || room === void 0 ? void 0 : room.user1.socket.id) === sendersSocketId ? room.user2 : room.user1;
        reveivingUser === null || reveivingUser === void 0 ? void 0 : reveivingUser.socket.emit("add-ice-candidate", { candidate, type });
    }
}
exports.RoomManager = RoomManager;
