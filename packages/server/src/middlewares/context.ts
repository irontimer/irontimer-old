import { NextFunction, Response } from "express";
import { Request } from "utils";
import { getCachedConfiguration } from "../init/configuration";

async function contextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const configuration = await getCachedConfiguration(true);

  req.ctx = {
    configuration,
    decodedToken: {
      type: "None",
      uid: "",
      email: ""
    }
  };

  next();
}

export default contextMiddleware;
