import { NextFunction, Request, Response } from "express";
import { Document, Model } from "mongoose";
import HttpException from "../utils/exceptions/http.exception";
import catchAsync from "../utils/catchAsync/catchAsync";

class FactoryHandler<T extends Document> {
  constructor(public model: Model<T>) {
    this.model = model;
  }
  //create
  public createOne() {
    return catchAsync(
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<Response | void> => {
        const model = await this.model.create(req.body);
        res.status(201).json({
          message: "Successfuly created",
          data: {
            model,
          },
        });
      }
    );
  }
  //get all
  public getAll() {
    return catchAsync(
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<Response | void> => {
        const model = await this.model.find();
        res.status(200).json({
          data: {
            model,
          },
        });
      }
    );
  }

  //get one
  public getOne() {
    return catchAsync(
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<Response | void> => {
        const model = await this.model.findById(req.params.id);
        if (!model) {
          return next(new HttpException("No Model with that id", 404));
        }
        res.status(200).json({
          data: {
            model,
          },
        });
      }
    );
  }
  //Delete One
  public deleteOne() {
    return catchAsync(
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<Response | void> => {
        const model = await this.model.findByIdAndDelete(req.params.id);
        if (!model) {
          return next(new HttpException("No Model with that id", 404));
        }

        res.status(204).json({
          message: "Succesfully Deleted",
        });
      }
    );
  }

  //Update One
  public updateOne() {
    return catchAsync(
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<Response | void> => {
        const model = await this.model.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            runValidators: true,
          }
        );
        if (!model) {
          return next(new HttpException("No Model with that id", 404));
        }

        res.status(200).json({
          message: "Succesfully Update",
          data: {
            model,
          },
        });
      }
    );
  }
}
export default FactoryHandler;
