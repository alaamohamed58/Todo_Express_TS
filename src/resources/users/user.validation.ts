import Joi from "joi";

const register = Joi.object({
  name: Joi.string().max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmedPassword: Joi.valid(Joi.ref("password"))
    .required()
    .label("Password confirmation"),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


export default {register, login}