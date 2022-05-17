import session from "express-session";
import configuration from "../config.js";

const getExpressSession = () => {
  return session({
    name: "checker.io-session",
    keys: [configuration.session.secret],
    resave: true,
    saveUninitialized: false,
    maxAge: configuration.maxAge,
  })
}

export default getExpressSession;