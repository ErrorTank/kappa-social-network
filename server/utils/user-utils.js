const getUnverifiedUserRegisterType = user => {
  return user.contact.login_username.phone ? "PHONE" : "EMAIL";
};

const getSameFriends = (user1Friends, user2Friens) => {
  return user1Friends.filter(each => user2Friens.includes(each))
}

module.exports = {
  getUnverifiedUserRegisterType,
  getSameFriends
};