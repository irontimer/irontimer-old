import joi from "joi";
import { SCRAMBLE_TYPES } from "../../../constants/scramble-type";

const CONFIG_SCHEMA = joi.object({
  timerType: joi.string().valid("timer", "typing", "stackmat").required(),
  scrambleType: joi
    .string()
    .valid(...SCRAMBLE_TYPES)
    .required()
});

export default CONFIG_SCHEMA;
