import { NextFunction, Request, Response } from "express";
import HttpException from "../utils/exceptions/http.exception";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";

  res.status(statusCode).json({
    statusCode,
    message,
  });
}

export default errorMiddleware;
