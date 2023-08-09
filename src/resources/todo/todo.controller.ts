import { Router } from "express";
import Controller from "../../utils/interfaces/Controller.interface";

import Todo from "./todo.model";
import FactoryHandler from "../controller.service";

class PostController implements Controller {
  public path = "/todo";
  public router = Router();
  private factoryHandler = new FactoryHandler(Todo);

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes(): void {
    this.router.post(this.path, this.createTodo);
    this.router.get(this.path, this.getTodos);
  }

  private createTodo = this.factoryHandler.createOne();

  private getTodos = this.factoryHandler.getAll();
}

export default PostController;
