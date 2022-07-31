import { getCachedConfiguration } from "../init/configuration";
import { Response, NextFunction } from "express";
import { Request } from "utils";

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
      userID: "",
      email: ""
    }
  };

  next();
}

export default contextMiddleware;
