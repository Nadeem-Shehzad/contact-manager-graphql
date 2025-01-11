
import Contact, { ContactDocument } from "../models/contact";
import { IContact } from "../utils/types";

export const contactResolver = {
    Query: {
        getContacts: async (): Promise<IContact[]> => await Contact.find({}),
        getContact: async (_: any, args: { _id: string }): Promise<IContact | null> => {
            const { _id } = args;
            const contact = await Contact.findById({ _id });

            if (!contact) {
                throw new Error('Contact not found');
            }

            return contact;
        }
    },

    Mutation: {
        createContact: async (_: any, { contact }: { contact: IContact }): Promise<String> => {
            const { name, email, phone } = contact;

            await Contact.create({
                name,
                email,
                phone
            });

            return 'Contact created successfully!';
        }
    }
};