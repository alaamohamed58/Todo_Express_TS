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
const user_model_1 = __importDefault(require("./user.model"));
const token_1 = __importDefault(require("../../utils/token"));
const http_exception_1 = __importDefault(require("../../utils/exceptions/http.exception"));
const token_2 = require("../../utils/token");
class UserService {
    constructor() {
        this.user = user_model_1.default;
    }
    /**
     * Register
     */
    register(username, email, password, confirmedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.create({
                username,
                email,
                password,
                confirmedPassword,
            });
            const accessToken = token_1.default.createToken(user);
            return accessToken;
        });
    }
    /**
     * Login
     */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findOne({ email });
            if (!email || !password) {
                throw new http_exception_1.default("Please provide email and password", 400);
            }
            if (!user || !(yield user.verifyPassword(password))) {
                throw new http_exception_1.default("Incorrect email or password", 401);
            }
            const accessToken = token_1.default.createToken(user);
            return accessToken;
        });
    }
    /**
     * Reset Password
     */
    resetPassword(hashedToken, password, confirmedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            //1) Get the user based on the token and expire date of token
            const user = yield this.user.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() },
            });
            //2) if the token is not expired, and there is user, set the new password
            if (!user) {
                throw new http_exception_1.default("Token is invalid or has expired", 400);
            }
            user.password = password;
            user.confirmedPassword = confirmedPassword;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            yield user.save();
            //4) log the user in, send JWT
            const token = (0, token_2.createToken)(user);
            return token;
        });
    }
    /**
     * Forget Password
     */
    forgetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            //find user by email
            const user = yield this.user.findOne({ email });
            if (!user) {
                throw new http_exception_1.default("No User Found", 404);
            }
            const resetToken = user.passwordRandomResetToken();
            user.save({ validateBeforeSave: false });
            return { resetToken, user };
        });
    }
}
exports.default = UserService;
