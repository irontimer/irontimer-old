import { Router } from "express";
import { asyncHandler, validateRequest } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import * as RateLimit from "../../middlewares/rate-limit";
import * as ConfigController from "../controllers/config";
import configSchema from "../schemas/config-schema";

const router = Router();

router.get(
  "/",
  RateLimit.configGet,
  authenticateRequest(),
  asyncHandler(ConfigController.getConfig)
);

router.patch(
  "/",
  RateLimit.configUpdate,
  authenticateRequest(),
  validateRequest({
    body: {
      config: configSchema.required()
    }
  }),
  asyncHandler(ConfigController.saveConfig)
);

export default router;
