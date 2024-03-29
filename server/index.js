const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "*",

    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room, username) => {
    socket.join(room);
    console.log(`${username} joined ${room}`);
    socket.username = username;
    socket.room = room;
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("leave_room", (room, username) => {
    socket.leave(room);
    console.log(`${username} left ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
