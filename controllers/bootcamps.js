const Bootcamp = require('../models/Bootcamp');

// @desc         Get all bootcamps
// @route        GET /api/v1/bootcamps
// @access       Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc         Get one bootcamps with id
// @route        GET /api/v1/bootcamps/:id
// @access       Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    // we make a validation first if there is a bootcamp with that ID
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    //we returned abowe because if not it will try to send header secont time and crash the app
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc         Create new bootcamp
// @route        POST /api/v1/bootcamps
// @access       Private
exports.createBootcamp = async (req, res, next) => {
  //every mondoose function is async
  //here we handle rejection with trycatch but in the future, we will handle it with error handler middleware "async handler" so we will not need to define trycatch for each function.
  try {
    const newBootcamp = await Bootcamp.create(req.body);
    //we create a new bootcamp at database with given data at req.body and return reponse
    res.status(201).json({
      success: true,
      data: newBootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc         Update a bootcamp
// @route        PUT /api/v1/bootcamps/:id
// @access       Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

// @desc         Delete a bootcamp
// @route        DELETE /api/v1/bootcamps/:id
// @access       Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};
