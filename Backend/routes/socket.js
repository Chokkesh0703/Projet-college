import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("likePost", (updatedPost) => {
      io.emit("postUpdated", updatedPost);
    });

    socket.on("newComment", (updatedPost) => {
      io.emit("postUpdated", updatedPost);
    });

    socket.on("disconnect", () => {
      // handle disconnect if needed
    });
  });

  return io;
};

export default setupSocket;
