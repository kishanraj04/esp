import express from "express";
import http from "http";
import { router1 } from "./src/router/router1.js";
import "./db/conntectdb.js";
import cors from "cors"; 
import { Server } from "socket.io";

const app = express();
const PORT = 3000;

// ✅ Create HTTP server from express app
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } }); 

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.emit("message","welcome to the server");

  socket.on("deviceSelected", (data) => {
    const { deviceId, roomId } = data;

    //emit the roomid and device id to esp32 and catch the data in esp32 and perform the action
    io.emit("deviceSelected", { deviceId, roomId });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router1);
app.use(cors()); 

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});





server.listen(process.env.PORT || 3000, () => {
  console.log("Server running 🚀");
});

