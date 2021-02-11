export type GameResult = "0-0" | "R-0" | "0-R" | "F-0" | "0-F" | "1-0" | "0-1"

export default interface IGame {
  "id": number
  "date": number
  "size": number
  "player_white": string
  "player_black": string
  "notation": string
  "result": GameResult
  "timertime": number
  "timerinc": number
  "rating_white": number
  "rating_black": number
  "unrated": boolean
  "tournament": boolean
  "komi": number
  "pieces": number
  "capstones": number
  "rating_change_white": number
  "rating_change_black": number
}
