const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateGamesInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.platform = !isEmpty(data.platform) ? data.platform : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Title field is required';
  }

  if (Validator.isEmpty(data.platform)) {
    errors.platform = 'Platform field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
