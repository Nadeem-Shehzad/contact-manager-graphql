import {mCreateContact } from './contactController';
import { qGetContact , qGetContacts} from './contactController';

export const contactResolver = {
    Query: {
        getContacts: qGetContacts,
        getContact: qGetContact
    },

    Mutation: {
        createContact: mCreateContact
    }
};