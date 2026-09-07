import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  __cuatro20MongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClient(): Promise<MongoClient> {
  const uri = import.meta.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está configurada. Añádela en el archivo .env.");
  }

  if (globalForMongo.__cuatro20MongoClientPromise) {
    return globalForMongo.__cuatro20MongoClientPromise;
  }

  const client = new MongoClient(uri);
  const connectionPromise = client.connect();
  const trackedPromise = connectionPromise.catch((error) => {
    if (globalForMongo.__cuatro20MongoClientPromise === trackedPromise) {
      delete globalForMongo.__cuatro20MongoClientPromise;
    }

    throw error;
  });

  globalForMongo.__cuatro20MongoClientPromise = trackedPromise;
  return trackedPromise;
}

export async function getMenuCollection() {
  const client = await getMongoClient();
  return client.db("menu").collection("menu");
}
