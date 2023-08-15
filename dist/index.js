"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const todo_controller_1 = __importDefault(require("./resources/todo/todo.controller"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const user_controller_1 = __importDefault(require("./resources/users/user.controller"));
const http_exception_1 = __importDefault(require("./utils/exceptions/http.exception"));
const ex = (0, express_1.default)();
(0, validateEnv_1.default)();
const app = new app_1.default([new todo_controller_1.default(), new user_controller_1.default()], Number(process.env.PORT));
//handling uncached routes
ex.all("*", (req, res, next) => {
    const err = new http_exception_1.default(`Can't find ${req.originalUrl} on this server`, 404);
    next(err);
});
app.listen();
