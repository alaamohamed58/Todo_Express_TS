import { Document } from "mongoose";

interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string | undefined;
  passwordResetToken: string | undefined;
  passwordResetExpires: string | undefined;

  verifyPassword(
    password: string,
    enteredPassword: string
  ): Promise<Error | boolean>;
  passwordRandomResetToken(): string;
}

export default UserInterface;
