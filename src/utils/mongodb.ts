import { MongoClient } from "mongodb";

const connectionURI = process.env.CONNECTION_URI;

const client = new MongoClient(connectionURI ?? '');

export const startMongoClient = async() => {
    await client.connect();
    console.log("Connected to MongoDB")
}

export const getMongoClientInstance = () => {
    return client;
}

export const stopMongoClient = () => {
    client.close();
}