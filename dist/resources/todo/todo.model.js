"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TodoSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.ObjectId,
        ref: "User",
    },
    todo: {
        type: String,
        required: [true, "please write your todo"],
    },
    date: Date,
    sendEmail: {
        type: Number,
        default: 0,
    },
});
exports.default = (0, mongoose_1.model)("Todo", TodoSchema);
