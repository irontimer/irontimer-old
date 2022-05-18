export type Face =
  | "Up"
  | "Down"
  | "Left"
  | "Right"
  | "Front"
  | "Back"
  | "UpWide"
  | "DownWide"
  | "LeftWide"
  | "RightWide"
  | "FrontWide"
  | "BackWide";
export const FACES: Face[] = [
  "Up",
  "Down",
  "Left",
  "Right",
  "Front",
  "Back",
  "UpWide",
  "DownWide",
  "LeftWide",
  "RightWide",
  "FrontWide",
  "BackWide"
];

export type Direction = "Clockwise" | "CounterClockwise";
export const DIRECTIONS: Direction[] = ["Clockwise", "CounterClockwise"];

export class Move {
  public face: Face;
  public count: number;
  public direction: Direction;

  constructor(face: Face, count: number, direction: Direction) {
    this.face = face;
    this.count = count % 2 !== 0 ? 1 : 2;
    this.direction = this.count === 2 ? "Clockwise" : direction;
  }

  toString(): string {
    let face = this.face.substring(0, 1);

    if (this.face.endsWith("Wide")) {
      face = face.toLowerCase();
    }

    const count = this.count % 2 === 0 ? "2" : "";

    const direction = this.direction === "CounterClockwise" ? "'" : "";

    return `${face}${count}${direction}`;
  }
}
