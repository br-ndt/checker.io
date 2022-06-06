export const registerChatHandlers = (io, socket) => {
  socket.on("sendMessage", async (room, message) => {
    await sendMessage(io, socket, room, message);
  });
}