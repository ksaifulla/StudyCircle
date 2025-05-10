const socketIo = require("socket.io");
const { Message, User, StudyGroup } = require("../db");

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  /*** 📌 Socket.IO Connection ***/
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    /*** ✅ CHAT FEATURE ***/
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

        const message = new Message({
          group: groupId,
          sender: userId,
          content,
        });
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

    /*** ✅ WHITEBOARD FEATURE ***/

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

    /*** ✅ DISCONNECT CLEANUP ***/
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
