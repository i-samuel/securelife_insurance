const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors from express-validator chains
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed.',
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

/**
 * Lead Validation & Sanitization Middleware
 */
const validateLead = [
  body('firstName').trim().notEmpty().withMessage('First name is required.').escape(),
  body('lastName').trim().notEmpty().withMessage('Last name is required.').escape(),
  body('email').trim().isEmail().withMessage('A valid email address is required.').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().escape(),
  body('occupation').optional({ checkFalsy: true }).trim().escape(),
  body('requestedCoverage')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Requested coverage must be a positive number.'),
  body('requestedPolicyTerm')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Requested policy term must be at least 1 year.'),
  body('monthlyBudget')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Monthly budget must be a positive number.'),
  body('dateOfBirth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format.')
    .custom((val) => {
      if (new Date(val) > new Date()) {
        throw new Error('Date of birth cannot be in the future.');
      }
      return true;
    }),
  validate,
];

/**
 * Auth Login Validation Middleware
 */
const validateLogin = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
];

/**
 * User Creation Validation Middleware (Admin)
 */
const validateCreateUser = [
  body('firstName').trim().notEmpty().withMessage('First name is required.').escape(),
  body('lastName').trim().notEmpty().withMessage('Last name is required.').escape(),
  body('email').trim().isEmail().withMessage('A valid email address is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('roleId').isInt().withMessage('Valid role ID is required.'),
  validate,
];

/**
 * Insurance Plan Validation & Limit Checks Middleware (Admin)
 */
const validatePlan = [
  body('name').trim().notEmpty().withMessage('Plan name is required.').escape(),
  body('slug').trim().notEmpty().withMessage('Plan slug is required.').toLowerCase(),
  body('minAge').isInt({ min: 0 }).withMessage('Minimum age must be 0 or greater.'),
  body('maxAge')
    .isInt()
    .withMessage('Maximum age is required.')
    .custom((maxAge, { req }) => {
      if (parseInt(maxAge, 10) < parseInt(req.body.minAge, 10)) {
        throw new Error('Maximum age must be greater than or equal to minimum age.');
      }
      return true;
    }),
  body('minCoverage').isFloat({ min: 0 }).withMessage('Minimum coverage must be a non-negative number.'),
  body('maxCoverage')
    .isFloat()
    .withMessage('Maximum coverage is required.')
    .custom((maxCoverage, { req }) => {
      if (parseFloat(maxCoverage) < parseFloat(req.body.minCoverage)) {
        throw new Error('Maximum coverage must be greater than or equal to minimum coverage.');
      }
      return true;
    }),
  body('minPolicyTerm').isInt({ min: 1 }).withMessage('Minimum policy term must be at least 1 year.'),
  body('maxPolicyTerm')
    .isInt()
    .withMessage('Maximum policy term is required.')
    .custom((maxTerm, { req }) => {
      if (parseInt(maxTerm, 10) < parseInt(req.body.minPolicyTerm, 10)) {
        throw new Error('Maximum policy term must be greater than or equal to minimum term.');
      }
      return true;
    }),
  body('minPremium').isFloat({ min: 0 }).withMessage('Minimum premium must be non-negative.'),
  body('maxPremium')
    .isFloat()
    .withMessage('Maximum premium is required.')
    .custom((maxPremium, { req }) => {
      if (parseFloat(maxPremium) < parseFloat(req.body.minPremium)) {
        throw new Error('Maximum premium must be greater than or equal to minimum premium.');
      }
      return true;
    }),
  validate,
];

module.exports = {
  validateLead,
  validateLogin,
  validateCreateUser,
  validatePlan,
};
