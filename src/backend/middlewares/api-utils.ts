import _ from "lodash";
import joi from "joi";
import IronTimerError from "../utils/error";
import { Response, NextFunction, RequestHandler } from "express";
import { Configuration, Request, User } from "../../types/types";
import {
  handleIronTimerResponse,
  IronTimerResponse
} from "../utils/irontimer-response";
import { getUser } from "../dal/user";

interface ValidationOptions<T> {
  criteria: (data: T) => boolean;
  invalidMessage?: string;
}

/**
 * This utility checks that the server's configuration matches
 * the criteria.
 */
function validateConfiguration(
  options: ValidationOptions<Configuration>
): RequestHandler {
  const {
    criteria,
    invalidMessage = "This service is currently unavailable."
  } = options;

  return (req: Request, _res: Response, next: NextFunction) => {
    const configuration = req.ctx.configuration;

    const validated = criteria(configuration);
    if (!validated) {
      throw new IronTimerError(503, invalidMessage);
    }

    next();
  };
}

/**
 * Check user permissions before handling request.
 * Note that this middleware must be used after authentication in the middleware stack.
 */
function checkUserPermissions(
  options: ValidationOptions<User>
): RequestHandler {
  const { criteria, invalidMessage = "You don't have permission to do this." } =
    options;

  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { userID } = req.ctx.decodedToken;

      const userData = await getUser(userID, "check user permissions");
      const hasPermission = criteria(userData);

      if (!hasPermission) {
        throw new IronTimerError(403, invalidMessage);
      }
    } catch (error) {
      next(error);
    }

    next();
  };
}

type AsyncHandler = (
  req: Request,
  res?: Response
) => Promise<IronTimerResponse>;

/**
 * This utility serves as an alternative to wrapping express handlers with try/catch statements.
 * Any routes that use an async handler function should wrap the handler with this function.
 * Without this, any errors thrown will not be caught by the error handling middleware, and
 * the app will hang!
 */
function asyncHandler(handler: AsyncHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const handlerData = await handler(req, res);
      return handleIronTimerResponse(handlerData, res);
    } catch (error) {
      next(error);
    }
  };
}

interface ValidationSchema {
  body?: object;
  query?: object;
  params?: object;
  validationErrorMessage?: string;
}

function validateRequest(validationSchema: ValidationSchema): RequestHandler {
  /**
   * In dev environments, as an alternative to token authentication,
   * you can pass the authentication middleware by having a user id in the body.
   * Inject the user id into the schema so that validation will not fail.
   */
  if (process.env.MODE === "dev") {
    validationSchema.body = {
      userID: joi.any(),
      ...(validationSchema.body ?? {})
    };
  }

  const { validationErrorMessage } = validationSchema;
  const normalizedValidationSchema: ValidationSchema = _.omit(
    validationSchema,
    "validationErrorMessage"
  );

  return (req: Request, _res: Response, next: NextFunction) => {
    _.each(normalizedValidationSchema, (schema, key) => {
      const joiSchema = joi.object().keys(schema as object);

      const { error } = joiSchema.validate(req[key as keyof Request] ?? {});
      if (error) {
        const errorMessage = error.details[0].message;
        throw new IronTimerError(
          422,
          validationErrorMessage ??
            `${errorMessage} (${error.details[0]?.context?.value})`
        );
      }
    });

    next();
  };
}

export {
  validateConfiguration,
  checkUserPermissions,
  asyncHandler,
  validateRequest
};
