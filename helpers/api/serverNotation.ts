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

// console.log(ptnFromServerNotation("P A1,P E1,P A2,P B2,P B1 C,P C2,P C1,P D1,P D2,P A3,P C3,P A4,P D3,P A5,M B1 B2 1,P B1,P B3,M A1 A2 1,M B2 A2 2,P B2 C,M A2 A4 1 3,M B2 B3 1,P C4,M D1 D2 1,P B4,P E3,P D4,P E4,M D3 D2 1,M C2 D2 1,P E5,M D2 D4 2 2,P C5,P C2,P D5"));