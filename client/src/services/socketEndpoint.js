const ENDPOINT =
process.env.NODE_ENV === "development"
  ? "http://localhost:3000"
  : "https://checker.io.herokuapp.com/";

  export default ENDPOINT;