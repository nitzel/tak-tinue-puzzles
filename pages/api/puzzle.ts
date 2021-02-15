// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// better-sqlite3 on worker threats for slow queries: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/threads.md

import { NextApiRequest, NextApiResponse } from "next";
import { getLatestDatabase, loadLatestDatabase } from "../../helpers/api/db";
import { IGame, GameResult } from "../../helpers/interfaces/db/games";
import { generatePtnNinjaLink } from "../../helpers/ptnninja";
import { createPtn } from "../../helpers/ptn";

export type Result = {
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

const firstValidGameDate = 1461430858755;

export default async (req: NextApiRequest, res: NextApiResponse<Result>) => {

  const boardSize = parseInt(req.query.boardSize as string, 10);
  const puzzleId = parseInt(req.query.puzzleId as string, 10);
  console.log(`GET puzzle boardsize='${boardSize}' id=${puzzleId}`);

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

  const game = db.prepare("SELECT * FROM games WHERE (result = ? OR result = ?) and size = ? and date > ? ORDER BY id LIMIT 1 OFFSET ?")
    .get(GameResult.WhiteRoadWin, GameResult.BlackRoadWin, boardSize, firstValidGameDate, puzzleId) as IGame;
  db.close();

  const actualPuzzleId = puzzleId; //(puzzleId as unknown as number) % games.length;

  if (!game) throw new Error(`No game of size '${boardSize}' found`);
  const [player_white, player_black] = game.result === GameResult.WhiteRoadWin ? ["You", "Them"] : ["Them", "You"];
  const { ptn, moveCount, finalMoves } = createPtn({ ...game, player_white, player_black }, 1);

  const ptnNinjaHref = generatePtnNinjaLink(ptn, moveCount);

  res.status(200).json({
    puzzleNotation: ptn,
    puzzleUrl: ptnNinjaHref,
    puzzleId: actualPuzzleId,
    puzzleSize: boardSize,
    solution: finalMoves,
    // X wins by Y making a move
    bad: game.result === GameResult.WhiteRoadWin ? moveCount % 2 === 1 : moveCount % 2 === 0
  });
}
