import { Match, User } from "../models/index.js";
import generateBoard from "./generateBoard.js";
import MatchSerializer from "../serializers/MatchSerializer.js";
import BoardSerializer from "../serializers/BoardSerializer.js";
const playersSeeking = [];

export const createMatch = async (user) => {
  const newMatch = await Match.query().insertAndFetch({ isFinished: false, isRedsTurn: true });
  newMatch.player1 = await newMatch
    .$relatedQuery("matchPlayers")
    .insert({ playerId: user.id, playerColor: "white" });
  newMatch.board = await generateBoard(newMatch.id);
  const serializedMatch = await MatchSerializer.getSummary(newMatch);
  return serializedMatch;
};

export const getMatch = async (id) => {
  const match = await Match.query().findById(id);
  const board = await match.$relatedQuery("board");
  match.board = await BoardSerializer.getFullBoard(board);
  return match;
}

export const matchMake = async (user) => {
  playersSeeking.push(user);
  if (playersSeeking.length > 1) {
    // Match query with 1st and 2nd player
    // if query includes 'user'
    // return Match
  }
};
