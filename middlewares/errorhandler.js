const notFound = (req, res, next) => {
  res.status(404).json({
    message: "This route is not defined",
  });
};

const errorHandler = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,  
  });
};

module.exports = { notFound, errorHandler };
