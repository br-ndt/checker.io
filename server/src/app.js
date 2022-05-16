import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import "./boot.js";
import configuration from "./config.js";
import addMiddlewares from "./middlewares/addMiddlewares.js";
import rootRouter from "./routes/rootRouter.js";
import http from "http";
import { Server } from "socket.io";
import hbsMiddleware from "express-handlebars";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let interval;

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

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  if (interval) {
    clearInterval(interval);
  }
  socket.join("clock");
  interval = setInterval(
    () =>
      io.to("clock").emit(
        "time",
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }).format(new Date())
      ),
    1000
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
    clearInterval(interval);
  });
});

server.listen(configuration.web.port, (error) => {
  if (error) console.log(error);
  console.log(`Server listening on port ${configuration.web.port}`);
});
export default app;
