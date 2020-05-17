// @desc         Get all bootcamps
// @route        GET /api/v1/bootcamps
// @access       Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

// @desc         Get one bootcamps with id
// @route        GET /api/v1/bootcamps/:id
// @access       Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp with id ${req.params.id}` });
};

// @desc         Create new bootcamp
// @route        POST /api/v1/bootcamps
// @access       Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Created bootcamp with id ${req.params.id}`,
  });
};

// @desc         Update a bootcamp
// @route        PUT /api/v1/bootcamps/:id
// @access       Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Updated bootcamp with id ${req.params.id}`,
  });
};

// @desc         Delete a bootcamp
// @route        DELETE /api/v1/bootcamps/:id
// @access       Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Deleted bootcamp with id ${req.params.id}`,
  });
};
