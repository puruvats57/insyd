import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/insyd_pdc';
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || 'http://localhost:3000';

// Connect DB
mongoose.set('strictQuery', true);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

// Models
import './models/Payment.js';

// Routes
import paymentsRouter from './routes/payments.js';
import remindersRouter from './routes/reminders.js';

const app = express();
app.use(helmet());

// CORS configuration: allow configured origin, production domain, and Vercel previews
const allowedOrigins = [
  ALLOW_ORIGIN,
  'https://insyd-rho.vercel.app',
];
const vercelPreviewRegex = /https?:\/\/.*\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no origin) like curl/health checks
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin);
    if (isAllowed) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Explicitly handle preflight
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/payments', paymentsRouter);
app.use('/api/reminders', remindersRouter);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});


