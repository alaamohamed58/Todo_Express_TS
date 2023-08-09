import "dotenv/config";
import 'module-alias/register';
import App from "./app";
import TodoController from "./resources/todo/todo.controller";

const app = new App([new TodoController()], Number(process.env.PORT));

app.listen();
