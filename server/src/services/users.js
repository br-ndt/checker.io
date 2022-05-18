import { User } from "../models/index.js";
import UserSerializer from "../serializers/UserSerializer.js";

const rooms = {};
const users = [];

export const addUserToRoom = async (id, room) => {
  const user = getUser(id);
  if(user.room) {
    removeUserFromRoom(user.userModel.id, user.room);
  }
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
  const cachedUser = getUser(user.userModel.id);
  if(!cachedUser) {
    users.push(user);
  } else {
    cachedUser.socketId = socketId;
  }
  return user;
}

export const getUser = (id) => {
  return users.find((user) => user.userModel.id == id);
};

export const deleteUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId == socketId);
  console.log(index, users[index]);
  if (index !== -1) {
    return users.splice(index, 1)[0]
  };
};

export const removeUserFromRoom = async (id, room) => {
  console.log(`removing ${id} from room ${room}`)
  if(rooms[room]) {
    const index = getUsersInRoom(room).findIndex((user) => user.userModel.id == id);
    if(index !== -1) return rooms[room].users.splice(index, 1)[0];
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
