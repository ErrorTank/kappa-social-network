const handlers = {
  Error: (res, error) => res.status(400).json({
    message: error.message,
    extra: error.extra
  }),
  DBError: (res, error) => res.status(500).json({
    message: error.message,
    extra: error.extra
  }),
  AuthorizationError: (res, error) => res.status(401).json({
    message: error.message,
    extra: error.extra
  }),
  ApplicationError: (res, error) => res.status(400).json({
    message: error.message,
    extra: error.extra
  }),
  JWTError: (res, error) => res.status(400).json({
    message: error.message,
    extra: error.extra
  }),
  TokenExpiredError: (res, error) => res.status(400).json({
    message: "token_expired",
    extra: error.extra
  })
};

module.exports = (err, req, res, next) => {
  console.log(err);
  const errorHandler = handlers[err.name] || null;
  if (errorHandler) {

    errorHandler(res, err);
  } else {
    next();
  }
};
