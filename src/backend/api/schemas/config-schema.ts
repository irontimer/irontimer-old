import joi from "joi";

const CONFIG_SCHEMA = joi.object({
  timerType: joi.string().valid("timer", "typing", "stackmat").required(),
  currentSession: joi.string().required(),
  displayAverages: joi.array().items(joi.string()).required()
});

export default CONFIG_SCHEMA;
