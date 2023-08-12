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
const user_service_1 = __importDefault(require("./user.service"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync/catchAsync"));
const http_exception_1 = __importDefault(require("../../utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("../../middleware/authenticated.middleware"));
class UserController {
    constructor() {
        this.path = "/user";
        this.router = (0, express_1.Router)();
        this.userService = new user_service_1.default();
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const token = yield this.userService.login(email, password);
                res.status(200).json({
                    message: "Successfully logged in",
                    token,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.register = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, confirmedPassword } = req.body;
            const token = yield this.userService.register(username, email, password, confirmedPassword);
            res.status(201).json({
                message: "Successfully registered",
                token,
            });
        }));
        this.getUser = (req, res, next) => {
            if (!req.user) {
                return next(new http_exception_1.default('No logged in user', 401));
            }
            res.status(200).send({ data: req.user });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.get(`${this.path}`, authenticated_middleware_1.default, this.getUser);
    }
}
exports.default = UserController;
