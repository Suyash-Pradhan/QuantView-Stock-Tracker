
import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {

    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;

}
declare global {
    var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env');
    }
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
    }
    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    console.log(`MongoDB connected at: ${process.env.NEXT_PUBLIC_APP_URL}`);
}