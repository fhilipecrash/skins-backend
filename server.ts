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

interface BidProps {
  name: string;
  bid: number;
}

const bids: BidProps[] = [];

io.on("connection", (socket) => {
  function setRoomName(room: string) {
    roomName = room;
  }

  let roomName: string;

  socket.on("makeRoom", async (room) => {
    socket.join(room);
    console.log(`joined room ${room}`);
    await setRoomName(room);
  });
  

  if (bids.length > 0) {
    socket.emit("previousBids", bids);
  }

  socket.on("makeBid", (data) => {
    if (bids.length === 0 || data.bid > bids[bids.length - 1].bid) {
      bids.push(data);
      socket.broadcast.to(roomName).emit("returnBid", data);
      socket.broadcast.to(roomName).emit("updatedBids", bids);
    }
  });

});

server.listen(port, () => console.log(`Server is running on port ${port}`));
