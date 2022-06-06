export default async (io) => {
  const sockets = await io.fetchSockets();
  return sockets.filter((socket) => {
    return socket.user;
  }).map((socket) => {
    return socket.user;
  });
};