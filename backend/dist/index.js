"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const UserManager_1 = require("./managers/UserManager");
const ChatManager_1 = require("./managers/ChatManager");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const userManager = new UserManager_1.UserManager();
const chatManager = new ChatManager_1.ChatManager();
io.on("connection", (socket) => {
    console.log("INFO - User connected");
    // Adding users in a room.
    userManager.addUser("randomName", socket);
    // Adding chats.
    socket.on("send message", (data) => {
        io.emit("send message", data);
    });
    socket.on("disconnect", () => {
        console.log("INFO - User Disconnected");
    });
});
server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
