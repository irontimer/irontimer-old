import { TimerType } from "@prisma/client";
import joi from "joi";
import { Config } from "utils";

const timerTypes = Object.keys(TimerType);

const CONFIG_SCHEMA = joi.object<Config>({
  timerType: joi
    .string()
    .valid(...timerTypes)
    .required(),
  currentSessionId: joi.string().required(),
  displayAverages: joi.array().items(joi.number()).required()
});

export default CONFIG_SCHEMA;
