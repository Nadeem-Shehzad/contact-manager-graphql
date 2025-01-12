
import Contact, { ContactDocument } from "../../models/contact";
import { IContact, MyContext } from "../../utils/types";


export const mCreateContact = async (_: any, { contact }: { contact: IContact }, contextValue: MyContext): Promise<String> => {
    const { userId } = contextValue;

    if (!userId) {
        throw new Error('You must logged in!');
    }

    const { name, email, phone } = contact;

    await Contact.create({
        user_id: userId,
        name,
        email,
        phone
    });

    return 'Contact created successfully!';
}


export const qGetContacts = async (_: any, __: any, contextValue: MyContext): Promise<IContact[] | null> => {
    const { userId } = contextValue;
    if (!userId) {
        throw new Error('You must logged in!');
    }

    return await Contact.find({ user_id: userId });
}


export const qGetContact = async (_: any, args: { _id: string }): Promise<IContact | null> => {
    const { _id } = args;
    const contact: ContactDocument | null = await Contact.findById({ _id });

    if (!contact) {
        throw new Error('Contact not found');
    }

    return contact;
}


export const mUpdateContact = async (_: any, { contactId, contact }: { contactId: String, contact: IContact }, contextValue: MyContext): Promise<String> => {
    const { userId } = contextValue;
    if (!userId) {
        throw new Error('You must logged in!');
    }

    const contactExists: ContactDocument | null = await Contact.findById(contactId);
    if (!contactExists) {
        throw new Error('Contact not exists!');
    }

    if (contactExists.user_id.toString() !== userId) {
        throw new Error('Access to update other data is denied!');
    }

    await Contact.findByIdAndUpdate(
        contactId,
        {
            $set: {
                ...contact
            }
        },
        { new: true }
    )

    return 'Contact updated.';
}


export const mDeleteContact = async (_: any, { contactId }: { contactId: String }, contextValue: MyContext): Promise<String> => {
    const { userId } = contextValue;
    if (!userId) {
        throw new Error('You must logged in!');
    }

    const contactExists = await Contact.findById(contactId);
    if (!contactExists) {
        throw new Error('Contact not exists!');
    }

    if (contactExists.user_id.toString() !== userId) {
        throw new Error('Access to delete other data is denied!');
    }

    await Contact.findByIdAndDelete(contactId);

    return 'Contact deleted.';
}