import { NextFunction, Request, Response, Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import UserService from "./user.service";
import catchAsync from "../../utils/catchAsync/catchAsync";
import User from "./user.model"
import HttpException from "../../utils/exceptions/http.exception";
import authenticatedMiddleware from "../../middleware/authenticated.middleware";

class UserController implements Controller {
  public path = "/user";
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.login);
    this.router.get(`${this.path}`, authenticatedMiddleware, this.getUser);
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email, password } = req.body;
    try {
      const token = await this.userService.login(email, password);
      res.status(200).json({
        message: "Successfully logged in",
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  private register = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { username, email, password, confirmedPassword } = req.body;
      const token = await this.userService.register(
        username,
        email,
        password,
        confirmedPassword
      );

      res.status(201).json({
        message: "Successfully registered",
        token,
      });
    }
  );

  private getUser = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    if (!req.user) {
        return next(new HttpException('No logged in user', 401));
    }

    res.status(200).send({ data: req.user });
};}

export default UserController;
