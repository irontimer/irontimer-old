import { NextFunction, Response } from "express";
import { Request } from "utils";
import { v4 as uuidv4 } from "uuid";
import prisma from "../init/db";
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
    errorId: ironTimerError.errorId ?? uuidv4(),
    uid: ironTimerError.uid ?? req.ctx?.decodedToken?.uid
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
    ironTimerResponse.message = `Oops! Please try again later. - ${ironTimerResponse.data.errorId}`;
  }

  if (process.env.MODE !== "dev" && ironTimerResponse.status >= 500) {
    const { uid, errorId } = ironTimerResponse.data;

    try {
      await Logger.logToDb(
        "system_error",
        `${ironTimerResponse.status} ${error.message} ${error.stack}`,
        uid
      );
      await prisma.error.create({
        data: {
          id: errorId,
          status: ironTimerResponse.status,
          uid,
          message: error.message,
          stack: error.stack,
          endpoint: req.originalUrl
        }
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
