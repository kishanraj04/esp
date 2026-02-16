import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import WebSocket, { WebSocketServer } from "ws";
import { router1 } from "./src/router/router1.js";
import "./db/conntectdb.js";

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO for React
const io = new Server(server, {
  cors: { origin: "*" }
});

// ✅ WebSocket Server for ESP32
const wss = new WebSocketServer({ server });

let esp32Client = null;

wss.on("connection", (ws) => {
  console.log("✅ ESP32 Connected");
  esp32Client = ws;

  ws.on("message", (message) => {
    console.log("📩 From ESP32:", message.toString());
  });

  ws.on("close", () => {
    console.log("❌ ESP32 Disconnected");
    esp32Client = null;
  });
});

// ✅ Socket.IO connection (React side)
io.on("connection", (socket) => {
  console.log("🌐 React client connected:", socket.id);

  socket.emit("message", "welcome to the server");

  socket.on("deviceSelected", (data) => {
    const { deviceId, roomId } = data;

    console.log("📲 From React:", data);

    // Send to ESP32 via WebSocket
    if (esp32Client && esp32Client.readyState === WebSocket.OPEN) {
      esp32Client.send(
        JSON.stringify({ deviceId, roomId })
      );
    } else {
      console.log("⚠ ESP32 not connected");
    }

    // Also broadcast back to React clients
    io.emit("deviceSelected", { deviceId, roomId });
  });

  socket.on("disconnect", () => {
    console.log("🔴 React client disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router1);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running");
});
