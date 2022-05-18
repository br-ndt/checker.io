// include all of your models here using CommonJS requires
const Board = require("./Board.js");
const Match = require("./Match.js");
const MatchPlayer = require("./MatchPlayer.js");
const Pawn = require("./Pawn.js");
const Tile = require("./Tile.js");
const User = require("./User.js");

module.exports = { Board, Match, MatchPlayer, Pawn, Tile, User };
