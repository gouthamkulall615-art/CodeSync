import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

dotenv.config({ path: ".config.env" });

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
});

const ysocketio = new YSocketIO(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});