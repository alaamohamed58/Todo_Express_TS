import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../resources/users/user.model";
import HttpException from "../utils/exceptions/http.exception";
import Token from "../utils/interfaces/token.interface";
import token from "../utils/token";
import catchAsync from "../utils/catchAsync/catchAsync";

const authenticatedMiddleware = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException("please provide token", 400));
  }

  const accessToken = bearer.split("Bearer ")[1];

  const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
    accessToken
  );

  if (payload instanceof jwt.JsonWebTokenError) {
    return next(new HttpException("invalid token", 400));
  }
  const user = await User.findById(payload.user._id).select("-password").exec();
  // const user = await User.findById(payload._id).select("-password").exec()
  req.user = user;

  next();
});
export default authenticatedMiddleware;
