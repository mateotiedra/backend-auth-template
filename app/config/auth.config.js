require('dotenv').config();

module.exports = {
  // Generated here : https://www.grc.com/passwords.htm
  secret: process.env.JWT_SECRET,
};
