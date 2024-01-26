import { Server, Socket } from "socket.io";

export class ChatManager {
  private chats: string[];
  constructor() {
    this.chats = [];
  }

  addChat(msg: string, socket: Socket, io: Server) {
    console.log("Sending message straight away", msg);
    io.emit("send message", msg);
  }
}
