const getUnverifiedUserRegisterType = user => {
  return user.contact.login_username.phone ? "PHONE" : "EMAIL";
};

const getSameFriends = (user1Friends, user2Friends) => {
  return user1Friends.filter(each => user2Friends.includes(each))
}

module.exports = {
  getUnverifiedUserRegisterType,
  getSameFriends
};