import express, { Application } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import Controller from "./utils/interfaces/Controller.interface";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public express: Application;
  public port: number;
  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.intializeMongoose();
    this.intializeMiddlewares();
    this.intializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private intializeMongoose(): void {
    let db = process.env.DATABASE?.replace(
      "<PASSWORD>",
      String(process.env.PASSWORD)
    );

    if (db) {
      mongoose
        .connect(db)
        .then(() => console.log("Database Connected"))
        .catch((er) => console.log(er, "Error Something went wrong"));
    }
  }
  private intializeMiddlewares(): void {
    this.express.use(cors());
    this.express.use(helmet());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(morgan("dev"));
  }

  private intializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api/v1", controller.router);
    });
  }
  private initializeErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`The APP is listening to port ${this.port}`);
    });
  }
}

export default App;
