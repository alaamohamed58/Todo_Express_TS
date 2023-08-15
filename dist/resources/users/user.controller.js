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
const crypto_1 = __importDefault(require("crypto"));
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync/catchAsync"));
const http_exception_1 = __importDefault(require("../../utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("../../middleware/authenticated.middleware"));
const email_1 = __importDefault(require("../../utils/email"));
class UserController {
    constructor() {
        this.path = "/user";
        this.router = (0, express_1.Router)();
        this.userService = new user_service_1.default();
        //register
        this.register = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, confirmedPassword } = req.body;
            const token = yield this.userService.register(username, email, password, confirmedPassword);
            res.status(201).json({
                message: "Successfully registered",
                token,
            });
        }));
        //login
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
        //reset password
        this.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const hashedToken = crypto_1.default
                .createHash("sha256")
                .update(req.params.token)
                .digest("hex");
            const { password, confirmedPassword } = req.body;
            const token = yield this.userService.resetPassword(hashedToken, password, confirmedPassword);
            res.status(200).json({
                message: "successfully reset password",
                token,
            });
        }));
        //forget password
        this.forgetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const { user, resetToken } = yield this.userService.forgetPassword(email);
            try {
                const resetURL = `${req.protocol}://${req.get("host")}/api/v1/user/resetPassword/${resetToken}`;
                yield (0, email_1.default)({
                    to: user.email,
                    subject: "Reset Password",
                    message: `Forgot your password ? Submit this link to set new password : ${resetURL}`,
                });
                res.status(200).json({
                    message: "token sent to email",
                });
            }
            catch (err) {
                console.log(err);
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save({ validateBeforeSave: false });
                return next(new http_exception_1.default("there was an error sending an email, please try later" + err, 500));
            }
        }));
        //update password
        this.updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { password, newPassword } = req.body;
            const token = yield this.userService.updatePassword(req.user, password, newPassword);
            res.status(200).json({
                message: "successfully updated password",
                token,
            });
        }));
        //get current user
        this.getUser = (req, res, next) => {
            if (!req.user) {
                return next(new http_exception_1.default("No logged in user", 401));
            }
            res.status(200).send({ data: req.user });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.post(`${this.path}/forgetPassword`, this.forgetPassword);
        this.router.post(`${this.path}/resetPassword/:token`, this.resetPassword);
        this.router.post(`${this.path}/updatePassword`, authenticated_middleware_1.default, this.updatePassword);
        this.router.get(`${this.path}`, authenticated_middleware_1.default, this.getUser);
    }
}
exports.default = UserController;
