import React from "react";
import styles from "../styles/howItWorks.module.css";

type Props = {
  solution?: string[]
  className?: string
}

type State = {
  collapsed: boolean
}

class PuzzleSolutionComponent extends React.PureComponent<Props, State> {

  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      collapsed: true
    }
  }

  public componentDidUpdate(prevProps: Props, _prevState: State) {
    if (prevProps.solution && prevProps.solution != this.props.solution) {
      this.setState({ collapsed: true });
    }
  }

  private toggle = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  }

  public render = () => {
    const { className, solution } = this.props;
    const { collapsed } = this.state;
    const symbol = collapsed ? '+' : '-'
    return (
      <div className={className}>
        <div className={styles.center}>
          <span className={styles.trigger} onClick={this.toggle}>{symbol}Solution{symbol}</span>
        </div>
        <div className={collapsed ? styles.collapsed : styles.expanded}>
          {
            solution?.length
              ? solution.map(move => <span className={styles.move}>{move}</span>)
              : "No solution available"
          }
        </div>
      </div>
    );
  }
}

export default PuzzleSolutionComponent;