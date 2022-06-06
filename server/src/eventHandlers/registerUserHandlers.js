import addUser from "../services/users/addUser.js";
import disconnect from "../services/users/disconnect.js";
import getUserStats from "../services/users/getUserStats.js";

export const registerUserHandlers = (io, socket) => {
  socket.on("whoami", (callback) => {
    callback(socket.request.user ? socket.request.user : "");
  });

  socket.on("addUser", (callback) => {
    addUser(io, socket, callback);
  });

  socket.on("getUserStats", (callback) => {
    getUserStats(socket, callback);
  });

  socket.on("disconnect", () => {
    disconnect(io, socket);
  });
};
