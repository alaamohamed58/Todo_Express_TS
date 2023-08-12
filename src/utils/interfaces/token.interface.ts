import UserInterface from "@resources/users/users.interface";
import { Schema } from "mongoose";

interface Token extends Object {
    user : UserInterface,
    expiresIn : number
}

export default Token