"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const todo_controller_1 = __importDefault(require("./resources/todo/todo.controller"));
const app = new app_1.default([new todo_controller_1.default()], Number(process.env.PORT));
app.listen();
