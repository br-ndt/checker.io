import enterLobby from "../services/lobby/enterLobby.js";

export const registerLobbyHandlers = (io, socket) => {
  socket.on("enterLobby", async (callback) => {
    console.log(`socket ${socket.id} entered lobby`)
    await enterLobby(io, socket, callback);
  });
}