"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, req, res, next) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    res.status(statusCode).json({
        statusCode,
        message,
    });
}
exports.default = errorMiddleware;
