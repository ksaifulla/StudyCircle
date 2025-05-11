const socketIo = require("socket.io");
const { Message, User, StudyGroup } = require("../db");
const { FRONTEND_URL } = require("../config");

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Track users in each video call room
  const videoCallUsers = {}; // { roomName: Set(socketIds) }

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    /*** CHAT FEATURE ***/
    socket.on("joinGroup", async ({ groupId, userId }) => {
      try {
        const group = await StudyGroup.findById(groupId);
        if (!group || !group.members.includes(userId)) {
          return socket.emit("error", {
            message: "You are not authorized to join this group.",
          });
        }
        socket.join(groupId);
      } catch (error) {
        console.error("Error joining group:", error);
        socket.emit("error", {
          message: "An error occurred while joining the group.",
        });
      }
    });

    socket.on("sendMessage", async ({ groupId, userId, content }) => {
      try {
        const group = await StudyGroup.findById(groupId);
        if (!group || !group.members.includes(userId)) {
          return socket.emit("error", {
            message: "You are not authorized to send messages in this group.",
          });
        }

        const message = new Message({ group: groupId, sender: userId, content });
        await message.save();

        const user = await User.findById(userId);

        io.to(groupId).emit("receiveMessage", {
          groupId,
          content,
          sender: { _id: user._id, username: user.username },
          createdAt: message.createdAt,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("typing", async ({ groupId, userId }) => {
      try {
        const user = await User.findById(userId);
        socket.to(groupId).emit("userTyping", user.username);
      } catch (err) {
        console.error("Error in typing:", err);
      }
    });

    socket.on("stopTyping", async ({ groupId, userId }) => {
      try {
        const user = await User.findById(userId);
        socket.to(groupId).emit("userStoppedTyping", user.username);
      } catch (err) {
        console.error("Error in stopTyping:", err);
      }
    });

    /*** VIDEO CALLING FEATURE ***/
    socket.on("join-video-call", ({ groupId, userId }) => {
      const roomName = `video-${groupId}`;

      // Init room tracking
      if (!videoCallUsers[roomName]) videoCallUsers[roomName] = new Set();

      // Prevent duplicate joins
      if (videoCallUsers[roomName].has(socket.id)) return;

      socket.join(roomName);
      videoCallUsers[roomName].add(socket.id);

      const room = io.sockets.adapter.rooms.get(roomName);
      const otherUsers = room ? Array.from(room).filter(id => id !== socket.id) : [];

      socket.emit("existing-users-in-call", { users: otherUsers });

      socket.to(roomName).emit("user-joined-call", {
        socketId: socket.id,
        userId,
      });
    });

    socket.on("video-offer", ({ groupId, offer, to }) => {
      try {
        io.to(to).emit("video-offer", { offer, from: socket.id });
      } catch (err) {
        console.error("Error in video-offer:", err);
      }
    });

    socket.on("video-answer", ({ groupId, answer, to }) => {
      try {
        io.to(to).emit("video-answer", { answer, from: socket.id });
      } catch (err) {
        console.error("Error in video-answer:", err);
      }
    });

    socket.on("ice-candidate", ({ groupId, candidate, to }) => {
      try {
        io.to(to).emit("ice-candidate", { candidate, from: socket.id });
      } catch (err) {
        console.error("Error in ice-candidate:", err);
      }
    });

    socket.on("leave-video-call", ({ groupId }) => {
      const roomName = `video-${groupId}`;
      socket.leave(roomName);
      if (videoCallUsers[roomName]) {
        videoCallUsers[roomName].delete(socket.id);
      }
      socket.to(roomName).emit("user-left-call", { socketId: socket.id });
    });

    /*** WHITEBOARD FEATURE ***/
    socket.on("join-whiteboard-room", ({ groupId }) => {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined whiteboard room: ${groupId}`);
    });

    socket.on("whiteboardDraw", ({ groupId, data }) => {
      socket.to(groupId).emit("whiteboardDraw", data);
    });

    socket.on("whiteboardClear", ({ groupId }) => {
      io.to(groupId).emit("whiteboardClear");
    });

    socket.on("whiteboardUndo", ({ groupId, actionId }) => {
      socket.to(groupId).emit("whiteboardUndo", actionId);
    });

    /*** DISCONNECT CLEANUP ***/
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      for (const roomName in videoCallUsers) {
        if (videoCallUsers[roomName].has(socket.id)) {
          videoCallUsers[roomName].delete(socket.id);
          socket.to(roomName).emit("user-left-call", { socketId: socket.id });
        }
      }
    });
  });
};

module.exports = initializeSocket;

