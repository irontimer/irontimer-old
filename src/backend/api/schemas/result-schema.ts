import joi from "joi";
import { SCRAMBLE_TYPES } from "../../../constants/scramble-type";

const RESULT_SCHEMA = joi
  .object({
    userID: joi.string().required(),
    time: joi.number().required(),
    timestamp: joi.date().timestamp().required(),
    scramble: joi.string().required(),
    scrambleType: joi
      .string()
      .valid(...SCRAMBLE_TYPES)
      .required(),
    solution: joi.string().optional()
  })
  .required();

export default RESULT_SCHEMA;
