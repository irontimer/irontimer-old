import joi from "joi";

const RESULT_SCHEMA = joi
  .object({
    userID: joi.string().required(),
    time: joi.number().required(),
    timestamp: joi.date().timestamp().required(),
    scramble: joi.string().required(),
    session: joi.string().required(),
    penalty: joi.string().valid("OK", "+2", "DNF").required(),
    enteredBy: joi.string().valid("timer", "typing", "stackmat").required(),
    solution: joi.string().optional()
  })
  .required();

export default RESULT_SCHEMA;
