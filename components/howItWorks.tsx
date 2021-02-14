type Props = {
  movesToWin: number
  type: "road" | "flats"
  className?: string
}

export const HowItWorks: React.FunctionComponent<Props> = ({ movesToWin, type, className }) => {
  return <div className={className}>
    Check out the board state below. The name of the player you're playing for has a green bar below it.
    Now it's your turn to find the {movesToWin === 1 ? 'single move' : `${movesToWin} moves`} to win.
    That is accomplished by {type === "road" ? "building a road" : "ending the game on flats"}.
  </div>;
}