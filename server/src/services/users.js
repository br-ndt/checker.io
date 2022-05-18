import { User } from "../models/index.js";
import UserSerializer from "../serializers/UserSerializer.js";

const rooms = {};
const users = [];

export const addUserToRoom = async (id, room) => {
  const user = getUser(id);
  if (rooms[room]) {
    if (rooms[room].users) {
      if(!rooms[room].users.find((user) => user.userModel.id == id)) {
        rooms[room].users.push(user);
      }
    } else {
      rooms[room].users = [user];
    }
  } else {
    rooms[room] = { users: [user] };
  }
  user.room = room;
  return user;
};

export const addUser = async (id, socketId) => {
  const userModel = UserSerializer.getSummary(await User.query().findById(id));
  const user = { userModel, socketId };
  if(!getUser(id)) {
    users.push(user);
  }
  return user;
}

export const getUser = (id) => {
  return users.find((user) => user.userModel.id == id);
};

export const deleteUser = (id) => {
  const index = users.findIndex((user) => user.userModel.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

export const removeUserFromRoom = async (id, room) => {
  if(rooms[room]) {
    const index = getUsersInRoom(room).findIndex((user) => user.userModel.id === id);
    if(index !== -1) return rooms[room].users.splic(index, 1)[0];
  }
}

export const getUsersInRoom = (room) => {
  if (rooms[room]) {
    return rooms[room].users;
  } else {
    return null;
  }
}

export const getUsers = () => {
  return users;
}
