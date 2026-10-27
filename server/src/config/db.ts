import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log(`MongoDB connected (${mongoose.connection.name})`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
