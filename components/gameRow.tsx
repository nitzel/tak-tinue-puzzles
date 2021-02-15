import { IGame } from "../helpers/interfaces/db/games";

type Props = {
  game: IGame;
}

const GameRow: React.FunctionComponent<Props> = ({ game }) => {
  return <tr>
    <td>
      {game.player_white}
    </td>
    <td>
      {game.result}
    </td>
    <td>
      {game.player_black}
    </td>
  </tr>
}


export default GameRow;