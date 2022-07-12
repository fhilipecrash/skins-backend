const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
const server = http.createServer(app);
const port = 3001

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let bids = [0];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("make_bid", (data) => {
    if(data.bid > bids[bids.length - 1].bid) {
      bids.push(data);
      console.log(bids);
    }
    socket.broadcast.emit("return_bid", data);
  }); 

});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
