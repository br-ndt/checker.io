import { Match } from "../../models/index.js";
import generateBoard from "../board/generateBoard.js";

export default async (socket, callback) => {
  if (!socket.user) {
    return false;
  }
  console.log(`${socket.user.username} creating Match...`);
  try {
    const newMatch = await Match.query().insertAndFetch({ isFinished: false, isRedsTurn: true });
    newMatch.player1 = await newMatch
      .$relatedQuery("matchPlayers")
      .insert({ userId: socket.user.id, playerColor: "white" });
    newMatch.board = await generateBoard(newMatch.id);
    console.log(`Match ${newMatch.id} created`);
    callback(newMatch.id);
  } catch (error) {
    console.error(error);
  }
};