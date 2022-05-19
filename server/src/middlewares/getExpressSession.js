import session from "cookie-session";
import configuration from "../config.js";

const getExpressSession = () => {
  return session({
    name: "checker.io-session",
    keys: [configuration.session.secret],
    maxAge: configuration.maxAge,
  })
}

export default getExpressSession;