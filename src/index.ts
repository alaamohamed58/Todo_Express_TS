import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import "module-alias/register";
import App from "./app";
import TodoController from "./resources/todo/todo.controller";
import validateEnv from "./utils/validateEnv";
import UserController from "./resources/users/user.controller";
import HttpException from "./utils/exceptions/http.exception";

const ex = express();

validateEnv();

const app = new App(
  [new TodoController(), new UserController()],
  Number(process.env.PORT)
);
//handling uncached routes
ex.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new HttpException(
    `Can't find ${req.originalUrl} on this server`,
    404
  );
  next(err);
});
app.listen();
