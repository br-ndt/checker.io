import playerMovesPawn from "../services/game/playerMovesPawn.js";

export const registerGameHandlers = (io, socket) => {
  socket.on("playerMovesPawn", async (moveData) => {
    await playerMovesPawn(io, socket, moveData)
  });
}