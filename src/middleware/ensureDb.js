import { connectDB } from '../config/db.js';

export async function ensureDb(req, res, next) {
  try {
    await connectDB(process.env.MONGODB_URI);
    next();
  } catch (err) {
    res.status(503).json({ error: 'ServiceUnavailable', message: 'Database unavailable', details: err.message });
  }
}
