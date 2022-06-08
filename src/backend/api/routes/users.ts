import joi from "joi";
import { authenticateRequest } from "../../middlewares/auth";
import { Router } from "express";
import * as UserController from "../controllers/user";
import { asyncHandler, validateRequest } from "../../middlewares/api-utils";
import * as RateLimit from "../../middlewares/rate-limit";
import apiRateLimit from "../../middlewares/api-rate-limit";
import { isUsernameValid } from "../../utils/validation";

const router = Router();

const customThemeNameValidation = joi
  .string()
  .max(16)
  .regex(/^[0-9a-zA-Z_.-]+$/)
  .required()
  .messages({
    "string.max": "The name must not exceed 16 characters",
    "string.pattern.base":
      "Name cannot contain special characters. Can include _ . and -"
  });

const customThemeColorsValidation = joi
  .array()
  .items(
    joi
      .string()
      .length(7)
      .regex(/^#[0-9a-fA-F]{6}$/)
      .messages({
        "string.pattern.base": "The colors must be valid hexadecimal",
        "string.length": "The colors must be 7 characters long"
      })
  )
  .length(10)
  .required()
  .messages({
    "array.length": "The colors array must have 10 colors"
  });

const customThemeIDValidation = joi
  .string()
  .length(24)
  .regex(/^[0-9a-fA-F]+$/)
  .required()
  .messages({
    "string.length": "The themeID must be 24 characters long",
    "string.pattern.base": "The themeID must be valid hexadecimal string"
  });

const usernameValidation = joi
  .string()
  .required()
  .custom((value, helpers) => {
    return isUsernameValid(value)
      ? value
      : helpers.error("string.pattern.base");
  })
  .messages({
    "string.pattern.base":
      "Username invalid. Name cannot use special characters or contain more than 16 characters. Can include _ . and -"
  });

router.get(
  "/",
  RateLimit.userGet,
  authenticateRequest(),
  asyncHandler(UserController.getUser)
);

router.post(
  "/signup",
  RateLimit.userSignup,
  authenticateRequest(),
  validateRequest({
    body: {
      email: joi.string().email(),
      username: usernameValidation,
      userID: joi.string()
    }
  }),
  asyncHandler(UserController.createNewUser)
);

router.get(
  "/checkName/:name",
  RateLimit.userCheckName,
  validateRequest({
    params: {
      name: usernameValidation
    }
  }),
  asyncHandler(UserController.checkName)
);

router.delete(
  "/",
  RateLimit.userDelete,
  authenticateRequest(),
  asyncHandler(UserController.deleteUser)
);

router.patch(
  "/name",
  RateLimit.userUpdateName,
  authenticateRequest(),
  validateRequest({
    body: {
      name: usernameValidation
    }
  }),
  asyncHandler(UserController.updateName)
);

router.patch(
  "/email",
  RateLimit.userUpdateEmail,
  authenticateRequest(),
  validateRequest({
    body: {
      newEmail: joi.string().email().required(),
      previousEmail: joi.string().email().required()
    }
  }),
  asyncHandler(UserController.updateEmail)
);

router.delete(
  "/personalBests",
  RateLimit.userClearPB,
  authenticateRequest(),
  asyncHandler(UserController.clearPersonalBest)
);

router.get(
  "/customThemes",
  RateLimit.userCustomThemeGet,
  authenticateRequest(),
  asyncHandler(UserController.getCustomThemes)
);

router.post(
  "/customThemes",
  RateLimit.userCustomThemeAdd,
  authenticateRequest(),
  validateRequest({
    body: {
      name: customThemeNameValidation,
      colors: customThemeColorsValidation
    }
  }),
  asyncHandler(UserController.addCustomTheme)
);

router.delete(
  "/customThemes",
  RateLimit.userCustomThemeRemove,
  authenticateRequest(),
  validateRequest({
    body: {
      themeID: customThemeIDValidation
    }
  }),
  asyncHandler(UserController.removeCustomTheme)
);

router.patch(
  "/customThemes",
  RateLimit.userCustomThemeEdit,
  authenticateRequest(),
  validateRequest({
    body: {
      themeID: customThemeIDValidation,
      theme: {
        name: customThemeNameValidation,
        colors: customThemeColorsValidation
      }
    }
  }),
  asyncHandler(UserController.editCustomTheme)
);

router.post(
  "/discord/link",
  RateLimit.userDiscordLink,
  authenticateRequest(),
  validateRequest({
    body: {
      data: joi.object({
        tokenType: joi.string().required(),
        accessToken: joi.string().required(),
        userID: joi.string()
      })
    }
  }),
  asyncHandler(UserController.linkDiscord)
);

router.post(
  "/discord/unlink",
  RateLimit.userDiscordUnlink,
  authenticateRequest(),
  asyncHandler(UserController.unlinkDiscord)
);

router.get(
  "/personalBests",
  RateLimit.userGet,
  authenticateRequest({
    acceptApiKeys: true
  }),
  apiRateLimit,
  validateRequest({
    query: {
      mode: joi.string().required(),
      mode2: joi.string()
    }
  }),
  asyncHandler(UserController.getPersonalBests)
);

router.get(
  "/stats",
  RateLimit.userGet,
  authenticateRequest({
    acceptApiKeys: true
  }),
  apiRateLimit,
  asyncHandler(UserController.getStats)
);

export default router;
