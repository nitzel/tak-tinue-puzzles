// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// better-sqlite3 on worker threats for slow queries: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/threads.md

import { NextApiRequest, NextApiResponse } from "next";
import { getLatestDatabase, loadLatestDatabase } from "../../../../helpers/api/db";
import { GameResult, IGame } from "../../../../helpers/interfaces/db/games";
import { compressToEncodedURIComponent } from "lz-string";
import { createPtn } from "../../../../helpers/ptn";
import { generatePtnNinjaLink } from "../../../../helpers/ptnninja";

export type Result = {
  puzzleNotation: string
  puzzleUrl: string
};

const firstValidGameDate = 1461430858755;

export default async (req: NextApiRequest, res: NextApiResponse<Result>) => {

  const { boardSize } = req.query;
  console.log(`GET puzzle random boardsize='${boardSize}'`);

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

  const game = db.prepare("SELECT * FROM games WHERE (result = ? OR result = ?) and size = ? and date > ? ORDER BY RANDOM() LIMIT 1")
    .get(GameResult.WhiteRoadWin, GameResult.BlackRoadWin, boardSize, firstValidGameDate) as IGame;
  db.close();

  if (!game) throw new Error(`No game of size '${boardSize}' found`);


  const { ptn, moveCount } = createPtn(game, 1);
  console.log(game);
  console.log(game.notation);
  console.log(ptn);
  const ptnNinjaLink = generatePtnNinjaLink(ptn, moveCount - 1);
  console.log(ptnNinjaLink);

  res.status(200).json({
    puzzleNotation: ptn,
    puzzleUrl: ptnNinjaLink,
  });
}
