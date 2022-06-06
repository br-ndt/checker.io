import createMatch from "../services/matches/createMatch.js";
import getUserMatches from "../services/profile/getUserMatches.js";
import userJoinMatchRoom from "../services/matches/userJoinMatchRoom.js";
import userLeftMatchRoom from "../services/matches/userLeftMatchRoom.js";

export const registerMatchHandlers = (io, socket) => {
  socket.on("getCurrentMatches", async (callback) => {
    await getUserMatches(socket, callback)
  });

  socket.on("createMatch", async (callback) => {
    await createMatch(socket, callback);
  });

  socket.on("userJoinMatchRoom", async (room, callback) => {
    await userJoinMatchRoom(io, socket, room, callback);
  });

  socket.on("userLeftMatchRoom", (room) => {
    userLeftMatchRoom(io, socket, room);
  });
}