const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async'); //we will get rid of try catch blocks by this
const User = require('../models/User');

// @desc         Register User
// @route        POST /api/v1/auth/register
// @access       Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
  // If you grab the token at response and paste into the jwt.io you can see the header payload and sign
});

// @desc         Login User
// @route        POST /api/v1/auth/login
// @access       Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate the email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for the user
  const user = await User.findOne({ email }).select('+password'); //We defined password.select: false in the model but here we want it included in order to validate user if he login
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401)); //401 for Unauthorized
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken(); //We don't use User.blabla becouse it isn't a static method.

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //we want cookie only be awailable to access by client side scripts
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true; //In production env we send coocie in https
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token, //we also send token itself in json
  });
};

// @desc         Current Logged User
// @route        POST /api/v1/auth/me
// @access       Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
