import movePawn from "./movePawn.js";

export default async (io, socket, moveData) => {
  try {
    const { roomId, fromTile, toTile } = moveData;
    const newMatchState = await movePawn(socket, roomId, fromTile, toTile);
    if (newMatchState) {
      io.in(roomId).emit("boardUpdate", newMatchState);
      io.in(roomId).emit("notification", {
        title: `A Player made a move`,
        description: `${socket.user.username} moved a Pawn from (${fromTile.x},${fromTile.y}) to (${toTile.x},${toTile.y})`,
      });
    }
  } catch (error) {
    console.error(error);
  }
}