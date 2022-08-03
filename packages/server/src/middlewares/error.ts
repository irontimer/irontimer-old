import { NextFunction, Response } from "express";
import { Request } from "utils";
import { v4 as uuidv4 } from "uuid";
import { Error } from "../models/error";
import IronTimerError from "../utils/error";
import {
  handleIronTimerResponse,
  IronTimerResponse
} from "../utils/irontimer-response";
import Logger from "../utils/logger";

async function errorHandlingMiddleware(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const ironTimerError = error as IronTimerError;

  const ironTimerResponse = new IronTimerResponse();
  ironTimerResponse.status = 500;
  ironTimerResponse.data = {
    errorID: ironTimerError.errorID ?? uuidv4(),
    userID: ironTimerError.userID ?? req.ctx?.decodedToken?.userID
  };

  if (/ECONNREFUSED.*27017/i.test(error.message)) {
    ironTimerResponse.message =
      "Could not connect to the database. It may be down.";
  } else if (error instanceof URIError || error instanceof SyntaxError) {
    ironTimerResponse.status = 400;
    ironTimerResponse.message = "Unprocessable request";
  } else if (error instanceof IronTimerError) {
    ironTimerResponse.message = error.message;
    ironTimerResponse.status = error.status;
  } else {
    ironTimerResponse.message = `Oops! Please try again later. - ${ironTimerResponse.data.errorID}`;
  }

  if (process.env.MODE !== "dev" && ironTimerResponse.status >= 500) {
    const { userID, errorID } = ironTimerResponse.data;

    try {
      await Logger.logToDb(
        "system_error",
        `${ironTimerResponse.status} ${error.message} ${error.stack}`,
        userID
      );
      await Error.create({
        _id: errorID,
        timestamp: Date.now(),
        status: ironTimerResponse.status,
        userID,
        message: error.message,
        stack: error.stack,
        endpoint: req.originalUrl
      });
    } catch (e: any) {
      Logger.error("Logging to db failed.");
      Logger.error(e);
    }
  } else {
    Logger.error(`Error: ${error.message} Stack: ${error.stack}`);
  }

  return handleIronTimerResponse(ironTimerResponse, res);
}

export default errorHandlingMiddleware;
