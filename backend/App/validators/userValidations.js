const userRegistrationValidation = {
  username: {
    exists: {
      errorMessage: "username field is required",
    },
    notEmpty: {
      errorMessage: "username field must have some value",
    },
    trim: true,
    isLength: {
      options: { min: 3, max: undefined },
      errorMessage: "username field value must be length greater than 3",
    },
  },
  email: {
    exists: {
      errorMessage: "email field is required",
    },
    notEmpty: {
      errorMessage: "email field must have some value",
    },
    trim: true,
    normalizeEmail: true,
    isEmail: {
      errorMessage: "email value must be in valid email format",
    },
  },
  password: {
    exists: {
      errorMessage: "password field is required",
    },
    notEmpty: {
      errorMessage: "password field must have some value",
    },
    isLength: {
      options: { min: 8, max: 128 },
      errorMessage: "password field value must be between 8-128 characters",
    },
    isStrongPassword: {
      errorMessage:
        "password must have atleast one uppercase, one number and one special character",
    },
  },
};

const userLoginValidation = {
  email: {
    exists: {
      errorMessage: "email field is required",
    },
    notEmpty: {
      errorMessage: "email field must have some value",
    },
    isEmail: {
      errorMessage: "email value must be in valid email format",
    },
  },
  password: {
    exists: {
      errorMessage: "password field is required",
    },
    notEmpty: {
      errorMessage: "password field must have some value",
    },
  },
};

module.exports = {
  userRegistrationValidation,
  userLoginValidation,
};

// [
//   body("username", "Username is required").not().isEmpty(),
//   body("email", "Please include a valid email").isEmail(),
//   body(
//     "password",
//     "Please enter a password with 6 or more characters"
//   ).isLength({ min: 6 }),
// ];
