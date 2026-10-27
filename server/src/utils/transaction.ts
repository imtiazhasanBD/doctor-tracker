import mongoose, { ClientSession } from 'mongoose';

/** Runs fn in a transaction (needs a replica set; Atlas has one). Retries transient errors automatically. */
export function withTransaction<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
  return mongoose.connection.transaction(fn);
}
