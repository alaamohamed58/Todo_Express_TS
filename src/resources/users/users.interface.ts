import { Document } from "mongoose";

interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string | undefined;

  verifyPassword(password: string): Promise<Error | boolean>;
}

export default UserInterface;
