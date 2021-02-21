import { NextApiRequest, NextApiResponse } from "next";
import { getLatestDatabase, loadLatestDatabase } from "../../helpers/api/db";
import { GameResult, ITinueGameRow } from "../../helpers/interfaces/db/games";

type IStatisticRow = Pick<ITinueGameRow, "size" | "tinue_depth"> & {
  count: number
}

export type IPuzzleStatistics = IStatisticRow[];

export type IResult = {
  statistics: IPuzzleStatistics
}

const firstValidGameDate = 1461430858755;

export const getPuzzleStatistics = (): IPuzzleStatistics => {
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

  // 3-ply and deeper tinues from the tinues table
  const tinues = db.prepare("SELECT size, tinue_depth, COUNT(*) AS count FROM tinues GROUP BY size, tinue_depth").all() as IStatisticRow[];
  // 1-ply tinues from the games table
  const games = db.prepare('SELECT size, COUNT(*) AS count FROM games WHERE (result = ? or result = ?) and date > ? GROUP BY size')
    .all([GameResult.WhiteRoadWin, GameResult.BlackRoadWin, firstValidGameDate]) as IStatisticRow[];

  return [
    ...tinues,
    ...games.map<IStatisticRow>(game => ({ ...game, tinue_depth: 1 }))
  ];
}

export default async (req: NextApiRequest, res: NextApiResponse<IResult>) => {
  console.log(`GET puzzle statistics`);

  return res.status(200).json({ statistics: getPuzzleStatistics() });
}
