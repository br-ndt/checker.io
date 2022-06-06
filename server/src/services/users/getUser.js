export default (id) => {
  return users.find((user) => user.userModel.id == id);
};