import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  __cuatro20MongoClient?: MongoClient;
};

export function getMongoClient() {
  const uri = import.meta.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está configurada. Añádela en el archivo .env.");
  }

  if (!globalForMongo.__cuatro20MongoClient) {
    globalForMongo.__cuatro20MongoClient = new MongoClient(uri);
  }

  return globalForMongo.__cuatro20MongoClient;
}

export function getMenuCollection() {
  return getMongoClient().db("cuatro20").collection("menus");
}
