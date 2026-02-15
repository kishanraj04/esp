import express from "express";
import { router1 } from "./src/router/router1.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router1);


const WebSocket = require("ws");
const server = app.listen(PORT);
const wss = new WebSocket.Server({ server });

let espSocket = null;

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    if (msg.toString() === "esp32") {
      espSocket = ws;
      console.log("ESP32 Connected");
    }
  });
});

app.post("/api/light", (req, res) => {
  if (espSocket) {
    espSocket.send("turn_on");
  }
  res.json({ success: true });
});


app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
