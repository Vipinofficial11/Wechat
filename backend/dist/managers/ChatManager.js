"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatManager = void 0;
class ChatManager {
    constructor() {
        this.chats = [];
    }
    addChat(msg, socket, io) {
        console.log("Sending message straight away", msg);
        io.emit("send message", msg);
    }
}
exports.ChatManager = ChatManager;
