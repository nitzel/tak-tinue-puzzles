// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// better-sqlite3 on worker threats for slow queries: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/threads.md

import { NextApiRequest, NextApiResponse } from "next";
import { getLatestDatabase, loadLatestDatabase } from "../../../../helpers/api/db";
import { ptnMovesFromServerNotation } from "../../../../helpers/api/serverNotation";
import IGame, { GameResult } from "../../../../helpers/interfaces/db/games";
import { compressToEncodedURIComponent } from "lz-string";

export type Result = {
  puzzleNotation: string
  puzzleUrl: string
};

const firstValidGameDate = 1461430858755;

const ptnTimeString = (game: IGame) => {
  const minutes = Math.floor(game.timertime / 60);
  const seconds = game.timertime % 60;
  const incrementSeconds = game.timerinc;
  return `${minutes}:${seconds} +${incrementSeconds}`;
}

const createPtn = (game: IGame, moves: string[]) => {
  const config = {
    Player1: game.player_white,
    Player2: game.player_black,
    Size: game.size,
    Komi: game.komi,
    Rating1: game.rating_white,
    Rating2: game.rating_black,
    Clock: ptnTimeString(game),
    Event: "Online Play",
    Site: "PlayTak.com",
    Result: game.result,
  }

  const configString = Object.entries(config).map(([key, value]) => `[${key} "${value}"]`).join('');
  return configString + " " + moves.join(' ');
}

export default async (req: NextApiRequest, res: NextApiResponse<Result>) => {

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

  const { boardSize } = req.query;
  console.log(`GET puzzle random boardsize='${boardSize}'`);

  const games = db.prepare("SELECT * FROM games WHERE (result = ? OR result = ?) and size = ? and date > ? ORDER BY RANDOM() LIMIT 1")
    .all(GameResult.WhiteRoadWin, GameResult.BlackRoadWin, boardSize, firstValidGameDate) as IGame[];

  db.close();

  const game = games[0];
  if (!game) throw new Error(`No game of size '${boardSize}' found`);
  const randomGameMoves = ptnMovesFromServerNotation(games[0].notation);
  const randomPuzzleMoves = randomGameMoves.slice(0, randomGameMoves.length - 1); // remove final move
  const ptnString = createPtn(game, randomPuzzleMoves);
  console.log(game);
  console.log(game.notation);
  console.log(ptnString);
  const ptnNinjaLink = `https://ptn.ninja/${compressToEncodedURIComponent(ptnString)}&ply=${randomPuzzleMoves.length - 1}!`;
  console.log(ptnNinjaLink);

  res.status(200).json({
    puzzleNotation: ptnString,
    puzzleUrl: ptnNinjaLink,
  });
}
