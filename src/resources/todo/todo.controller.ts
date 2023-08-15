import { Router } from "express";
import Todo from "./todo.model";
import FactoryHandler from "../controller.service";
import Controller from "../../utils/interfaces/Controller.interface";
import authenticatedMiddleware from "../../middleware/authenticated.middleware";

class TodoController implements Controller {
  public path = "/todo";
  public router = Router();
  private factoryHandler = new FactoryHandler(Todo);

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes(): void {
    this.router.post(this.path, authenticatedMiddleware, this.createTodo);
    this.router.get(this.path, authenticatedMiddleware, this.getTodos);
    this.router.get(
      `${this.path}/:id`,
      authenticatedMiddleware,
      this.getSingleTodo
    );
    this.router.patch(
      `${this.path}/:id`,
      authenticatedMiddleware,
      this.updateTodo
    );
    this.router.delete(
      `${this.path}/:id`,
      authenticatedMiddleware,
      this.deleteTodo
    );
  }

  private createTodo = this.factoryHandler.createOne();
  private getTodos = this.factoryHandler.getAll();
  private getSingleTodo = this.factoryHandler.getOne();
  private updateTodo = this.factoryHandler.updateOne();
  private deleteTodo = this.factoryHandler.deleteOne();
}

export default TodoController;
