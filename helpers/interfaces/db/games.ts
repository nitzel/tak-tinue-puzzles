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
