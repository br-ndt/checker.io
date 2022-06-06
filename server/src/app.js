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
import { registerChatHandlers } from "./eventHandlers/registerChatHandlers.js";
import { registerGameHandlers } from "./eventHandlers/registerGameHandlers.js";
import { registerMatchHandlers } from "./eventHandlers/registerMatchHandlers.js";
import { registerUserHandlers } from "./eventHandlers/registerUserHandlers.js";
import { registerLobbyHandlers } from "./eventHandlers/registerLobbyHandlers.js";

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

const onConnection = (socket) => {
  if (!socket.request.user) {
    console.log(`Socket ${socket.id} is not associated with any user, closing connection...`);
    socket.disconnect();
    return;
  }

  registerChatHandlers(io, socket);
  registerGameHandlers(io, socket);
  registerLobbyHandlers(io, socket);
  registerMatchHandlers(io, socket);
  registerUserHandlers(io, socket);
}

io.on("connection", onConnection);

server.listen(configuration.web.port, configuration.web.host, (error) => {
  if (error) console.log(error);
  console.log(`Server listening on port ${configuration.web.port}`);
});

export default app;
