import cors from "cors";
import express, { json, urlencoded } from "express";
import helmet from "helmet";
import addApiRoutes from "./api/routes";
import contextMiddleware from "./middlewares/context";
import errorHandlingMiddleware from "./middlewares/error";

function buildApp(): express.Application {
  const app = express();

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cors());
  app.use(helmet());

  app.set("trust proxy", 1);

  app.use(contextMiddleware);

  addApiRoutes(app);

  app.use(errorHandlingMiddleware);

  return app;
}

export default buildApp();
