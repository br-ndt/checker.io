import { User } from "../models/index.js";
import UserSerializer from "../serializers/UserSerializer.js";

const rooms = {};
const users = [];

export const addUserToMatchRoom = async (user, room) => {
  console.log(`${user.userModel.username}-${user.socketId}-${user.userModel.id} joining Room ${room}...`);
  if (user.room) {
    removeUserFromRoom(user.userModel.id, user.room);
  }
  if (rooms[room]) {
    if (rooms[room].users) {
      if (!rooms[room].users.find((checkedUser) => user.userModel.id == checkedUser.userModel.addUserid)) {
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
};

export const addUser = async (socket) => {
  const session = socket.request.session.passport;
  session.socketId = socket.id;
  const cachedUser = getUser(session.user);
  if (!cachedUser) {
    const userModel = UserSerializer.getSummary(await User.query().findById(session.user));
    const user = { userModel, socketId: socket.id };
    users.push(user);
    return user;
  } else {
    cachedUser.socketId = socket.id;
    return false;
  }
};

export const getUser = (id) => {
  return users.find((user) => user.userModel.id == id);
};

export const deleteUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId == socketId);
  if (index !== -1) {
    const user = users.splice(index, 1)[0];
    if(user) {
      return user;
    }
  }
  return false;
};

export const removeUserFromRoom = (user) => {
  if (user.room && rooms[user.room]) {
    console.log(`${user.userModel.username}-${user.socketId}-${user.userModel.id} leaving Room ${user.room}...`);
    const index = getUsersInRoom(user.room).findIndex((checkedUser) => user.userModel.id == checkedUser.userModel.id);
    if (index !== -1) {
      rooms[user.room].users.splice(index, 1)[0];
      const prevRoom = user.room;
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
