import { NextFunction, Request, Response } from "express";

type CreateOneFunction = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
const catchAsync = (fn: CreateOneFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};


export default catchAsync