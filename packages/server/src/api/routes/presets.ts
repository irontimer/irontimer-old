import { Router } from "express";
import joi from "joi";
import { asyncHandler, validateRequest } from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import * as RateLimit from "../../middlewares/rate-limit";
import * as PresetController from "../controllers/preset";
import configSchema from "../schemas/config-schema";

const router = Router();

const presetNameSchema = joi
  .string()
  .required()
  .regex(/^[0-9a-zA-Z_.-]+$/)
  .max(16)
  .messages({
    "string.pattern.base": "Invalid preset name",
    "string.max": "Preset name exceeds maximum of 16 characters"
  });

router.get(
  "/",
  RateLimit.presetsGet,
  authenticateRequest(),
  asyncHandler(PresetController.getPresets)
);

router.post(
  "/",
  RateLimit.presetsAdd,
  authenticateRequest(),
  validateRequest({
    body: {
      name: presetNameSchema,
      config: configSchema
    }
  }),
  asyncHandler(PresetController.addPreset)
);

router.patch(
  "/",
  RateLimit.presetsEdit,
  authenticateRequest(),
  validateRequest({
    body: {
      _id: joi.string().required(),
      name: presetNameSchema,
      config: configSchema.allow(null)
    }
  }),
  asyncHandler(PresetController.editPreset)
);

router.delete(
  "/:presetID",
  RateLimit.presetsRemove,
  authenticateRequest(),
  validateRequest({
    params: {
      presetID: joi.string().required()
    }
  }),
  asyncHandler(PresetController.removePreset)
);

export default router;
