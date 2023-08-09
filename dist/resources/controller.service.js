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
Object.defineProperty(exports, "__esModule", { value: true });
class FactoryHandler {
    constructor(model) {
        this.model = model;
        this.model = model;
    }
    //create
    createOne() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.model.create(req.body);
                res.status(201).json({
                    message: "Successfuly created",
                    data: {
                        post,
                    },
                });
            }
            catch (err) {
                throw new Error("Unable to create post");
            }
        });
    }
    //get
    getAll() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const post = yield this.model.find();
            res.status(200).json({
                data: {
                    post,
                },
            });
        });
    }
}
exports.default = FactoryHandler;
