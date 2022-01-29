// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// better-sqlite3 on worker threats for slow queries: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/threads.md

import { NextApiRequest, NextApiResponse } from "next";
import { getLatestDatabase, loadLatestDatabase } from "../../helpers/api/db";
import { IGame, GameResult, ITinueGameRow } from "../../helpers/interfaces/db/games";
import { generatePtnNinjaLink } from "../../helpers/ptnninja";
import { createPtn } from "../../helpers/ptn";
import { Database } from "better-sqlite3";

export type ErrorResult = {
  error: string
}

export type SuccessResult = {
  puzzleNotation: string
  puzzleUrl: string
  puzzleId: number
  puzzleSize: number
  solution: string[]
  /**
   * Indicates that this puzzle is unsuitable for some reason
   */
  bad?: boolean
};

export type Result = ErrorResult | SuccessResult;

const firstValidGameDate = 1461430858755;

const getTinue1Game = (db: Database, boardSize: number, puzzleId: number): SuccessResult => {
  const game = db.prepare("SELECT * FROM games WHERE (result = ? OR result = ?) and size = ? and date > ? ORDER BY id LIMIT 1 OFFSET ?")
    .get(GameResult.WhiteRoadWin, GameResult.BlackRoadWin, boardSize, firstValidGameDate, puzzleId - 1) as IGame;
  db.close();

  if (!game) throw new Error(`No game of size '${boardSize}' found. You may have run out of new puzzles. Try a smaller puzzleId`);
  const [player_white, player_black] = game.result === GameResult.WhiteRoadWin ? ["You", "Them"] : ["Them", "You"];
  const { ptn, plyCount: moveCount, finalMoves } = createPtn({ ...game, player_white, player_black }, 1);

  const ptnNinjaHref = generatePtnNinjaLink(ptn, moveCount);

  return {
    puzzleId,
    puzzleNotation: ptn,
    puzzleUrl: ptnNinjaHref,
    puzzleSize: boardSize,
    solution: finalMoves,
    // X wins by Y making a move
    bad: game.result === GameResult.WhiteRoadWin ? moveCount % 2 === 1 : moveCount % 2 === 0
  };
}

const getTinueGame = (db: Database, boardSize: number, puzzleId: number, tinueDepth: number): SuccessResult => {
  const game = db.prepare("SELECT * FROM tinues t JOIN games g ON t.gameid = g.id WHERE t.size = ? and t.tinue_depth = ? ORDER BY t.id LIMIT 1 OFFSET ?")
    .get(boardSize, tinueDepth, puzzleId - 1) as ITinueGameRow;
  db.close();

  if (!game) throw new Error(`No game of size '${boardSize}' with a '${tinueDepth}'-ply tinue found. You may have run out of new puzzles. Try a smaller puzzleId`);
  const [player_white, player_black] = game.result === GameResult.WhiteRoadWin ? ["You", "Them"] : ["Them", "You"];
  const { ptn, plyCount: moveCount } = createPtn({ ...game, player_white, player_black }, game.plies_to_undo);
  const tinueMoves = JSON.parse(game.tinue)

  const ptnNinjaHref = generatePtnNinjaLink(ptn, moveCount);

  return {
    puzzleId,
    puzzleNotation: ptn,
    puzzleUrl: ptnNinjaHref,
    puzzleSize: boardSize,
    solution: tinueMoves,
    bad: false
  };
}

const getPuzzle = async (req: NextApiRequest, res: NextApiResponse<Result>) => {

  try {
    const boardSize = parseInt(req.query.boardSize as string, 10);
    const puzzleId = parseInt(req.query.puzzleId as string, 10);
    const tinueDepth = parseInt(req.query.tinueDepth as string, 10) || 1;
    console.log(`GET puzzle boardsize='${boardSize}' id=${puzzleId} tinueLength=${tinueDepth}`);

    const latestDbPath = getLatestDatabase();
    if (!latestDbPath) {
      console.error("No DB found");
      throw new Error("No DB found");
    }

    const db = loadLatestDatabase(latestDbPath);
    if (typeof db === "string") {
      console.error("Failed to load db", db, latestDbPath);
      throw new Error("Failed to load db");
    }

    if (tinueDepth === 1) {
      return res.status(200).json(getTinue1Game(db, boardSize, puzzleId));
    }
    return res.status(200).json(getTinueGame(db, boardSize, puzzleId, tinueDepth));
  }
  catch (e) {
    console.log("error", e);
    if (e instanceof Error) {
      return res.status(500).json({ error: e.message });
    }
  }
}

export default getPuzzle;