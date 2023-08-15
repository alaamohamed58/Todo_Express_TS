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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "please provide username"],
    },
    email: {
        type: String,
        required: [true, "please provide your email"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "please provide your password"],
    },
    confirmedPassword: {
        type: String,
        required: [true, "please provide your password confirm"],
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
});
// Change the regular function to an arrow function
UserSchema.path("confirmedPassword").validate(function (val) {
    return this.password === val;
}, "Password doesn't match!");
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        const hash = yield bcrypt_1.default.hash(this.password, 12);
        this.password = hash;
        this.confirmedPassword = undefined;
        next();
    });
});
UserSchema.methods.verifyPassword = function (enteredPassword, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(enteredPassword, password);
    });
};
//generate passwordResetToken
UserSchema.methods.passwordRandomResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //expires in 10 mins
    // console.log({ resetToken }, { passReset: this.passwordResetToken });
    return resetToken;
};
exports.default = (0, mongoose_1.model)("User", UserSchema);
