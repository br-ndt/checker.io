export default async (io, socket, room) => {
  if (socket.user) {
    socket.leave(room);
    console.log(`${user.userModel.username} has left a room`);
    const roomList = await getRoomList();
    io.in("lobby").emit("getMatches", roomList);
  }
};
