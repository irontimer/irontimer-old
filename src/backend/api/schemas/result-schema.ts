import joi from "joi";

const RESULT_SCHEMA = joi
  .object({
    userID: joi.string().required(),
    time: joi.number().required(),
    timestamp: joi.date().timestamp().required(),
    scramble: joi.string().required(),
    scrambleType: joi.string().valid("3x3x3", "2x2x2").required(), // figure out a way to use SCRAMBLE_TYPES without it building weirdly
    solution: joi.string().optional()
  })
  .required();

export default RESULT_SCHEMA;
