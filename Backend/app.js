import express from "express";
import cors from "cors";
import { createServer, METHODS } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import authRoutes from "./routes/authRoutes.js";
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

io.on("connection", (socket) => {
  console.log("Socket connected successfully", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

export { app, httpServer };
