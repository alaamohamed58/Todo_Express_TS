import express, { NextFunction, Request, Response, Router } from "express";
import { CronJob } from "cron";

import "dotenv/config";
import "module-alias/register";
import App from "./app";
import TodoController from "./resources/todo/todo.controller";
import validateEnv from "./utils/validateEnv";
import UserController from "./resources/users/user.controller";
import todoModel from "./resources/todo/todo.model";
import userModel from "./resources/users/user.model";
import sendEmail from "./utils/email";
//import HttpException from "./utils/exceptions/http.exception";

const ex = express();

validateEnv();

const app = new App(
  [new TodoController(), new UserController()],
  Number(process.env.PORT)
);
const checkTodoDate = async (): Promise<Response | void> => {
  const currentDate = new Date(); // Current date and time
  // Set the time component of the current date to the beginning of the day
  currentDate.setHours(0, 0, 0, 0);

  try {
    const todos = await todoModel.find({
      date: {
        $gte: currentDate, // Greater than or equal to the beginning of the day
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Less than the beginning of the next day
      },
      sendEmail: 0,
    });

    const extractedEmails = new Set();

    for (const todo of todos) {
      const allUsers = todo.user;

      const users = await userModel.find({
        _id: {
          $in: allUsers,
        },
      });

      const emails = users.map((user) => user.email);
      emails.forEach((email) => extractedEmails.add(email));
    }

    const uniqueEmailsArray = Array.from(extractedEmails);

    // Send email to each user
    for (const email of uniqueEmailsArray) {
      await sendEmail({
        to: String(email),
        subject: "Todo Time",
        message: "lets start",
      });

      try {
        // Find the todos associated with the current user's email
        const user = await userModel.findOne({
          email,
        });

        if (user) {
          const todosToUpdate = await todoModel.find({
            user: user._id,
            sendEmail: 0,
          });

          for (const todo of todosToUpdate) {
            todo.sendEmail = 1;
            await todo.save();
            console.log(
              `sendEmail field updated for todo with _id ${todo._id}`
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

const job = new CronJob(
  "05 11 * * *", // Cron expression: Runs at 1:38 PM every day
  function () {
    checkTodoDate();
    console.log("Email send at 4:18 PM");
  },
  null,
  true,
  "Africa/Cairo"
);

job.start();
// //handling uncached routes
// ex.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const err = new HttpException(
//     `Can't find ${req.originalUrl} on this server`,
//     404
//   );
//   next(err);
// });

app.listen();
