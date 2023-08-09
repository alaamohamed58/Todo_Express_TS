"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_model_1 = __importDefault(require("./post/post.model"));
class PostController {
    constructor() {
        this.path = "/todo";
        this.router = (0, express_1.Router)();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const todo = yield post_model_1.default.create(req.body);
            res.status(201).json({
                message: "Successfuly Created",
                data: {
                    todo,
                },
            });
        });
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const todo = yield post_model_1.default.find();
            res.status(200).json({
                data: {
                    todo,
                },
            });
        });
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path, this.create);
        this.router.get(this.path, this.get);
    }
}
exports.default = PostController;
