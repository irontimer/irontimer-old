import { v4 as uuidv4 } from "uuid";

class IronTimerError extends Error {
  status: number;
  errorId: string;
  userID?: string;

  constructor(
    status: number,
    message: string,
    stack?: string,
    userID?: string
  ) {
    super();

    this.status = status ?? 500;
    this.errorId = uuidv4();
    this.stack = stack;
    this.userID = userID;

    if (process.env.MODE === "dev") {
      this.message = stack
        ? String(message) + "\nStack: " + String(stack)
        : String(message);
    } else {
      if (this.stack && this.status >= 500) {
        this.stack = this.message + "\n" + this.stack;
        this.message = "Internal Server Error " + this.errorId;
      } else {
        this.message = String(message);
      }
    }
  }
}

export default IronTimerError;
