export type PuzzleType =
  | "Cube"
  | "Megaminx"
  | "Pyraminx"
  | "Skewb"
  | "Square-1";

export class Puzzle {
  type: PuzzleType;
  size: number;
  constructor(options: { type: PuzzleType; size: number });
  constructor(type: PuzzleType, size: number);
  constructor(
    optionsOrType: { type: PuzzleType; size: number } | PuzzleType,
    size?: number
  ) {
    if (typeof optionsOrType === "object") {
      this.type = optionsOrType.type;
      this.size = optionsOrType.size;
    } else if (size !== undefined) {
      this.type = optionsOrType;
      this.size = size;
    } else {
      throw Error("Invalid arguments");
    }
  }

  toString(): string {
    if (this.type === "Cube") {
      return `${this.size}x${this.size}x${this.size}`;
    }

    return "String representation not implemented";
  }
}
