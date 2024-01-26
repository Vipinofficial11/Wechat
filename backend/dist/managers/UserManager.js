"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
class UserManager {
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager_1.RoomManager();
    }
    /*
      Method to add the user to the user array.
    */
    addUser(name, socket) {
        this.users.push({ name, socket });
        this.queue.push(socket.id);
        // Once we add the user to Users array and push the socket Id in the queue, we can move user to lobby.
        socket.emit("lobby");
        this.clearQueue(); // Clearing Queue one by one and adding users in rooms.
        this.initHandlers(socket);
    }
    /*
      Method to remove the user from the user array.
    */
    removeUser(socketId) {
        const user = this.users.find((user) => user.socket.id === socketId);
        this.users = this.users.filter((user) => user.socket.id !== socketId);
        this.queue = this.queue.filter((id) => id === socketId);
    }
    /*
      Method to clear the queue.
    */
    clearQueue() {
        console.log("INFO - Clearing waiting queue");
        console.log("INFO - Number of people is queue: ", this.queue.length);
        if (this.queue.length < 2) {
            return;
        }
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        const user1 = this.users.find((user) => user.socket.id === id1);
        const user2 = this.users.find((user) => user.socket.id === id2);
        if (!user1 || !user2) {
            return;
        }
        console.log("INFO - Creating a room.");
        const room = this.roomManager.createRoom(user1, user2);
        this.clearQueue(); //Again calling the clear queue untill queue's size is less than 2.
    }
    /*
      Method for the event handlers.
    */
    initHandlers(socket) {
        // User1 will send an offer to server and it will passs it to user2 with there SDP.
        socket.on("offer", ({ sdp, roomId }) => {
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });
        // Once User2 receives the offer it will pass an answer to server and it will be passed to server1.
        socket.on("answer", ({ sdp, roomId }) => {
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });
        socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
            this.roomManager.onAddIceCandidate(roomId, socket.id, candidate, type);
        });
    }
}
exports.UserManager = UserManager;
