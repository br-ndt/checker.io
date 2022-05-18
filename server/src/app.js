import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import "./boot.js";
import configuration from "./config.js";
import addMiddlewares from "./middlewares/addMiddlewares.js";
import addIOMiddlewares from "./middlewares/addIOMiddlewares.js";
import rootRouter from "./routes/rootRouter.js";
import http from "http";
import { Server } from "socket.io";
import hbsMiddleware from "express-handlebars";
import {
  addUser,
  addUserToRoom,
  getUser,
  deleteUser,
  getUsers,
  getUsersInRoom,
} from "./services/users.js";
import { createMatch, getMatch } from "./services/matchmaking.js"

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io =
  process.env.NODE_ENV === "development"
    ? new Server(server, {
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"],
        },
      })
    : new Server(server, {
        cors: {
          origin: "https://checker.io/herokuapp.com/",
          methods: ["GET", "POST"],
        },
      });

app.set("views", path.join(__dirname, "../views"));
app.engine(
  "hbs",
  hbsMiddleware({
    defaultLayout: "default",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
addMiddlewares(app);
app.use(rootRouter);

addIOMiddlewares(io);

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("A connection message on socket:", socket.id);
  if(!socket.request.user) {
    return;
  }

  socket.on("whoami", (callback) => {
    callback(socket.request.user ? socket.request.user : "");
  });

  socket.on("addUser", async (callback) => {
    const session = socket.request.session.passport;
    session.socketId = socket.id;
    const sessionUser = await addUser(session.user, socket.id);
    console.log("New user logged in:", sessionUser);
    io.emit("getUsers", getUsers(), "server-wide");
    callback();
  });

  socket.on("createMatch", async ({ id }, callback) => {
    const user = getUser(id);
    console.log(`${user.userModel.username} creating Match...`);
    const match = await createMatch(user);
    callback(match.id);
  });

  socket.on("userJoinRoom", async (userId, room, callback) => {
    console.log(`Adding user ${userId} to room ${room}`);
    const user = await addUserToRoom(userId, socket.id, room);

    socket.join(room);
    console.log(user.userModel);
    io.in(room).emit("notification", {
      title: "A user has joined",
      description: `${user.userModel.username} just entered the room`,
    });
    console.log("room#", room);
    io.in(room).emit("getUsers", getUsersInRoom(room), `room ${room}`);
    const match = await getMatch(room);
    callback(match);
  });

  socket.on("playerMovesPawn", async (roomId, user, board, callback) => {

  })

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    io.in(user.room).emit("message", { user: user.name, text: message });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    const user = deleteUser(socket.id);
    if (user) {
      io.in(user.room).emit("notification", {
        title: "A user has left",
        description: `${user.name} just left the room`,
      });
      io.in(user.room).emit("users", getUsers(user.room));
    }
  });
});

server.listen(configuration.web.port, (error) => {
  if (error) console.log(error);
  console.log(`Server listening on port ${configuration.web.port}`);
});
export default app;
