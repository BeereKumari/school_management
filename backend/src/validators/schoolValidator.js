/**
 * School Validators
 * Description: express-validator rules and middleware for
 *              /addSchool and /listSchools endpoints.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

const { body, query, validationResult } = require('express-validator');

const addSchoolRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('School name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be 2–255 characters'),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 500 }).withMessage('Address must be 5–500 characters'),
  body('latitude')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
];

const listSchoolsRules = [
  query('latitude')
    .notEmpty().withMessage('Your latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('longitude')
    .notEmpty().withMessage('Your longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = { addSchoolRules, listSchoolsRules, validate };
