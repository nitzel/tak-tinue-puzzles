// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// better-sqlite3 on worker threats for slow queries: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/threads.md

import { NextApiRequest, NextApiResponse } from "next";
import { getLatestDatabase, loadLatestDatabase } from "../../../helpers/api/db";
import { IGame } from "../../../helpers/interfaces/db/games";

export type Result = { games: IGame[] };

const getPlayerGames = async (req: NextApiRequest, res: NextApiResponse<Result>) => {
  if (req.method !== 'GET') {
    throw new Error("Only GET is supported");
  }
  // TODO: finding the latest database should probably not be done per request
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

  const playerName = req.query.name;

  const games = db.prepare("SELECT * FROM games WHERE player_white = ? or player_black = ?").all(playerName, playerName) as IGame[];

  db.close();

  res.status(200).json({
    games,
  });
}

export default getPlayerGames;