const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

const registerValidationRules = [
    check('firstName').exists().withMessage('First Name is required.'),
    check('lastName').exists().withMessage('Last Name is required.'),
    check('email').isEmail().withMessage('Must be a email'),
    check('password').isLength({min: 6}).withMessage('Password must be of 6 chars.')
]

const loginValidationRules = [
    check('email').isEmail().withMessage('Must be a email'),
    check('password').isLength({min: 6}).withMessage('Password must be of 6 chars.')
]


//  /auth/register -> Register a user
router.post('/register', registerValidationRules, authController.register);

//  /auth/login -> Login a user
router.post('/login', loginValidationRules, authController.login);

module.exports = router;