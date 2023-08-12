
import User from "./user.model";
import token from "../../utils/token";
import HttpException from "../../utils/exceptions/http.exception";

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

  async login(email: string, password: string): Promise<string> {
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
}

export default UserService;
