const ENDPOINT =
process.env.NODE_ENV === "development"
  ? "http://localhost:3000"
  : process.env.STAGING
  ? "https://murmuring-caverns-41303.herokuapp.com/"
  : "https://checker-io.herokuapp.com/";

  export default ENDPOINT;