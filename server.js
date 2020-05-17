const express = require('express');
const dotenv = require('dotenv');
//const logger = require('./middleware/logger'); we defined our custom middleware but we don't use it
const morgan = require('morgan');

//Initialise Routing files
const bootcamps = require('./routes/bootcamps');

//In order to use those config files we need to load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

//Mount logger
//app.use(logger);

//We want to run middleware only in Dev env.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
