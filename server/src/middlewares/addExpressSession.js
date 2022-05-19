import getExpressSession from "./getExpressSession.js";

const addExpressSession = (app) => {
  app.use(
    getExpressSession()
  );
};

export default addExpressSession;
