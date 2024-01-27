"use strict";
// import { Server, Socket } from "socket.io";
// import { RoomManager } from "./RoomManager";
// export class ChatManager {
//   private chatMessages: { message: string; userId: string }[];
//   private roomManager: RoomManager;
//   constructor () {
//     this.chatMessages = {message: string, userId: string}[]
//     this.roomManager = new RoomManager();
//   }
//   addChatMessage (message: string, userId: string, roomId: string) {
//     const room = this.roomManager.rooms.get(roomId);
//     if (room) {
//       this.chatMessages.push({ message, userId });
//     }
//   }
//   getChatMessage(roomId: string) {
//     const room = this.roomManager.rooms.get(roomId);
//     return room ? this.chatMessages : [];
//   }
// }
