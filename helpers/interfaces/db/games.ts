export enum GameResult {
  Unknown = "0-0",
  WhiteRoadWin = "R-0",
  WhiteFlatWin = "F-0",
  WhiteWin = "1-0",
  BlackRoadWin = "0-R",
  BlackFlatWin = "0-F",
  BlackWin = "0-1",
}

type ServerNotation = string
export interface IGame {
  id: number
  date: number
  size: number
  player_white: string
  player_black: string
  notation: ServerNotation
  result: GameResult
  timertime: number
  timerinc: number
  rating_white: number
  rating_black: number
  unrated: boolean
  tournament: boolean
  komi: number
  pieces: number
  capstones: number
  rating_change_white: number
  rating_change_black: number
}

export interface ITinueRow {
  id: number,
  /** Foreign Key to IGame */
  gameid: number,
  size: number,
  plies_to_undo: number,
  tinue_depth: number,
  /** Actually JSON representation of `string[]` where each string is a move */
  tinue: string
}

/**
 * Join of tables `games` and `tinues`
 */
export type ITinueGameRow = IGame & ITinueRow;
