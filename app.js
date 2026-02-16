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
const wss = new WebSocketServer({
  server,
  path: "/esp32"   // IMPORTANT
});

let esp32Client = null;

wss.on("connection", (ws) => {
  console.log("✅ ESP32 Connected");
  esp32Client = ws;

  ws.on("message", (message) => {
    console.log("📩 From ESP32:", message.toString());
    io.emit("esp32Message", message.toString());
  });

  ws.on("close", () => {
    console.log("❌ ESP32 Disconnected");
    esp32Client = null;
  });
});

// ================= SOCKET.IO =================
io.on("connection", (socket) => {
  console.log("🌐 React connected:", socket.id);

  socket.on("deviceSelected", (data) => {

    const payload = JSON.stringify(data);

    if (esp32Client && esp32Client.readyState === WebSocket.OPEN) {
      esp32Client.send(payload);
      console.log("📡 Sent to ESP32:", payload);
    } else {
      socket.emit("errorMessage", "ESP32 not connected");
    }

    io.emit("deviceSelected", data);
  });
});

// ================= EXPRESS =================
app.use(cors());
app.use(express.json());
app.use("/api", router1);

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
