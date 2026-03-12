const express = require('express')
const router = express.Router();
const User = require('../model/user')
const { registerPost, loginPost } = require('../controllers/user.controller');


// post register user route
router.post("/register", registerPost);

// login post route
router.post("/login", loginPost)

module.exports = router