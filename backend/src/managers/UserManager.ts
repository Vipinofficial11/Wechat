import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
  name: string;
  socket: Socket;
}

export class UserManager {
  // User Manager will handle 2 users at a time.
  // Queue is to basically add and remove users from the rooms.
  private users: User[];
  private queue: string[];
  private roomManager: RoomManager;

  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  /* 
    Method to add the user to the user array.
  */
  addUser(name: string, socket: Socket) {
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
  removeUser(socketId: string) {
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
  initHandlers(socket: Socket) {
    // User1 will send an offer to server and it will passs it to user2 with there SDP.
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp, socket.id);
    });

    // Once User2 receives the offer it will pass an answer to server and it will be passed to server1.
    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp, socket.id);
    });

    socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
      this.roomManager.onAddIceCandidate(roomId, socket.id, candidate, type);
    });
  }
}
