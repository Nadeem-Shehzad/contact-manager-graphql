
import {mCreateContact, mUpdateContact, mDeleteContact } from './contactController';
import { qGetContact , qGetContacts} from './contactController';

export const contactResolver = {
    Query: {
        getContacts: qGetContacts,
        getContact: qGetContact
    },

    Mutation: {
        createContact: mCreateContact,
        updateContact: mUpdateContact,
        deleteContact: mDeleteContact
    }
};