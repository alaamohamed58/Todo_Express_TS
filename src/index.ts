import "dotenv/config";
import App from "./app";
import PostController from "./resources/todo/todo.controller";

const app = new App([new PostController()], Number(process.env.PORT));

app.listen();
