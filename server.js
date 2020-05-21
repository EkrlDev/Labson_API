const express = require('express');
const dotenv = require('dotenv');
//const logger = require('./middleware/logger'); we defined our custom middleware but we don't use it
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

//In order to use those config files we need to load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Initialise Routing files
const bootcamps = require('./routes/bootcamps');

const app = express();

//Body parser. No longer do we have to use seperate body parser we handle it in express
app.use(express.json());

//Mount logger
//app.use(logger);

//We want to run middleware only in Dev env.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

//Error handler must be declared under routers so it can catch the errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Global handler for unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  //Close server and exit process
  server.close(() => process.exit(1));
});
