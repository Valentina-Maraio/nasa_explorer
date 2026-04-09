const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const apodRoutes = require('./routes/apodRoutes');
const epicRoutes = require('./routes/epicRoutes');
const imageRoutes = require('./routes/imageRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (process.env.NODE_ENV !== 'production' && allowedOrigins.length === 0) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new AppError('CORS blocked for this origin', 403, 'CORS_BLOCKED', true));
  },
  methods: ['GET'],
};

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    apiKeyConfigured: Boolean(process.env.NASA_API_KEY),
  });
});

app.use('/api/apod', apodRoutes);
app.use('/api/epic', epicRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/weather', weatherRoutes);

app.use((req, res, next) => {
  next(new AppError('Route not found', 404, 'NOT_FOUND', true));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});