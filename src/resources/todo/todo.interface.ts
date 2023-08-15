import { Document } from "mongoose";
interface Todo extends Document {
  user: string;
  todo: string;
  date: string;
  sendEmail: number;
}

export default Todo;
