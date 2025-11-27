import mongoose from 'mongoose';

// Cache the Mongoose connection for serverless environments (e.g., Vercel)
let cached = global.mongooseConn;
if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

export async function connectDB(uri, options = {}) {
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set('strictQuery', true);

    // Helpful connection event logs
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err?.message || err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    cached.promise = mongoose
      .connect(uri, {
        // Reasonable defaults for serverless
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 5,
        autoIndex: true,
        ...options
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function dbReadyState() {
  return mongoose.connection.readyState; // 0=disc,1=conn,2=connecting,3=disconnecting
}
