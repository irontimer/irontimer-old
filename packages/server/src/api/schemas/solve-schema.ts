import { Penalty, TimerType } from "@prisma/client";
import joi from "joi";
import { Solve } from "utils";

const penalties = Object.keys(Penalty);
const timerTypes = Object.keys(TimerType);

const SOLVE_SCHEMA = joi
  .object<Solve>({
    uid: joi.string().required(),
    time: joi.number().required(),
    scramble: joi.string().required(),
    sessionId: joi.string().required(),
    penalty: joi
      .string()
      .valid(...penalties)
      .required(),
    enteredBy: joi
      .string()
      .valid(...timerTypes)
      .required(),
    solution: joi.string().optional()
  })
  .required();

export default SOLVE_SCHEMA;
