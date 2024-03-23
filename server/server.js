const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();

const mongoose = require("mongoose");
const routes = require("./routes");

app.use(express.json());

/* CORS */

const CORS_WHITELIST = ["http://localhost:3000", "https://www.hydrogen.icu"];

const corsOptions = {
  origin: (origin, callback) => {
    if (CORS_WHITELIST.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

/* SOCKET.IO */

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ROUTES */

app.get("/", (_, res) => {
  res.send("Hello world!");
});

app.use("/api", routes);

/* SOCKET.IO */

const UserService = require("./services/user.service");

// JWT Token needs to be passed as a query parameter to the WS connection
io.on("connection", async (socket) => {
  const token = socket.handshake.query.token;
  if (!token) {
    console.log("SOCKET: No Token");

    socket.disconnect();
    return;
  }

  try {
    const user = await UserService.GetUserFromToken(token);

    if (user) {
      socket.on("join_room", (roomId) => {
        socket.join(roomId);
      });

      socket.on("send_msg", (data) => {
        io.to(data.roomId).emit("receive_msg", data);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    } else {
      console.log("SOCKET: No User");
      socket.disconnect();
    }
  } catch (err) {
    console.log("SOCKET: ", err);
    socket.disconnect();
  }
});

/* SERVER */

mongoose.connect(process.env.MONGODB_URI).then(() => {
  server.listen(3001, () => {
    console.log("Listening on port 3001...");
  });
});
