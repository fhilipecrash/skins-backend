import { Server } from "socket.io";
import cors from "cors";
import express, { Express } from "express";
import http from "http";

const app: Express = express();
app.use(cors());
const server = http.createServer(app);
const port = 3001

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const bids: { name: string; bid: number }[] = [{ name: "first", bid: 0 }];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("make_bid", (data) => {
    if(data.bid > bids[bids.length - 1].bid) {
      bids.push(data);
      console.log(bids);
      socket.broadcast.emit("return_bid", data);
    }

  }); 

});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
