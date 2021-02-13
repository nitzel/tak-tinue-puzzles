export enum GameResult {
  Unknown = "0-0",
  BlackRoadWin = "R-0",
  WhiteRoadWin = "0-R",
  BlackFlatWin = "F-0",
  WhiteFlatWin = "0-F",
  WhiteWin = "1-0",
  BlackWin = "0-1",
}

type ServerNotation = string
export default interface IGame {
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
