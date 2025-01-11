import mongoose, { Document } from "mongoose";
import { IContact } from '../utils/types'

export interface ContactDocument extends IContact, Document { }

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name Required']
    },
    email: {
        type: String,
        required: [true, 'Email Required']
    },
    phone: {
        type: String,
        required: [true, 'Phone Required']
    }
}, { timestamps: true });

const Contact = mongoose.model<ContactDocument>('Contacts', contactSchema);

export default Contact;