const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/auth");
const userCntrl = require("../controllers/userController");
const { checkSchema } = require("express-validator");
const {
  userRegistrationValidation,
  userLoginValidation,
} = require("../validators/userValidations");

// @route   POST api/auth/register
// @desc    Register user
router.post(
  "/register",
  checkSchema(userRegistrationValidation),
  userCntrl.register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
//userLoginValidation
router.post("/login", checkSchema(userLoginValidation), userCntrl.login);

// @route   GET api/auth/user
// @desc    Get user data
router.get("/user", authenticationMiddleware, userCntrl.getUser);

module.exports = router;
