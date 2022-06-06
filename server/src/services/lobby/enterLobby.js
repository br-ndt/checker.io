import getRoomList from "./getRoomList.js";
import getMatch from "../matches/getMatch.js";

export default async (io, socket, callback) => {
  socket.join("lobby");
  console.log(`socket ${socket.id} entered the lobby`);
  const roomList = getRoomList(io);
  const matchList = await Promise.all(roomList.map(async (room) => {
    return await getMatch(room);
  }));
  callback(matchList);
}