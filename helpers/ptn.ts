import { ptnMovesFromServerNotation } from "./api/serverNotation";
import { IGame } from "./interfaces/db/games";

export const ptnTimeString = (game: IGame) => {
  const minutes = Math.floor(game.timertime / 60);
  const seconds = game.timertime % 60;
  const incrementSeconds = game.timerinc;
  return `${minutes}:${seconds} +${incrementSeconds}`;
}

export const createPtn = (game: IGame, removeNlastMoves = 0) => {
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

  const moves = ptnMovesFromServerNotation(game.notation);
  const usedMoves = moves.slice(0, moves.length - removeNlastMoves);
  const finalMoves = moves.slice(moves.length - removeNlastMoves);

  const configString = Object.entries(config).map(([key, value]) => `[${key} "${value}"]`).join('');
  return {
    ptn: configString + " " + usedMoves.join(' '),
    moveCount: usedMoves.length,
    finalMoves
  }
}