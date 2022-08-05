import { Application, NextFunction, Response, Router } from "express";
import _ from "lodash";
import type { Request } from "utils";
import { asyncHandler } from "../../middlewares/api-utils";
import { IronTimerResponse } from "../../utils/irontimer-response";
import { recordClientVersion } from "../../utils/prometheus";
import { version } from "../../version";
import apiKeys from "./api-keys";
import configs from "./configs";
import psas from "./psas";
import sessions from "./sessions";
import solves from "./solves";
import users from "./users";

const pathOverride = process.env.API_PATH_OVERRIdE;
const BASE_ROUTE = pathOverride ? `/${pathOverride}` : "";
const APP_START_TIME = Date.now();

const API_ROUTE_MAP = {
  "/users": users,
  "/configs": configs,
  "/solves": solves,
  "/psas": psas,
  "/api-keys": apiKeys,
  "/sessions": sessions
};

function addApiRoutes(app: Application): void {
  app.use((req: Request, res: Response, next: NextFunction): void => {
    const inMaintenance =
      process.env.MAINTENANCE === "true" || req.ctx.configuration.maintenance;

    if (inMaintenance) {
      res.status(503).json({ message: "Server is down for maintenance" });
      return;
    }

    if (req.path === "/psas") {
      const clientVersion = req.headers["client-version"];
      recordClientVersion(clientVersion?.toString() ?? "unknown");
    }

    next();
  });

  app.get(
    "/",
    asyncHandler(async () => {
      return new IronTimerResponse("ok", {
        uptime: Date.now() - APP_START_TIME,
        version
      });
    })
  );

  app.get("/psa", (_req, res) => {
    res.json([
      {
        message:
          "It seems like your client version is very out of date as you're requesting an API endpoint that no longer exists. This will likely cause most of the website to not function correctly. Please clear your cache, or contact support if this message persists.",
        sticky: true
      }
    ]);
  });

  _.each(API_ROUTE_MAP, (router: Router, route) => {
    const apiRoute = `${BASE_ROUTE}${route}`;
    app.use(apiRoute, router);
  });

  app.use(
    asyncHandler(async (req) => {
      return new IronTimerResponse(
        `Unknown request URL (${req.method}: ${req.path})`,
        null,
        404
      );
    })
  );
}

export default addApiRoutes;
