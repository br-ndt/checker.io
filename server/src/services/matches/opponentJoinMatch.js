import { Match } from "../../models/index.js";

export default async (userId, matchId) => {
  try {
    const match = await Match.query().findOne({ id: matchId });
    const player2 = await match
      .$relatedQuery("matchPlayers")
      .insert({ userId, playerColor: "red" });
    if (player2) {
      return player2;
    }
  } catch (error) {
    console.error(error);
  }
};