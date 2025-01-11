import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const dbConnectionString = process.env.DB_CONNECTION_STRING;

        if (!dbConnectionString) {
            throw new Error("Database connection string is not defined in the environment variables.");
        }

        const connect = await mongoose.connect(dbConnectionString);
        if (connect) {
            console.log(`db connected.`);
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;