import getExpressSession from "./getExpressSession.js";
import passport from "passport";

const addIOMiddlewares = io => {
  io.use(wrap(getExpressSession()))
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
};

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

export default addIOMiddlewares;
