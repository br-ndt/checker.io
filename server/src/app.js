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
import { addUser, getUser, deleteUser, getUsers } from "./services/users.js";

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
  console.log("A user connected:", socket.id);

  socket.on('whoami', (callback) => {
    callback(socket.request.user ? socket.request.user : '');
  })

  console.log(socket.request.session);
  const session = socket.request.session;
  console.log(`saving socketId ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();
  socket.on("userJoinRoom", ({ userId, room }, callback) => {
    console.log(`Adding user ${userId} to room ${room}`);
    const { user, error } = addUser(userId, socket.id, room);
    if (error) return callback(error);

    socket.join(user.room);
    socket.in(room).emit("notification", {
      title: "A user has joined",
      description: `${user.name} just entered the room`,
    });
    io.in(room).emit("users", getUsers(room));
    callback();
  });

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
