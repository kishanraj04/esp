import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import WebSocket, { WebSocketServer } from "ws";
import { router1 } from "./src/router/router1.js";
import "./db/conntectdb.js";

const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO (React) =================
const io = new Server(server, {
  cors: { origin: "*" }
});

// ================= WEBSOCKET (ESP32) =================
// Better to define a custom path
const wss = new WebSocketServer({ 
  server,
  path: "/esp32"
});

let esp32Client = null;

wss.on("connection", (ws, req) => {
  console.log("✅ ESP32 Connected");

  esp32Client = ws;

  ws.on("message", (message) => {
    console.log("📩 From ESP32:", message.toString());

    // Optional: forward ESP32 data to React
    io.emit("esp32Message", message.toString());
  });

  ws.on("close", () => {
    console.log("❌ ESP32 Disconnected");
    esp32Client = null;
  });

  ws.on("error", (err) => {
    console.error("ESP32 WebSocket error:", err.message);
  });
});

// ================= SOCKET.IO EVENTS =================
io.on("connection", (socket) => {
  console.log("🌐 React client connected:", socket.id);

  socket.emit("message", "Welcome to the server 🚀");

  socket.on("deviceSelected", (data) => {
    const { deviceId, roomId } = data;

    console.log("📲 From React:", data);

    const payload = JSON.stringify({ deviceId, roomId });

    // Send to ESP32
    if (esp32Client && esp32Client.readyState === WebSocket.OPEN) {
      esp32Client.send(payload);
      console.log("📡 Sent to ESP32:", payload);
    } else {
      console.log("⚠ ESP32 not connected");
      socket.emit("errorMessage", "ESP32 not connected");
    }

    // Broadcast to other React clients
    io.emit("deviceSelected", { deviceId, roomId });
  });

  socket.on("disconnect", () => {
    console.log("🔴 React client disconnected:", socket.id);
  });
});

// ================= EXPRESS =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router1);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
