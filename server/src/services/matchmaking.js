import { Match, User } from "../models/index.js";
import { generateBoard } from "./board.js";
import MatchSerializer from "../serializers/MatchSerializer.js";
const playersSeeking = [];

export const createMatch = async (user) => {
  if(!user) {
    return false;
  }
  console.log(`${user.userModel.username} creating Match...`);
  try {
    const newMatch = await Match.query().insertAndFetch({ isFinished: false, isRedsTurn: true });
    newMatch.player1 = await newMatch
      .$relatedQuery("matchPlayers")
      .insert({ userId: user.userModel.id, playerColor: "white" });
    newMatch.board = await generateBoard(newMatch.id);
    return newMatch.id;
  } catch (error) {
    console.error(error);
  }
};

export const getMatch = async (id) => {
  try {
    const match = await Match.query().findById(id);
    const serializedMatch = await MatchSerializer.getSummary(match);
    return serializedMatch;
  } catch (error) {
    console.error(error);
  }
}

export const joinMatch = async (userId, matchId) => {
  try {
    const match = await Match.query().findOne({ id: matchId })
    const player2 = await match.$relatedQuery("matchPlayers").insert({ userId, playerColor: "red" });
    if(player2) {
      return player2;
    }
  } catch (error) {
    console.error(error);
  }
}

export const matchMake = async (user) => {
  playersSeeking.push(user);
  if (playersSeeking.length > 1) {
    // Match query with 1st and 2nd player
    // if query includes 'user'
    // return Match
  }
};
