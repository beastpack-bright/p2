const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { create } = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
require('dotenv').config();
const routes = require('./routes');

const port = process.env.PORT || 3000;

const redisClient = createClient({
  url: process.env.REDISCLOUD_URL || process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    tls: process.env.NODE_ENV === 'production',
    rejectUnauthorized: false,
  }
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
  const app = express();

  // Middleware setup
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

  // Session setup
  app.use(session({
    key: 'sessionid',
    store: new RedisStore({
      client: redisClient,
    }),
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }));

  // Handlebars setup
  const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
  });

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, '../views'));
  app.enable('trust proxy');

  // MongoDB connection
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

  // Routes
  app.use('/', routes);

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`WolfChat is running on port ${port}`);
  });
});
