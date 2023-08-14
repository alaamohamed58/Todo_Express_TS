import UserInterface from "@resources/users/users.interface";

interface Token  {
    user : UserInterface,
    expiresIn : number
}

export default Token