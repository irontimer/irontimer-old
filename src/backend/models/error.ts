import { Schema, model } from "mongoose";

interface IError {
  _id: string;
  timestamp: number;
  status: number;
  userID: string;
  message: string;
  stack?: string;
  endpoint: string;
}

const ErrorSchema = new Schema<IError>({
  _id: String,
  timestamp: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  stack: {
    type: String,
    required: false
  },
  endpoint: {
    type: String,
    required: true
  }
});

export const Error = model<IError>("error", ErrorSchema);
