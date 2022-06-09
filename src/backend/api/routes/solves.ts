import * as SolveController from "../controllers/solve";
import solveSchema from "../schemas/solve-schema";
import joi from "joi";
import {
  asyncHandler,
  validateRequest,
  validateConfiguration
} from "../../middlewares/api-utils";
import * as RateLimit from "../../middlewares/rate-limit";
import { Router } from "express";
import { authenticateRequest } from "../../middlewares/auth";
import apiRateLimit from "../../middlewares/api-rate-limit";

const router = Router();

router.get(
  "/",
  RateLimit.solvesGet,
  authenticateRequest(),
  asyncHandler(SolveController.getSolves)
);

router.post(
  "/",
  validateConfiguration({
    criteria: (configuration) => {
      return configuration.enableSavingSolves.enabled;
    },
    invalidMessage: "Solves are not being saved at this time."
  }),
  RateLimit.solvesAdd,
  authenticateRequest(),
  validateRequest({
    body: {
      solve: solveSchema
    }
  }),
  asyncHandler(SolveController.addSolve)
);

router.patch(
  "/:id",
  validateConfiguration({
    criteria: (configuration) => {
      return configuration.enableSavingSolves.enabled;
    }
  }),
  RateLimit.solvesUpdate,
  authenticateRequest(),
  validateRequest({
    params: {
      id: joi.string().required()
    },
    body: {
      solve: solveSchema
    }
  }),
  asyncHandler(SolveController.updateSolve)
);

router.delete(
  "/",
  RateLimit.solvesDeleteAll,
  authenticateRequest(),
  asyncHandler(SolveController.deleteAll)
);

router.delete(
  "/:id",
  RateLimit.solvesDelete,
  authenticateRequest(),
  validateRequest({
    params: {
      id: joi.string().required()
    }
  }),
  asyncHandler(SolveController.deleteSolve)
);

router.get(
  "/last",
  RateLimit.solvesGet,
  authenticateRequest({
    acceptApiKeys: true
  }),
  apiRateLimit,
  asyncHandler(SolveController.getLastSolve)
);

export default router;
