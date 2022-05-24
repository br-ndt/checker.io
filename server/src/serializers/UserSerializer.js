import MatchSerializer from "./MatchSerializer.js";

class UserSerializer {
  static async getSummary(user) {
    if(!user) return "None";
    const allowedAttributes = ["username", "id", "wins", "losses"];
    let serializedUser = {};
    for(const attribute of allowedAttributes) {
      serializedUser[attribute] = user[attribute];
    }
    return serializedUser;
  }

  static async getMatchHistory(user) {
    if(!user) return "None";
    const allowedAttributes = ["username", "id", "wins", "losses"];
    let serializedUser = {};
    for(const attribute of allowedAttributes) {
      serializedUser[attribute] = user[attribute];
    }
    const matches = await user.$relatedQuery("matches");
    serializedUser.matches = await Promise.all(
      matches.map(async (match) => {
        return await MatchSerializer.getRoomInfo(match);
      })
    )
    return serializedUser;
  }
}

export default UserSerializer;