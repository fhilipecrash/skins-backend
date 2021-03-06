import { Server } from "socket.io";
import cors from "cors";
import express, { Express } from "express";
import { createServer } from "http";
import path from 'path';

const app: Express = express();
app.use(cors());
const server = createServer(app);
const port = 3001

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

interface BidProps {
  name: string;
  bid: number;
}

const bidObj: Record<string, BidProps[]> = {
  "ak47": [] as BidProps[],
  "m4a1": [] as BidProps[],
  "awp": [] as BidProps[],
  "p90": [] as BidProps[],
  "karambit": [] as BidProps[]
};

app.use('/', express.static(path.join(__dirname, '/public')));

io.on("connection", (socket) => {
  const room = String(socket.handshake.query.room);
  socket.join(room);

  if (bidObj[room].length > 0) {
    socket.emit("previousBids", bidObj[room]);
  }

  socket.on("makeBid", (data) => {
    if (bidObj[room].length === 0 || data.bid > bidObj[room][bidObj[room].length - 1].bid) {
      bidObj[room].push(data);
      socket.broadcast.to(room).emit("returnBid", data);
      socket.broadcast.to(room).emit("updatedBids", bidObj[room]);
    }
  });

});

server.listen(port, () => console.log(`Server is running on port ${port}`));
