import mongoose, { Document } from "mongoose";
import { IUser } from "../utils/types";

export interface UserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username required!'],
    },
    email: {
        type: String,
        required: [true, 'email required!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password required!']
    }
}, { timestamps: true });

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;