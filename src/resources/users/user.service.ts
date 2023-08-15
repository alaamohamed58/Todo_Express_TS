import User from "./user.model";
import token from "../../utils/token";
import HttpException from "../../utils/exceptions/http.exception";
import UserInterface from "./users.interface";
import { createToken } from "../../utils/token";
class UserService {
  private user = User;

  /**
   * Register
   */

  public async register(
    username: string,
    email: string,
    password: string,
    confirmedPassword: string
  ): Promise<string> {
    const user = await this.user.create({
      username,
      email,
      password,
      confirmedPassword,
    });
    const accessToken = token.createToken(user);

    return accessToken;
  }

  /**
   * Login
   */

  public async login(email: string, password: string): Promise<string> {
    const user = await this.user.findOne({ email });
    if (!email || !password) {
      throw new HttpException("Please provide email and password", 400);
    }
    if (!user || !(await user.verifyPassword(password, user.password))) {
      throw new HttpException("Incorrect email or password", 401);
    }

    const accessToken = token.createToken(user);
    return accessToken;
  }

  /**
   * Reset Password
   */

  public async resetPassword(
    hashedToken: string,
    password: string,
    confirmedPassword: string
  ): Promise<string> {
    //1) Get the user based on the token and expire date of token
    const user = await this.user.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //2) if the token is not expired, and there is user, set the new password
    if (!user) {
      throw new HttpException("Token is invalid or has expired", 400);
    }
    user.password = password;
    user.confirmedPassword = confirmedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //4) log the user in, send JWT
    const token = createToken(user);
    return token;
  }

  /**
   * Forget Password
   */

  public async forgetPassword(
    email: string
  ): Promise<{ resetToken: string; user: UserInterface }> {
    //find user by email
    const user = await this.user.findOne({ email });
    if (!user) {
      throw new HttpException("No User Found", 404);
    }
    const resetToken = user.passwordRandomResetToken();
    user.save({ validateBeforeSave: false });

    return { resetToken, user };
  }

  /**
   * Update Password
   */

  public async updatePassword(
    currentUser: UserInterface,
    password: string,
    newPassword: string
  ): Promise<string> {
    if (!password || !newPassword) {
      throw new HttpException("Please provide Password and new Password", 400);
    }
    const user = await this.user.findById(currentUser.id).select("+password");
    //check if user exists
    if (!user) {
      throw new HttpException("No User Found", 404);
    }

    //check if password is correct
    if (!(await user.verifyPassword(password, user.password))) {
      throw new HttpException("Incorrect password", 401);
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    const token = createToken(user);
    return token;
  }
}

export default UserService;
