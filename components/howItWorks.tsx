import React from "react";
import styles from "../styles/howItWorks.module.css";

type Props = {
  movesToWin: number
  type: "road" | "flats"
  className?: string
}

type State = {
  collapsed: boolean
}

class HowItWorks extends React.PureComponent<Props, State> {

  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      collapsed: true
    }
  }

  private toggle = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  }

  public render = () => {
    const { className, movesToWin, type } = this.props;
    const { collapsed } = this.state;
    const symbol = collapsed ? '+' : '-'
    return (
      <div className={className}>
        <div className={styles.center}>
          <span className={styles.trigger} onClick={this.toggle}>{symbol} How it works {symbol}</span>
        </div>
        <div className={collapsed ? styles.collapsed : styles.expanded}>
          Check out the board state below.
          The name of the player you&apos;re playing for has a green bar below it.
          A {type} win is {movesToWin} {movesToWin === 1 ? 'ply' : 'plies'} away.
          It is up to you to find a a forcing win.
          <p />
          To reset the board position refresh the page.
          <p />
          If you struggle, you can view one of the probably many solutions to the puzzle at the bottom of the page.
          <p />
          When you want to move on to the next puzzle, hit the button below.
        </div>
      </div >
    );
  }
}

export default HowItWorks;