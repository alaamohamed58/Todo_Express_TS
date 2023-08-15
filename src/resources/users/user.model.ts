import crypto from "crypto";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import UserInterface from "./users.interface";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "please provide username"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "please provide your password"],
  },
  confirmedPassword: {
    type: String,
    required: [true, "please provide your password confirm"],
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});
// Change the regular function to an arrow function
UserSchema.path("confirmedPassword").validate(function (val: string) {
  return this.password === val;
}, "Password doesn't match!");

UserSchema.pre<UserInterface>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  this.confirmedPassword = undefined;

  next();
});

UserSchema.methods.verifyPassword = async function (
  enteredPassword: string,
  password: string
): Promise<String | boolean> {
  return await bcrypt.compare(enteredPassword, password);
};
//generate passwordResetToken
UserSchema.methods.passwordRandomResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //expires in 10 mins

  // console.log({ resetToken }, { passReset: this.passwordResetToken });

  return resetToken;
};

export default model<UserInterface>("User", UserSchema);
