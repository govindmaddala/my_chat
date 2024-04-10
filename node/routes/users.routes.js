const express = require('express');
const { register, login, logout, allusers, verifyWithToken } = require('../controllers/Users.controller');
const { protect } = require('../middleware/authMiddleware');
const route = express.Router()


route.post("/register", register)
route.post("/login", login)
route.post("/logout", logout)
route.route("/allusers").get(protect, allusers)
route.route("/verifyWithToken").get(verifyWithToken)
// route.route("/allusers").get(allusers)

module.exports = route;