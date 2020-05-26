const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async'); //we will get rid of try catch blocks by this
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc         Get all bootcamps
// @route        GET /api/v1/bootcamps
// @access       Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc         Get one bootcamps with id
// @route        GET /api/v1/bootcamps/:id
// @access       Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  // we make a validation first if there is a bootcamp with that ID
  if (!bootcamp) {
    return next(
      //id true formatted but actually not exist in DB
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  //we returned above because if not it will try to send header secont time and crash the app
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc         Create new bootcamp
// @route        POST /api/v1/bootcamps
// @access       Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //every mondoose function is async
  //here we handle rejection with trycatch but in the future, we will handle it with error handler middleware "async handler" so we will not need to define trycatch for each function.

  const newBootcamp = await Bootcamp.create(req.body);
  //we create a new bootcamp at database with given data at req.body and return reponse
  res.status(201).json({
    success: true,
    data: newBootcamp,
  });
});

// @desc         Update a bootcamp
// @route        PUT /api/v1/bootcamps/:id
// @access       Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      //id true formatted but actually not exist in DB
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc         Delete a bootcamp
// @route        DELETE /api/v1/bootcamps/:id
// @access       Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      //id true formatted but actually not exist in DB
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc         Get Bootcamp within a radius
// @route        GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access       Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radians
  //Divide distance by radius of earth
  //Earth radius = 3,963 mile / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc         Upload a foto for bootcamp
// @route        PUT /api/v1/bootcamps/:id/photo
// @access       Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }
  const file = req.files.file;

  //Make sure that image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  //Check File Size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //create a custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  //Save Files
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with upload photo`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
