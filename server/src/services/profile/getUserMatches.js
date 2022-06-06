import { User } from "../../models/index.js";
import MatchSerializer from "../../serializers/MatchSerializer.js";

export default async (socket, callback) => {
  try {
    if (socket.user) {
      const userModel = await User.query().findById(socket.user.id);
      const matches = await userModel.$relatedQuery("matches");
      const serializedMatches = await Promise.all(
        matches.sort((matchA, matchB) => {
          return matchB.updatedAt - matchA.updatedAt;
        }).map(async (match) => {
          const serializedMatch = await MatchSerializer.getRoomInfo(match);
          return serializedMatch;
        })
      );
      callback(serializedMatches);
    }
  } catch (error) {
    console.error(error);
  }
};