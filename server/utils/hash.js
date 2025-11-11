const bcrypt = require('bcryptjs');

const hashPassword = async (plain) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plain, salt);
};

const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash); // returns true/false
};

module.exports = { hashPassword, comparePassword };
