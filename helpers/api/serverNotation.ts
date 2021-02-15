import { sum } from "../arrayHelpers";

enum MoveType {
  Place = 'P',
  Move = 'M',
}

enum StoneType {
  Standing = 'W',
  Capstone = 'C',
}

enum Direction {
  Up = '+',
  Down = '-',
  Left = '<',
  Right = '>',
}

const ptnFromServerMove = (move: string): string => {
  const [type, ...rest] = move.split(' ');
  switch (type as MoveType) {
    case MoveType.Move:
      const [startPos, endPos, ...drops] = rest;
      const dropString = drops.join('');
      const carry = sum(drops.map(d => parseInt(d)));
      let direction: Direction;
      if (startPos[0] === endPos[0]) { // Vertical
        direction = startPos[1] < endPos[1] ? Direction.Up : Direction.Down;
      } else { // Horizontal
        direction = startPos[0] < endPos[0] ? Direction.Right : Direction.Left;
      }
      return `${carry}${startPos.toLowerCase()}${direction}${dropString}`
    case MoveType.Place:
      const [position, stoneType] = rest;
      switch (stoneType as StoneType) {
        case undefined:
          return position.toLowerCase();
        case StoneType.Capstone:
          return `C${position.toLowerCase()}`
        case StoneType.Standing:
          return `S${position.toLowerCase()}`
      }
  }
}

export const ptnMovesFromServerNotation = (serverNotation: string): string[] => {
  const moves = serverNotation.split(',');
  return moves.map(ptnFromServerMove);
}

export const ptnFromServerNotation = (serverNotation: string): string => {
  return ptnMovesFromServerNotation(serverNotation).join(' ');
}
