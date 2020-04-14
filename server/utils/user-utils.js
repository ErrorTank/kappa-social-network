const getUnverifiedUserRegisterType = user => {
  return user.contact.login_username.phone ? "PHONE" : "EMAIL";
};

module.exports = {
  getUnverifiedUserRegisterType
};