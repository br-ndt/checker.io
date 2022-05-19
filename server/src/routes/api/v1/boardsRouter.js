import express from "express";
import { generateBoard } from "../../../services/board.js";

const boardsRouter = new express.Router();

boardsRouter.get("/", async (req, res) => {
  const board = await generateBoard(8, 8);
  res.status(200).json(board);
});

export default boardsRouter;
