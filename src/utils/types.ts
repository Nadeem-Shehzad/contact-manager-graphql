import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";


export interface IUser {
    username: string;
    email: string;
    password: string;
}


export interface ILogin {
    email: string;
    password: string
}


export interface IContact {
    name: string;
    email: string;
    phone: string;
    user_id: mongoose.Schema.Types.ObjectId;
}


export interface CustomJWTPayload extends JwtPayload {
    userId: string;
    email: string;
}


export interface MyContext {
    userId?: string;
    email?: string;
}