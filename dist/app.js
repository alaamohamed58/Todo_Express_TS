"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.intializeMongoose();
        this.intializeMiddlewares();
        this.intializeControllers(controllers);
        this.initializeErrorHandling();
    }
    intializeMongoose() {
        var _a;
        let db = (_a = process.env.DATABASE) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", String(process.env.PASSWORD));
        if (db) {
            mongoose_1.default
                .connect(db)
                .then(() => console.log("Database Connected"))
                .catch((er) => console.log(er, "Error Something went wrong"));
        }
    }
    intializeMiddlewares() {
        this.express.use((0, cors_1.default)());
        this.express.use((0, helmet_1.default)());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use((0, morgan_1.default)("dev"));
    }
    intializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use("/api/v1", controller.router);
        });
    }
    initializeErrorHandling() {
        this.express.use(error_middleware_1.default);
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`The APP is listening to port ${this.port}`);
        });
    }
}
exports.default = App;
