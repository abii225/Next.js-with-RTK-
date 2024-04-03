const jwt = require("jsonwebtoken");
require("dotenv").config();

function validator(req, res, next) {
  let data = req.body;

  const { password } = data;
  if (password.length < 8) {
    return res.status(200).json({ msg: "Password should be atleast 8" });
  } else if (!username.length) {
    return res.status(200).json({ msg: "Empty fields not allowed" });
  }
  next();
}

function tokenValidator(req, res, next) {
  let token = req.headers.authorization.split(" ")[1];

  if (token) {
    const key = process.env.key;
  }
}

module.exports = { validator };
