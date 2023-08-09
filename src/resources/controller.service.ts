import { NextFunction, Request, Response } from "express";
import { Document, Model } from "mongoose";
type CreateOneFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

type GetAllFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

class FactoryHandler<T extends Document> {
  constructor(public model: Model<T>) {
    this.model = model;
  }
  //create
  public createOne(): CreateOneFunction {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      try {
        const post = await this.model.create(req.body);
        res.status(201).json({
          message: "Successfuly created",
          data: {
            post,
          },
        });
      } catch (err) {
        throw new Error("Unable to create post");
      }
    };
  }

  //get
  public getAll(): GetAllFunction {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const post = await this.model.find();
      res.status(200).json({
        data: {
          post,
        },
      });
    };
  }
}
export default FactoryHandler;
