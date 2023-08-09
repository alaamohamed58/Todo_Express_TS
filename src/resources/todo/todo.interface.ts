import { Document } from "mongoose";
interface Todo extends Document {
  todo: string;
  date: string;
}

export default Todo;
