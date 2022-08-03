import { Router } from "express";
import joi from "joi";
import { asyncHandler, validateRequest } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import * as RateLimit from "../../middlewares/rate-limit";
import * as SessionController from "../controllers/session";

const router = Router();

const sessionNameSchema = joi
  .string()
  .regex(/^[0-9a-zA-Z_.-]+$/)
  .max(20)
  .messages({
    "string.pattern.base": "Invalid session name",
    "string.max": "Session name exceeds maximum of 20 characters"
  });

router.get(
  "/",
  RateLimit.sessionsGet,
  authenticateRequest(),
  validateRequest({
    body: {
      name: sessionNameSchema
    }
  }),
  asyncHandler(SessionController.getSessions)
);

router.post(
  "/",
  RateLimit.sessionsAdd,
  authenticateRequest(),
  asyncHandler(SessionController.addSession)
);

router.delete(
  "/",
  RateLimit.sessionsDeleteAll,
  authenticateRequest(),
  asyncHandler(SessionController.deleteAll)
);

router.delete(
  "/:_id",
  RateLimit.sessionsDelete,
  authenticateRequest(),
  validateRequest({
    params: {
      _id: joi.string().required()
    }
  }),
  asyncHandler(SessionController.deleteSession)
);

export default router;
