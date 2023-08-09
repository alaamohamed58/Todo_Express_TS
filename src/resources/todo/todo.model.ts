import { Schema, model } from "mongoose";
import Todo from "./todo.interface";

const TodoSchema = new Schema({
  todo: {
    type: String,
    required: [true, "please write your todo"],
  },
  data: Date,
});

export default model<Todo>("Todo", TodoSchema);
