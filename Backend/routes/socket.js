import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST", "PUT"],
    },
  });

  io.on("connection", (socket) => {
    // console.log("New client connected:", socket.id);

    socket.on("likePost", (updatedPost) => {
      io.emit("postUpdated", updatedPost);
    });

    socket.on("newComment", (updatedPost) => {
      io.emit("postUpdated", updatedPost);
    });

    socket.on("disconnect", () => {
      // console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
