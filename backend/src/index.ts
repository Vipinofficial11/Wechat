import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { UserManager } from "./managers/UserManager";
import { ChatManager } from "./managers/ChatManager";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userManager = new UserManager();
const chatManager = new ChatManager();
io.on("connection", (socket: Socket) => {
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
