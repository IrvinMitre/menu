import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  __cuatro20MongoClientPromise?: Promise<MongoClient>;
};

const mongoClientOptions = {
  maxPoolSize: 5,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  serverMonitoringMode: "poll" as const
};

function sanitizeMessage(message: string): string {
  return message.replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, "mongodb://[redacted]");
}

export function getSafeMongoErrorDetails(error: unknown) {
  const mongoError = error instanceof Error ? error : undefined;
  const cause = mongoError?.cause;

  return {
    name: mongoError?.name ?? "UnknownError",
    message: sanitizeMessage(mongoError?.message ?? String(error)),
    code: mongoError && "code" in mongoError ? mongoError.code : undefined,
    cause: cause instanceof Error
      ? {
          name: cause.name,
          message: sanitizeMessage(cause.message),
          code: "code" in cause ? cause.code : undefined
        }
      : cause === undefined
        ? undefined
        : sanitizeMessage(String(cause))
  };
}

export function getMongoClient(): Promise<MongoClient> {
  const uri = import.meta.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está configurada. Añádela en el archivo .env.");
  }

  if (globalForMongo.__cuatro20MongoClientPromise) {
    return globalForMongo.__cuatro20MongoClientPromise;
  }

  const client = new MongoClient(uri, mongoClientOptions);
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
