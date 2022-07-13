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

const bids: BidProps[] = [{ name: "first", bid: 0 }];

io.on("connection", (socket) => {
  socket.emit("previousBids", bids);

  socket.on("makeBid", (data) => {
    if(data.bid > bids[bids.length - 1].bid) {
      bids.push(data);
      socket.broadcast.emit("returnBid", data);
      socket.broadcast.emit("updatedBids", bids);
    }

  }); 

});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
