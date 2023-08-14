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
