import User from "./user.model";
import token from "../../utils/token";
import HttpException from "../../utils/exceptions/http.exception";
import UserInterface from "./users.interface";

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
    if (!user || !(await user.verifyPassword(password))) {
      throw new HttpException("Incorrect email or password", 401);
    }

    const accessToken = token.createToken(user);
    return accessToken;
  }

  /**
   * Forget Password
   */

  public async forgetPassword(email: string): Promise<{ resetToken: string, user: UserInterface }> {
    //find user by email
    const user = await this.user.findOne({ email });

    if (!user) {
      throw new HttpException("No User Found", 404);
    }

    const resetToken = user.passwordRandomResetToken();

    user.save({ validateBeforeSave: false });

    return {resetToken, user}
  }
}

export default UserService;
