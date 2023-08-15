import { Schema, model } from "mongoose";
import Todo from "./todo.interface";

const TodoSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  todo: {
    type: String,
    required: [true, "please write your todo"],
  },
  date: Date,
});

export default model<Todo>("Todo", TodoSchema);
