"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cron_1 = require("cron");
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const todo_controller_1 = __importDefault(require("./resources/todo/todo.controller"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const user_controller_1 = __importDefault(require("./resources/users/user.controller"));
const todo_model_1 = __importDefault(require("./resources/todo/todo.model"));
const user_model_1 = __importDefault(require("./resources/users/user.model"));
const email_1 = __importDefault(require("./utils/email"));
//import HttpException from "./utils/exceptions/http.exception";
const ex = (0, express_1.default)();
(0, validateEnv_1.default)();
const app = new app_1.default([new todo_controller_1.default(), new user_controller_1.default()], Number(process.env.PORT));
const checkTodoDate = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date(); // Current date and time
    // Set the time component of the current date to the beginning of the day
    currentDate.setHours(0, 0, 0, 0);
    try {
        const todos = yield todo_model_1.default.find({
            date: {
                $gte: currentDate,
                $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Less than the beginning of the next day
            },
            sendEmail: 0,
        });
        const extractedEmails = new Set();
        for (const todo of todos) {
            const allUsers = todo.user;
            const users = yield user_model_1.default.find({
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
            if (!email) {
                console.log("Email");
                return;
            }
            yield (0, email_1.default)({
                to: String(email),
                subject: "Todo Time",
                message: "lets start",
            });
            try {
                // Find the todos associated with the current user's email
                const user = yield user_model_1.default.findOne({
                    email,
                });
                if (user) {
                    const todosToUpdate = yield todo_model_1.default.find({
                        user: user._id,
                        sendEmail: 0,
                    });
                    for (const todo of todosToUpdate) {
                        todo.sendEmail = 1;
                        yield todo.save();
                        console.log(`sendEmail field updated for todo with _id ${todo._id}`);
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    catch (error) {
        console.error("Error fetching todos:", error);
    }
});
const job = new cron_1.CronJob("15 17 * * *", // Cron expression: Runs at 1:38 PM every day
function () {
    checkTodoDate();
    console.log("Email send at 2:36 PM");
}, null, true, "Africa/Cairo");
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
