import "dotenv/config";
import 'module-alias/register';
import App from "./app";
import TodoController from "./resources/todo/todo.controller";
import validateEnv from "./utils/validateEnv";
import UserController from "./resources/users/user.controller";


validateEnv()

const app = new App([new TodoController(), new UserController()], Number(process.env.PORT));

app.listen();
