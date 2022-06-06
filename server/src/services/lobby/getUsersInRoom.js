export default async (io, room) => {
  const sockets = await io.in(room).fetchSockets();
  return sockets
    .filter((socket) => {
      return socket.user;
    })
    .map((socket) => {
      return socket.user;
    });
};
