import joi from "joi";

const CONFIG_SCHEMA = joi.object({
  timerType: joi.string().valid("timer", "typing", "stackmat").required(),
  currentSession: joi.string().optional()
});

export default CONFIG_SCHEMA;
