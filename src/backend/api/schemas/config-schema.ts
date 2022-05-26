import joi from "joi";

const CONFIG_SCHEMA = joi.object({
  timerType: joi.string().valid("timer", "typing", "stackmat").required(),
  scrambleType: joi.string().valid("3x3x3", "2x2x2").required()
});

export default CONFIG_SCHEMA;
