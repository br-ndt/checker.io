export default async (io, socket, room, message) => {
  let color = "grey";
  const match = await getMatch(room);
  if (match) {
    if (match.player1.id === socket.user.id) color = "white";
    if (match.player2.id === socket.user.id) color = "red";
    io.in(room).emit("newMessage", { user: socket.user.username, text: message, color });
  }
}