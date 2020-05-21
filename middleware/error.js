const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //Log to the console for dev
  console.log(err);

  //Mongoose bad abjectID
  if (err.name === 'CastError') {
    const message = `Bootcamp not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose Dublicate Error
  if (err.code === 11000) {
    const message = 'Dublicate field valeue entered';
    error = new ErrorResponse(message, 400);
  }

  //Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
