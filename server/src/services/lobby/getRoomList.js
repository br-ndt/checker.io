export default (io) => {
  const arr = Array.from(io.sockets.adapter.rooms);
  const filtered = arr
    .filter((room) => !room[1].has(room[0]))
    .filter((room) => {
      return room[0] !== "lobby";
    });
  const rooms = filtered.map((i) => i[0]);
  return rooms;
};
