import mongoose, { ClientSession } from 'mongoose';

/** Runs fn in a transaction (needs a replica set). Falls back to non-transactional execution on standalone instances. */
export async function withTransaction<T>(fn: (session: ClientSession | null) => Promise<T>): Promise<T> {
  try {
    return await mongoose.connection.transaction(fn);
  } catch (err: any) {
    if (
      err?.code === 20 ||
      err?.codeName === 'IllegalOperation' ||
      err?.message?.includes('Transaction numbers are only allowed') ||
      err?.message?.includes('replica set')
    ) {
      return await fn(null);
    }
    throw err;
  }
}
