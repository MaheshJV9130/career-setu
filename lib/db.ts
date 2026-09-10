import mongoose from 'mongoose'

const MONGODB_URI = process.env.DB_URL_2 || process.env.DB_URL || process.env.MONGODB_URI

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cached = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cached

export async function connectDB() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not configured')
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).catch((error) => {
      cached.promise = null
      throw error
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
