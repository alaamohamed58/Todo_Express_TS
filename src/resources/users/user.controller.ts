import { NextFunction, Request, Response, Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import UserService from "./user.service";
import catchAsync from "../../utils/catchAsync/catchAsync";
import HttpException from "../../utils/exceptions/http.exception";
import authenticatedMiddleware from "../../middleware/authenticated.middleware";
import sendEmail from "../../utils/email";

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
    this.router.post(`${this.path}/forgetPassword`, this.forgetPassword);
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


  private forgetPassword = catchAsync(async(req:Request, res:Response, next:NextFunction): Promise<void>=>{
    const {email} = req.body

   const {user, resetToken} =  await this.userService.forgetPassword(email)

    try {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/user/resetPassword/${resetToken}`;
  
      const message = `Forgot your password ? Submit this link to set new password : ${resetURL}`;
  
      await sendEmail({
        to: user.email,
        subject: "Reset Password (valid for 10 minutes)",
        message,
      });
      res.status(200).json({
        message: "token sent to email",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save({ validateBeforeSave: false });
  
      return next(
        new HttpException("there was an error sending an email, please try later"+ err, 500)
      );
    }

  })



  private getUser = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    if (!req.user) {
        return next(new HttpException('No logged in user', 401));
    }

    res.status(200).send({ data: req.user });
}}

export default UserController;
