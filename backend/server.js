const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const apodRoutes = require('./routes/apodRoutes');
const epicRoutes = require('./routes/epicRoutes');
const imageRoutes = require('./routes/imageRoutes');
const marsRoutes = require('./routes/marsRoutes');
const neoRoutes = require('./routes/neoRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

function normalizeOrigin(value) {
  return String(value || '').trim().replace(/\/+$/, '').toLowerCase();
}

function parseAllowedOrigins(value) {
  return String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function matchesOriginRule(origin, rule) {
  const normalizedOrigin = normalizeOrigin(origin);
  const normalizedRule = normalizeOrigin(rule);

  if (normalizedRule === '*') {
    return true;
  }

  if (normalizedRule === normalizedOrigin) {
    return true;
  }

  if (normalizedRule.startsWith('*.')) {
    try {
      const hostname = new URL(origin).hostname.toLowerCase();
      return hostname.endsWith(normalizedRule.slice(1));
    } catch {
      return false;
    }
  }

  const wildcardProtocolRule = normalizedRule.match(/^(https?):\/\/\*\.(.+)$/);
  if (wildcardProtocolRule) {
    try {
      const [, protocol, suffix] = wildcardProtocolRule;
      const parsedOrigin = new URL(origin);
      return parsedOrigin.protocol === `${protocol}:`
        && parsedOrigin.hostname.toLowerCase().endsWith(`.${suffix}`);
    } catch {
      return false;
    }
  }

  return false;
}

const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);
const allowAllOrigins = process.env.CORS_ALLOW_ALL === 'true' || allowedOrigins.includes('*');

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowAllOrigins) {
      callback(null, true);
      return;
    }

    if (!isProduction && allowedOrigins.length === 0) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.some((rule) => matchesOriginRule(origin, rule))) {
      callback(null, true);
      return;
    }

    callback(new AppError('CORS blocked for this origin', 403, 'CORS_BLOCKED', true));
  },
  methods: ['GET', 'OPTIONS'],
};

if (allowAllOrigins) {
  logger.warn('CORS allow-all mode enabled via CORS_ALLOW_ALL/ALLOWED_ORIGINS=*');
} else if (isProduction && allowedOrigins.length === 0) {
  logger.warn('ALLOWED_ORIGINS is empty in production; browser calls will be blocked by CORS');
} else {
  logger.info('CORS configured', {
    mode: 'allowlist',
    allowedOrigins,
  });
}

if (!process.env.NASA_API_KEY) {
  logger.warn('NASA_API_KEY is missing; APOD/NEO/EPIC/Mars/Weather endpoints will fail');
}

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
    cors: {
      mode: allowAllOrigins ? 'allow-all' : 'allowlist',
      allowedOriginsCount: allowedOrigins.length,
    },
  });
});

app.use('/api/apod', apodRoutes);
app.use('/api/epic', epicRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/mars', marsRoutes);
app.use('/api/neo', neoRoutes);
app.use('/api/weather', weatherRoutes);

app.use((req, res, next) => {
  next(new AppError('Route not found', 404, 'NOT_FOUND', true));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});