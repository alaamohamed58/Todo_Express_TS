"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const register = joi_1.default.object({
    name: joi_1.default.string().max(30),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    confirmedPassword: joi_1.default.valid(joi_1.default.ref("password"))
        .required()
        .label("Password confirmation"),
});
const login = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.default = { register, login };
