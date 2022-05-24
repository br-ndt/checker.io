import { Match, User } from "../models/index.js";
import UserSerializer from "../serializers/UserSerializer.js";

const rooms = {};
const users = [];

export const getRoomList = async () => {
  const roomList = [];
  for (const roomId in rooms) {
    const thisRoom = rooms[roomId];
    thisRoom.id = roomId;
    const thisMatch = await Match.query().findById(roomId);
    if (thisMatch) {
      const matchPlayer1 = await thisMatch
        .$relatedQuery("matchPlayers")
        .findOne({ playerColor: "white" });
      if (matchPlayer1) {
        const player1 = await matchPlayer1.$relatedQuery("user");
        if (player1) thisRoom.player1 = await UserSerializer.getSummary(player1);
      }
      const matchPlayer2 = await thisMatch
        .$relatedQuery("matchPlayers")
        .findOne({ playerColor: "red" });
      if (matchPlayer2) {
        const player2 = await matchPlayer2.$relatedQuery("user");
        if (player2) thisRoom.player2 = await UserSerializer.getSummary(player2);
      }
      roomList.push(thisRoom);
    }
  }
  return roomList;
};

export const addUserToRoom = async (user, room) => {
  console.log(
    `${user.userModel.username}-${user.socketId}-${user.userModel.id} joining Room ${room}...`
  );
  try {
    if (user.room) {
      removeUserFromRoom(user.userModel.id, user.room);
    }
    if (rooms[room]) {
      if (rooms[room].users) {
        if (
          !rooms[room].users.find(
            (checkedUser) => user.userModel.id == checkedUser.userModel.addUserid
          )
        ) {
          rooms[room].users.push(user);
        } else {
          return false;
        }
      } else {
        rooms[room].users = [user];
      }
    } else {
      rooms[room] = { users: [user] };
    }

    user.room = room;
    return room;
  } catch (error) {
    console.error(error);
  }
};

export const addUser = async (socket) => {
  try {
    const session = socket.request.session.passport;
    session.socketId = socket.id;
    const cachedUser = getUser(session.user);
    if (!cachedUser) {
      const userModel = await UserSerializer.getSummary(await User.query().findById(session.user));
      const user = { userModel, socketId: socket.id };
      users.push(user);
      return user;
    } else {
      cachedUser.socketId = socket.id;
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUser = (id) => {
  return users.find((user) => user.userModel.id == id);
};

export const deleteUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId == socketId);
  if (index !== -1) {
    const user = users.splice(index, 1)[0];
    if (user) {
      return user;
    }
  }
  return false;
};

export const removeUserFromRoom = (user) => {
  if (user.room && rooms[user.room]) {
    console.log(
      `${user.userModel.username}-${user.socketId}-${user.userModel.id} leaving Room ${user.room}...`
    );
    const index = getUsersInRoom(user.room).findIndex(
      (checkedUser) => user.userModel.id == checkedUser.userModel.id
    );
    if (index !== -1) {
      rooms[user.room].users.splice(index, 1)[0];
      const prevRoom = user.room;
      if (rooms[user.room].users.length === 0) delete rooms[user.room];
      delete user.room;
      return prevRoom;
    }
  }
  return false;
};

export const getUsersInRoom = (room) => {
  if (rooms[room]) {
    return rooms[room].users;
  } else {
    return null;
  }
};

export const getUsers = () => {
  return users;
};
