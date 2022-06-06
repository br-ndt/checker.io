import getRoomList from "../lobby/getRoomList.js";
import getUsersInRoom from "../lobby/getUsersInRoom.js";
import getMatch from "./getMatch.js";
import opponentJoinMatch from "./opponentJoinMatch.js";

export default async (io, socket, room, callback) => {
  try {
    if (socket.user) {
      console.log(
        `${socket.user.username}-${socket.id}-${socket.user.id} successfully joined room ${room}`
      );
      socket.leave("lobby");
      socket.join(room);
      io.in(room).emit("notification", {
        title: "A user has joined",
        description: `${socket.user.username} just entered the room`,
      });
      const usersInRoom = await getUsersInRoom(io, room);
      io.in(room).emit("getUsers", usersInRoom, `room ${room}`);
      const roomList = getRoomList(io);
      io.in("lobby").emit("getMatches", roomList);

      const match = await getMatch(room);
      if (match.player2 === "None" && match.player1.id !== socket.user.id) {
        match.player2 = await opponentJoinMatch(socket.user.id, match.id);
        if (match.player2) {
          match.player2 = socket.user;
          socket.in(room).emit("opponentJoin", match);
          io.in(room).emit("notification", {
            title: "A challenger approaches",
            description: `${socket.user.username} is now the Red Player`,
          });
        }
      }
      callback(match);
    }
  } catch (error) {
    console.error(error);
  }
}