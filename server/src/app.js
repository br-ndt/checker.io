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
  removeUserFromRoom,
  getRoomList,
} from "./services/users.js";
import { createMatch, getMatch, joinMatch } from "./services/matchmaking.js";
import { movePawn } from "./services/game.js";

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
          origin: "https://checker-io.herokuapp.com/",
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
  if (!socket.request.user) {
    console.log(`Socket ${socket.id} is not associated with any user, closing connection...`);
    socket.disconnect();
    return;
  }

  socket.on("whoami", (callback) => {
    callback(socket.request.user ? socket.request.user : "");
  });

  socket.on("addUser", async (callback) => {
    try {
      const user = await addUser(socket);
      if (user) {
        console.log("New user connection:", user);
        io.emit("getUsers", getUsers(), "server-wide");
        callback();
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("enterLobby", async (callback) => {
    socket.join("lobby");
    const roomList = await getRoomList();
    callback(roomList);
  });

  socket.on("createMatch", async (user, callback) => {
    try {
      const matchId = await createMatch(getUser(user.id));
      if (matchId) {
        console.log(`Match ${matchId} created`);
        callback(matchId);
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("userJoinMatchRoom", async (id, room, callback) => {
    try {
      const user = getUser(id);
      if (user) {
        const matchRoom = await addUserToRoom(user, room);
        if (matchRoom) {
          console.log(
            `${user.userModel.username}-${user.socketId}-${user.userModel.id} successfully joined room ${matchRoom}`
          );
          socket.leave("lobby");
          socket.join(matchRoom);
          io.in(matchRoom).emit("notification", {
            title: "A user has joined",
            description: `${user.userModel.username} just entered the room`,
          });
          io.in(matchRoom).emit("getUsers", getUsersInRoom(room), `room ${room}`);
          const roomList = await getRoomList();
          io.in("lobby").emit("getMatches", roomList);

          const match = await getMatch(matchRoom);
          if (match.player2 === "None" && match.player1.id !== user.userModel.id) {
            match.player2 = await joinMatch(user.userModel.id, match.id);
            if (match.player2) {
              match.player2 = user.userModel;
              socket.in(matchRoom).emit("opponentJoin", match);
              io.in(matchRoom).emit("notification", {
                title: "A challenger approaches",
                description: `${user.userModel.username} is now the Red Player`,
              });
            }
          }
          callback(match);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("userLeftMatchRoom", async (id) => {
    const user = getUser(id);
    if(user) {
      if(removeUserFromRoom(user)) {
        console.log(`${user.userModel.username} has left a room`);
        const roomList = await getRoomList();
        io.in("lobby").emit("getMatches", roomList);
      }

    }
  })

  socket.on("playerMovesPawn", async (roomId, user, fromTile, toTile, pawn, callback) => {
    try {
      const newMatchState = await movePawn(socket.id, roomId, user, fromTile, toTile, pawn);
      if (newMatchState) {
        io.in(roomId).emit("boardUpdate", newMatchState);
        io.in(roomId).emit("notification", {
          title: `A Player made a move`,
          description: `${user.username} moved a Pawn from (${fromTile.x},${fromTile.y}) to (${toTile.x},${toTile.y})`,
        });
        callback("Board was updated");
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    io.in(user.room).emit("message", { user: user.name, text: message });
  });

  socket.on("disconnect", async () => {
    console.log("A socket disconnected", socket.id);
    const user = deleteUser(socket.id);
    const prevRoom = removeUserFromRoom(user);
    if (prevRoom) {
      console.log(
        `${user.userModel.username}-${user.socketId}-${user.userModel.id} successfully left Room ${prevRoom}.`
      );
      io.in(prevRoom).emit("notification", {
        title: "A user has left",
        description: `${user.userModel.username} just left the room`,
      });
      io.in(prevRoom).emit("getUsers", getUsers(prevRoom), `room ${prevRoom}`);
      const roomList = await getRoomList();
      io.in("lobby").emit("getMatches", roomList);
    }
  });
});

server.listen(configuration.web.port, configuration.web.host, (error) => {
  if (error) console.log(error);
  console.log(`Server listening on port ${configuration.web.port}`);
});

export default app;
