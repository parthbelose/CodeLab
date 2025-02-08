
export function collaborationSockets(io) {
  const roomUsers = new Map(); // Map to store users by roomId

  io.on("connection", (socket) => {
    // console.log(`User connected: ${socket.id}`);

    // Create a room
    socket.on("create_room", ({ roomId, username }, callback) => {
      // Ensure roomId is unique and not already in use
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Map()); // Create a new map for the room's users
        // console.log(`Room created: ${roomId} by ${username}`);
        callback && callback({ success: true, roomId });
      } else {
        // console.log(`Room creation failed: Room ID ${roomId} already exists.`);
        callback && callback({ success: false, error: "Room ID already exists" });
      }
    });

    // User joins a room
    socket.on("join_room", ({ roomId, username },callback) => {
      // Ensure roomId exists in the map, if not create it
      // console.log("received",roomId,username)
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Map());
      }
      // Get the users map for the room
      const usersInRoom = roomUsers.get(roomId);

      // Check if the user is already in the room
      if (!usersInRoom.has(socket.id)) {
        // Add user to the room's user map if not already present
        usersInRoom.set(socket.id, username);
        socket.join(roomId);

        // Notify all users in the room of the new user
        io.to(roomId).emit("user_joined", {
          userId: socket.id,
          userName: username,
          users: Array.from(usersInRoom.entries()).map(([id, name]) => ({
            id,
            name,
          })),
        });

        // Send the current list of users in the room to the new user only
        socket.emit("current_users", {
          users: Array.from(usersInRoom.entries()).map(([id, name]) => ({
            id,
            name,
          })),
        });
        callback && callback({ success: true, roomId });
      }
    });

    // Handle code update
    socket.on("code_update", ({ roomId, code }) => {
      socket.to(roomId).emit("code_update", code);
    });

    // Handle problem update
    socket.on("problem_update", ({ roomId, problem }) => {
      socket.to(roomId).emit("problem_update", problem);
    });

    // WebRTC signaling: handle offer, answer, and ICE candidates
    socket.on("offer", ({ receiverId, offer }) => {
      if (receiverId) {
        socket
          .to(receiverId)
          .emit("receive_offer", { offer, senderId: socket.id });
      }
    });

    socket.on("answer", ({ receiverId, answer }) => {
      if (receiverId) {
        socket
          .to(receiverId)
          .emit("receive_answer", { answer, senderId: socket.id });
      }
    });

    socket.on("candidate", ({ receiverId, candidate }) => {
      if (receiverId) {
        socket
          .to(receiverId)
          .emit("receive_candidate", { candidate, senderId: socket.id });
      }
    });

    // Whiteboard updates
    socket.on("whiteboard_update", ({ roomId, paths }) => {
      socket.to(roomId).emit("whiteboard_update", { paths });
    });

    socket.on("whiteboard_clear", ({ roomId }) => {
      socket.to(roomId).emit("whiteboard_clear");
    });

    socket.on("whiteboard_reset", ({ roomId }) => {
      socket.to(roomId).emit("whiteboard_reset");
    });

    // Handle disconnection
    socket.on("leave_room", ({ roomId, username }) => {
      // console.log(`User requested to leave room: ${socket.id}`);

      // Get the users map for the room and check if the user is in it
      const usersInRoom = roomUsers.get(roomId);
      if (usersInRoom && usersInRoom.has(socket.id)) {
        usersInRoom.delete(socket.id);

        // Notify other users in the room about the user who left
        io.to(roomId).emit("user_left", {
          userId: socket.id,
          userName: username,
          users: Array.from(usersInRoom.entries()).map(([id, name]) => ({
            id,
            name,
          })),
        });

        // Clean up room if empty
        if (usersInRoom.size === 0) {
          roomUsers.delete(roomId);
        }
      }
    });

    // Automatically handle disconnection cleanup
    socket.on("disconnect", () => {
      // console.log(`User disconnected: ${socket.id}`);
      roomUsers.forEach((usersInRoom, roomId) => {
        if (usersInRoom.has(socket.id)) {
          const username = usersInRoom.get(socket.id);
          usersInRoom.delete(socket.id);

          // Notify remaining users in the room
          io.to(roomId).emit("user_left", {
            userId: socket.id,
            userName: username,
            users: Array.from(usersInRoom.entries()).map(([id, name]) => ({
              id,
              name,
            })),
          });

          // Clean up room if empty
          if (usersInRoom.size === 0) {
            roomUsers.delete(roomId);
          }
        }
      });
    });
  });
}
