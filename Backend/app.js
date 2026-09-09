import express from "express";
import cors from "cors";
import { createServer, METHODS } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import authRoutes from "./routes/authRoutes.js";
import { act } from "react";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite frontend URL
    credentials: true,
  }),
);
app.use(express.static("public"));
app.use("/api/auth", authRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const ysocketio = new YSocketIO(io);
ysocketio.initialize();
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("Socket connected successfully", socket.id);

  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);

    userSocketMap[socket.id] = { roomId, username };

    const clientsInRoom = Array.from(
      io.sockets.adapter.rooms.get(roomId) || [],
    );

    const activePeers = clientsInRoom.map((id) => userSocketMap[id].username);
    io.to(roomId).emit("peers_update", activePeers);
  });

  socket.on("code_change", ({ roomId, newCode }) => {
    socket.to(roomId).emit("receive_code", newCode);
  });

  socket.on("disconnect", () => {
    const user = userSocketMap[socket.id];
    if (user) {
      const { roomId } = user;
      delete userSocketMap[socket.id];

      const clientsInRoom = Array.from(
        io.sockets.adapter.rooms.get(roomId) || [],
      );
      const activePeers = clientsInRoom
        .map((id) => userSocketMap[id]?.username)
        .filter(Boolean);

      io.to(roomId).emit("peers_update", activePeers);
    }
    console.log("Socket disconnected", socket.id);
  });
});

export { app, httpServer };
