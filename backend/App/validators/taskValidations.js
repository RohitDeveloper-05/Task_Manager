const createTaskValidations = {
  title: {
    exists: {
      errorMessage: "title field is required",
    },
    notEmpty: {
      errorMessage: "title field must not be empty",
    },
    trim: true,
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "title field value length must be smaller than 100",
    },
  },
  description: {
    optional: true,
    isLength: {
      options: { max: 500 },
      errorMessage: "description field value length must be smaller than 500",
    },
  },
};

const getSingleTaskValidations = {
  id: {
    in: ["params"],
    isMongoId: {
      errorMessage: "must be a mongoId",
    },
  },
};

const deleteTaskValidations = {
  id: {
    in: ["params"],
    isMongoId: {
      errorMessage: "must be a mongoId",
    },
  },
};

const updateTaskValidations = {
  id: {
    in: ["params"],
    isMongoId: {
      errorMessage: "must be a mongoId",
    },
  },
};

module.exports = {
  createTaskValidations,
  updateTaskValidations,
  deleteTaskValidations,
  getSingleTaskValidations,
};
