import { Socket } from "socket.io";
import { User } from "./UserManager";

interface Room {
  user1: User;
  user2: User;
}

let GLOBAL_ROOM_ID = 1;

export class RoomManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>();
  }

  generateRoomId() {
    return GLOBAL_ROOM_ID++;
  }

  createRoom(user1: User, user2: User) {
    const roomId = this.generateRoomId().toString();
    this.rooms.set(roomId, { user1, user2 });

    // Emitting event second offer from both users.
    console.log("INFO - Asking both users to send offer.");
    user1.socket.emit("send-offer", { roomId });
    user2.socket.emit("send-offer", { roomId });
  }

  onOffer(roomId: string, sdp: string, sendersSocketId: string) {
    const room = this.rooms.get(roomId);

    if (!room) {
      return;
    }

    const receivingUser =
      room.user1.socket.id === sendersSocketId ? room.user2 : room.user1;
    // If receiving user is found, send an offer from his side.
    console.log("INFO - User has received an offer.");
    receivingUser?.socket.emit("offer", { sdp, roomId });
    console.log("INFO - Emitted the offer from the backend");
  }

  onAnswer(roomId: string, sdp: string, sendersSocketId: string) {
    const room = this.rooms.get(roomId);

    if (!room) {
      return;
    }
    console.log("INFO - User has received an answer.");
    const receivingUser =
      room.user1.socket.id === sendersSocketId ? room.user2 : room.user1;
    receivingUser?.socket.emit("answer", { sdp, roomId });
  }

  onAddIceCandidate(
    roomId: string,
    sendersSocketId: string,
    candidate: any,
    type: string
  ) {
    const room = this.rooms.get(roomId);

    if (!room) {
      return;
    }

    const reveivingUser =
      room?.user1.socket.id === sendersSocketId ? room.user2 : room.user1;
    reveivingUser?.socket.emit("add-ice-candidate", { candidate, type });
  }
}
