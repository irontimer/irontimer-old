import * as ResultController from "../controllers/result";
import resultSchema from "../schemas/result-schema";
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
  RateLimit.resultsGet,
  authenticateRequest(),
  asyncHandler(ResultController.getResults)
);

router.post(
  "/",
  validateConfiguration({
    criteria: (configuration) => {
      return configuration.enableSavingResults.enabled;
    },
    invalidMessage: "Results are not being saved at this time."
  }),
  RateLimit.resultsAdd,
  authenticateRequest(),
  validateRequest({
    body: {
      result: resultSchema
    }
  }),
  asyncHandler(ResultController.addResult)
);

router.delete(
  "/",
  RateLimit.resultsDeleteAll,
  authenticateRequest(),
  asyncHandler(ResultController.deleteAll)
);

router.delete(
  "/:id",
  RateLimit.resultsDelete,
  authenticateRequest(),
  validateRequest({
    params: {
      id: joi.string().required()
    }
  }),
  asyncHandler(ResultController.deleteResult)
);

router.get(
  "/last",
  RateLimit.resultsGet,
  authenticateRequest({
    acceptApiKeys: true
  }),
  apiRateLimit,
  asyncHandler(ResultController.getLastResult)
);

export default router;
