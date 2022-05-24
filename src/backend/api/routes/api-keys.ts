import joi from "joi";
import { Router } from "express";
import {
  asyncHandler,
  checkUserPermissions,
  validateConfiguration,
  validateRequest
} from "../../middlewares/api-utils";
import { authenticateRequest } from "../../middlewares/auth";
import * as ApiKeyController from "../controllers/api-key";
import * as RateLimit from "../../middlewares/rate-limit";

const apiKeyNameSchema = joi
  .string()
  .regex(/^[0-9a-zA-Z_.-]+$/)
  .max(20)
  .messages({
    "string.pattern.base": "Invalid ApiKey name",
    "string.max": "ApiKey name exceeds maximum of 20 characters"
  });

const checkIfUserCanManageApiKeys = checkUserPermissions({
  criteria: (user) => {
    // Must be an exact check
    return user.canManageApiKeys !== false;
  },
  invalidMessage: "You have lost access to api keys, please contact support"
});

const router = Router();

router.use(
  validateConfiguration({
    criteria: (configuration) => {
      return configuration.apiKeys.endpointsEnabled;
    },
    invalidMessage: "ApiKeys are currently disabled."
  })
);

router.get(
  "/",
  RateLimit.apiKeysGet,
  authenticateRequest(),
  checkIfUserCanManageApiKeys,
  asyncHandler(ApiKeyController.getApiKeys)
);

router.post(
  "/",
  RateLimit.apiKeysGenerate,
  authenticateRequest(),
  checkIfUserCanManageApiKeys,
  validateRequest({
    body: {
      name: apiKeyNameSchema.required(),
      enabled: joi.boolean().required()
    }
  }),
  asyncHandler(ApiKeyController.generateApiKey)
);

router.patch(
  "/:apiKeyId",
  RateLimit.apiKeysUpdate,
  authenticateRequest(),
  checkIfUserCanManageApiKeys,
  validateRequest({
    params: {
      apiKeyId: joi.string().required()
    },
    body: {
      name: apiKeyNameSchema,
      enabled: joi.boolean()
    }
  }),
  asyncHandler(ApiKeyController.editApiKey)
);

router.delete(
  "/:apiKeyId",
  RateLimit.apiKeysDelete,
  authenticateRequest(),
  checkIfUserCanManageApiKeys,
  validateRequest({
    params: {
      apiKeyId: joi.string().required()
    }
  }),
  asyncHandler(ApiKeyController.deleteApiKey)
);

export default router;
