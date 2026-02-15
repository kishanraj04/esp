import express from "express";
import http from "http";
import { router1 } from "./src/router/router1.js";
import "./db/conntectdb.js";
import { WebSocketServer } from "ws";

const app = express();
const PORT = 3000;

// ✅ Create HTTP server from express app
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router1);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ WebSocket should use HTTP server (NOT app)
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {

  console.log("New client connected");

  ws.on("message", (message) => {

    try {
      const data = JSON.parse(message.toString());

      // 🔥 Check if ESP32
      if (data.type === "device") {
        ws.deviceId = data.id;

        console.log("✅ ESP32 Connected:", data.id);

        // 🔥 Send confirmation back
        ws.send(JSON.stringify({
          status: "connected",
          message: "Welcome ESP32"
        }));

        return;
      }

      if (ws.deviceId) {
        console.log("📩 Data from", ws.deviceId, ":", data);
      }

    } catch (err) {
      console.log("Invalid JSON received");
    }

  });

  ws.on("close", () => {
    if (ws.deviceId) {
      console.log("❌ ESP32 Disconnected:", ws.deviceId);
    }
  });

});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running 🚀");
});

