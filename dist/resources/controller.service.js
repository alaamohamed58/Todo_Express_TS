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
const http_exception_1 = __importDefault(require("../utils/exceptions/http.exception"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync/catchAsync"));
class FactoryHandler {
    constructor(model) {
        this.model = model;
        this.model = model;
    }
    //create
    createOne() {
        return (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.model.create(Object.assign(Object.assign({}, req.body), { user: req.user.id }));
            res.status(201).json({
                message: "Successfuly created",
                data: {
                    model,
                },
            });
        }));
    }
    //get all
    getAll() {
        return (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.model.find({ user: req.user._id });
            res.status(200).json({
                data: {
                    model,
                },
            });
        }));
    }
    //get one
    getOne() {
        return (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.model.findById(req.params.id);
            if (!model) {
                return next(new http_exception_1.default("No Model with that id", 404));
            }
            res.status(200).json({
                data: {
                    model,
                },
            });
        }));
    }
    //Delete One
    deleteOne() {
        return (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.model.findByIdAndDelete(req.params.id);
            if (!model) {
                return next(new http_exception_1.default("No Model with that id", 404));
            }
            res.status(204).json({
                message: "Succesfully Deleted",
            });
        }));
    }
    //Update One
    updateOne() {
        return (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.model.findByIdAndUpdate(req.params.id, req.body, {
                runValidators: true,
            });
            if (!model) {
                return next(new http_exception_1.default("No Model with that id", 404));
            }
            res.status(200).json({
                message: "Succesfully Update",
                data: {
                    model,
                },
            });
        }));
    }
}
exports.default = FactoryHandler;
