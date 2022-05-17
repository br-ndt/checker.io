export const users = [];

export const addUser = (id, socketId, room) => {  
  const user = { id, socketId, room };
  users.push(user);
  return { user };
};

export const getUser = id => {
  return users.find(user => user.id == id);
}

export const deleteUser = id => {
  const index = users.findIndex(user => user.id === id);
  if(index !== -1) return users.splice(index, 1)[0];
}

export const getUsers = room => users.filter(user => user.room === room);