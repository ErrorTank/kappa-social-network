const assignIn = require("lodash/assignIn");

const CustomError = (name) => {
  return class extends Error{
    constructor(message = 'Kappa error', extra = null){
      super(message);
      Error.captureStackTrace(this, this.constructor);
      this.name = name;
      this.extra = extra;

    }
  }
};

module.exports = {
  AuthorizationError: CustomError("AuthorizationError"),
  ApplicationError: CustomError("ApplicationError"),
  OperatorError: CustomError("OperatorError"),
  DBError: CustomError("DBError"),
  JWTError: CustomError("JWTError")
};
