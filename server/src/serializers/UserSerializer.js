class UserSerializer {
  static getSummary(user) {
    if(!user) return "None";
    const allowedAttributes = ["username", "id"];
    let serializedUser = {};
    for(const attribute of allowedAttributes) {
      serializedUser[attribute] = user[attribute];
    }
    return serializedUser;
  }
}

export default UserSerializer;