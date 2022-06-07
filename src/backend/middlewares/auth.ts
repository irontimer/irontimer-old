import { compare } from "bcrypt";
import { getApiKey, updateLastUsedOn } from "../dal/api-keys";
import IronTimerError from "../utils/error";
import { verifyIdToken } from "../utils/auth";
import { base64UrlDecode } from "../utils/misc";
import { NextFunction, Response, Handler } from "express";
import statuses from "../constants/irontimer-status-codes";
import { incrementAuth } from "../utils/prometheus";
import Logger from "../utils/logger";
import { Configuration, DecodedToken, Request } from "../../types";

interface RequestAuthenticationOptions {
  isPublic?: boolean;
  acceptApiKeys?: boolean;
}

const DEFAULT_OPTIONS: RequestAuthenticationOptions = {
  isPublic: false,
  acceptApiKeys: false
};

function authenticateRequest(authOptions = DEFAULT_OPTIONS): Handler {
  const options = {
    ...DEFAULT_OPTIONS,
    ...authOptions
  };

  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { authorization: authHeader } = req.headers;
      let token: DecodedToken;

      if (authHeader) {
        token = await authenticateWithAuthHeader(
          authHeader,
          req.ctx.configuration,
          options
        );
      } else if (options.isPublic) {
        token = {
          type: "None",
          userID: "",
          email: ""
        };
      } else if (process.env.MODE === "dev") {
        token = authenticateWithBody(req.body);
      } else {
        throw new IronTimerError(
          401,
          "Unauthorized",
          `endpoint: ${req.baseUrl} no authorization header found`
        );
      }

      incrementAuth(token.type);

      req.ctx = {
        ...req.ctx,
        decodedToken: token
      };
    } catch (error) {
      return next(error);
    }

    next();
  };
}

function authenticateWithBody(body: Request["body"]): DecodedToken {
  const { userID, email } = body;

  if (!userID) {
    throw new IronTimerError(
      401,
      "Running authorization in dev mode but still no userID was provided"
    );
  }

  return {
    type: "Bearer",
    userID,
    email: email ?? ""
  };
}

async function authenticateWithAuthHeader(
  authHeader: string,
  configuration: Configuration,
  options: RequestAuthenticationOptions
): Promise<DecodedToken> {
  const token = authHeader.split(" ");

  const authScheme = token[0].trim();
  const credentials = token[1];

  switch (authScheme) {
    case "Bearer":
      return await authenticateWithBearerToken(credentials);

    case "ApiKey":
      return await authenticateWithApiKey(credentials, configuration, options);
  }

  throw new IronTimerError(
    401,
    "Unknown authentication scheme",
    `The authentication scheme "${authScheme}" is not implemented`
  );
}

async function authenticateWithBearerToken(
  token: string
): Promise<DecodedToken> {
  try {
    const decodedToken = await verifyIdToken(token);

    return {
      type: "Bearer",
      userID: decodedToken.uid,
      email: decodedToken.email ?? ""
    };
  } catch (error: any) {
    Logger.error(`Firebase auth error code ${error.errorInfo.code.toString()}`);

    if (error?.errorInfo?.code?.includes("auth/id-token-expired")) {
      throw new IronTimerError(
        401,
        "Token expired. Please login again.",
        "authenticateWithBearerToken"
      );
    } else if (error?.errorInfo?.code?.includes("auth/id-token-revoked")) {
      throw new IronTimerError(
        401,
        "Token revoked. Please login again.",
        "authenticateWithBearerToken"
      );
    } else {
      throw error;
    }
  }
}

async function authenticateWithApiKey(
  key: string,
  configuration: Configuration,
  options: RequestAuthenticationOptions
): Promise<DecodedToken> {
  if (!configuration.apiKeys.acceptKeys) {
    throw new IronTimerError(
      403,
      "ApiKeys are not being accepted at this time"
    );
  }

  if (!options.acceptApiKeys) {
    throw new IronTimerError(401, "This endpoint does not accept ApiKeys");
  }

  try {
    const decodedKey = base64UrlDecode(key);
    const [keyId, apiKey] = decodedKey.split(".");

    const targetApiKey = await getApiKey(keyId);
    if (!targetApiKey) {
      throw new IronTimerError(404, "ApiKey not found");
    }

    if (!targetApiKey.enabled) {
      const { code, message } = statuses.API_KEY_INACTIVE;
      throw new IronTimerError(code, message);
    }

    const isKeyValid = await compare(apiKey, targetApiKey.hash);
    if (!isKeyValid) {
      const { code, message } = statuses.API_KEY_INVALID;
      throw new IronTimerError(code, message);
    }

    await updateLastUsedOn(targetApiKey.userID, keyId);

    return {
      type: "ApiKey",
      userID: targetApiKey.userID,
      email: ""
    };
  } catch (error) {
    if (!(error instanceof IronTimerError)) {
      const { code, message } = statuses.API_KEY_MALFORMED;
      throw new IronTimerError(code, message);
    }

    throw error;
  }
}

export { authenticateRequest };
