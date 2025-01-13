import Contact, { ContactDocument } from "../../models/contact";
import { IContact, IContactE, MyContext, ScanResult } from "../../utils/types";

import Redis from 'ioredis';



const redisClient = new Redis();
redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
    // Check if Redis client is already connected
    if (redisClient.status !== 'ready') {  // 'ready' means the connection is fully established
        try {
            await redisClient.connect(); // Only connect if not already connected
            console.log('Connected to Redis');
        } catch (err) {
            // console.error('Failed to connect to Redis:', err);
            console.log(`connecting error...`);
        }
    }
})();



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


export const qGetContacts = async (_: any, { page, limit }: { page: number, limit: number }, contextValue: MyContext)
    : Promise<{ contacts: IContact[], totalContacts: number }> => {

    const { userId } = contextValue;
    if (!userId) {
        throw new Error('You must logged in!');
    }

    const key: string = `getContacts:${userId}:${page}:${limit}`;

    try {
        const cachedData = await redisClient.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const contacts = await Contact.find({ user_id: userId }).skip((page - 1) * limit).limit(limit);

        const totalContacts = contacts.length;

        await redisClient.set(key, JSON.stringify({ contacts, totalContacts }), 'EX', 3600);

        return { contacts, totalContacts };

    } catch (error) {
        throw new Error('Failed to fetch contacts. Please try again later.');
    }
}


export const qGetContact = async (_: any, args: { _id: string }): Promise<IContact | null> => {
    const { _id } = args;

    const key: string = `getContact:${_id}`;

    try {
        const cachedData = await redisClient.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const contact: ContactDocument | null = await Contact.findById({ _id });

        if (!contact) {
            throw new Error('Contact not found');
        }

        await redisClient.set(key, JSON.stringify(contact), 'EX', 3600);

        return contact;

    } catch (error) {
        throw new Error('Failed to fetch contact. Please try again later.');
    }
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

    const updatedContact = await Contact.findByIdAndUpdate(
        contactId,
        {
            $set: {
                ...contact
            }
        },
        { new: true }
    )

    if (!updatedContact) {
        throw new Error('Failed to update the contact.');
    }

    const contactKey = `getContact:${contactId}`;
    await redisClient.set(contactKey, JSON.stringify(updatedContact), 'EX', 3600);

    const pattern = `getContacts:${userId}:*`;
    await deleteKeysByPattern(pattern);

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

    await redisClient.del(`getContact:${contactId}`);

    let key: string = `getContacts:${userId}:1:5`;
    const cachedData = await redisClient.get(key);
    if (cachedData) {
        console.log(`inside delete fun of redis`);
        const parseData = JSON.parse(cachedData);
        // remove this contact from redis 
        const updatedContacts = parseData.contacts.filter((contact: IContactE) => contact._id.toString() !== contactId);
        await redisClient.set(key, JSON.stringify({ contacts: updatedContacts, totalContacts: updatedContacts.length }), 'EX', 3600);
    } else {
        console.log(`No cached data to delete`)
    }

    return 'Contact deleted.';
}


async function deleteKeysByPattern(pattern: string): Promise<void> {
    let cursor: string = '0';
    const batchSize = 100;

    do {
        const scanResult: [string, string[]] = await redisClient.scan(
            cursor,
            'MATCH', pattern,
            'COUNT', batchSize
        );

        cursor = scanResult[0];
        const keys = scanResult[1];

        if (keys.length > 0) {
            await redisClient.del(...keys);
        }

    } while (cursor !== '0');
}