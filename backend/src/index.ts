import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { UserManager } from "./managers/UserManager";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userManager = new UserManager();
let userName = "";
io.on("connection", (socket: Socket) => {
  console.log("INFO - User connected");
  // Adding users in a room.
  socket.on("user-joined", ({ name }) => {
    userName = name;
    console.log("Name of user in backedn", userName);
  });
  userManager.addUser(userName, socket);
  io.emit("user-added", { userName });

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
