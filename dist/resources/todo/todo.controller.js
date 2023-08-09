"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_model_1 = __importDefault(require("./todo.model"));
const controller_service_1 = __importDefault(require("../controller.service"));
class TodoController {
    constructor() {
        this.path = "/todo";
        this.router = (0, express_1.Router)();
        this.factoryHandler = new controller_service_1.default(todo_model_1.default);
        this.createTodo = this.factoryHandler.createOne();
        this.getTodos = this.factoryHandler.getAll();
        this.getSingleTodo = this.factoryHandler.getOne();
        this.updateTodo = this.factoryHandler.updateOne();
        this.deleteTodo = this.factoryHandler.deleteOne();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path, this.createTodo);
        this.router.get(this.path, this.getTodos);
        this.router.get(`${this.path}/:id`, this.getSingleTodo);
        this.router.patch(`${this.path}/:id`, this.updateTodo);
        this.router.delete(`${this.path}/:id`, this.deleteTodo);
    }
}
exports.default = TodoController;
