const advancedResults = (model, populate) => async (req, res, next) => {
  //This is shorthand for putting a fuction inside of a function

  let query;

  //copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude. if not reqQuery will search also by this fields in data and fail
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  console.log(reqQuery);

  //We add $ sign by regex, in fron of the "gt, gte, lt, lte, in" terms  for making a query string
  //we will use "in" for searching in arrays while making filterings
  let queryString = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  //Finding resource
  query = model.find(JSON.parse(queryString));

  //Select Fields Attention!! we are not selecting from reqQuery instead req.query
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25; //25 for page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //Executing query
  const results = await query;

  //Pgination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};
module.exports = advancedResults;
