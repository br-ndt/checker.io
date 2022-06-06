import UserSerializer from "../../serializers/UserSerializer.js";
import getUsers from "./getUsers.js";

export default async (io, socket, callback) => {
  try {
    if(socket.request.session.passport) {
      socket.user = await UserSerializer.getSummary(socket.request.user);
      console.log("New user connection on socket:", socket.id, "-", socket.user);
      const users = await getUsers(io);
      io.emit("getUsers", users, "server-wide");
      callback(socket.user);
    }
  } catch (error) {
    console.error(error);
  }
};