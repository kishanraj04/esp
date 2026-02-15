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
  console.log("ESP32 Connected ✅");

  ws.on("message", (message) => {
    console.log("Received from ESP32:", message.toString());
  });

  ws.on("close", () => {
    console.log("ESP32 Disconnected ❌");
  });
});

// ❌ app.listen mat use karo
// ✅ server.listen use karo
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
