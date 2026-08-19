import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import assetsRouter from './routes/assets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/assets', assetsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Database Connection & Server Startup
if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI is not defined in your .env file. Running in database-less mode.');
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB successfully.'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
