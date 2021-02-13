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
  puzzleId: number
  puzzleSize: number
  /** Number of puzzles available on this size */
  puzzleCount: number
};

const playtakStyle = {
  "id": "play-tak",
  "boardStyle": "grid2",
  "boardChecker": false,
  "vars": {
    "piece-border-width": 1
  },
  "colors":
  {
    "primary": "#80d184", // "#8bc34a"
    "secondary": "#607d8b",
    "ui": "#263238",
    "accent": "#202a2f",
    "panel": "#78909cc0",
    "board1": "#e0d5a9ff",
    "board2": "#b78d63ff",
    "board3": "#78909c",
    "player1": "#d6b77cff",
    "player1road": "#d6b77c",
    "player1flat": "#cbae76",
    "player1special": "#dabe89",
    "player1border": "#725130",
    "player2": "#59320bff",
    "player2road": "#725130",
    "player2flat": "#725130",
    "player2special": "#6a4723",
    "player2border": "#cbae76",
    "textLight": "#fafafacd",
    "textDark": "#212121cd",
    "umbra": "#00000033",
    "bg": "#607d8bff",
    "player1clear": "#d6b77c00",
    "player2clear": "#59320b00"
  },
  "primaryDark": false,
  "secondaryDark": true,
  "isDark": true,
  "accentDark": true,
  "panelDark": true,
  "player1Dark": false,
  "player2Dark": true,
  "name": "PlayTak"
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

  const boardSize = parseInt(req.query.boardSize as string, 10);
  const puzzleId = parseInt(req.query.puzzleId as string, 10);
  console.log(`GET puzzle random boardsize='${boardSize}'`);

  const games = db.prepare("SELECT * FROM games WHERE (result = ? OR result = ?) and size = ? and date > ? ORDER BY id LIMIT 1 OFFSET ?")
    .all(GameResult.WhiteRoadWin, GameResult.BlackRoadWin, boardSize, firstValidGameDate, puzzleId) as IGame[];
  db.close();

  const actualPuzzleId = puzzleId; //(puzzleId as unknown as number) % games.length;
  const game = games[0]; // games[actualPuzzleId];
  // const game = games[0];
  if (!game) throw new Error(`No game of size '${boardSize}' found`);
  const randomGameMoves = ptnMovesFromServerNotation(games[0].notation);
  const randomPuzzleMoves = randomGameMoves.slice(0, randomGameMoves.length - 1); // remove final move
  const ptnString = createPtn(game, randomPuzzleMoves);
  console.log(game);
  console.log(game.notation);
  console.log(ptnString);
  const ptnNinjaUrl = new URL(compressToEncodedURIComponent(ptnString), `https://ptn.ninja`);

  const searchParams = {
    ply: `${randomPuzzleMoves.length - 1}`,
    flatCounts: false,
    highlightSquares: false,
    showRoads: false,
    showScrubber: false,
    theme: compressToEncodedURIComponent(JSON.stringify(playtakStyle)) // playtakStyleString,
  }
  Object.entries(searchParams).forEach(([key, value]) => ptnNinjaUrl.searchParams.set(key, value.toString()));
  const ptnNinjaHref = ptnNinjaUrl.href.replace('?', '&'); // weird ptn.ninja URL format issue
  console.log(ptnNinjaHref);

  const style = {
    white: "#d6b77cff",
    black: "#59320bff",
    board: "#e0d5a9ff",
    border: "#b78d63ff",
    background: "#ddddddff",
  }

  res.status(200).json({
    puzzleNotation: ptnString,
    puzzleUrl: ptnNinjaHref,
    puzzleCount: games.length,
    puzzleId: actualPuzzleId,
    puzzleSize: boardSize,
  });
}
