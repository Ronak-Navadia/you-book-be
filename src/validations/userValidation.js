import Joi from 'joi';

// Reusable validation for common fields
const emailValidation = Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
});

const passwordValidation = Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
});

const codeValidation = Joi.number().min(1000).max(9999).required().messages({
    'number.empty': 'Code is required',
    'number.min': 'Code must be at least 1000',
    'number.max': 'Code must be less than 10000',
});

const nameValidation = Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be less than 50 characters',
});

const ageValidation = Joi.number().integer().min(0).optional().messages({
    'number.min': 'Age must be a positive number',
});

// Schema for user signup validation
export const signupSchema = Joi.object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    age: ageValidation,
});

// Schema for user login validation
export const loginSchema = Joi.object({
    email: emailValidation,
    password: passwordValidation,
});

// Schema for user forgot password validation
export const forgotPasswordSchema = Joi.object({
    email: emailValidation,
});

// Schema for user reset password validation
export const resetPasswordSchema = Joi.object({
    email: emailValidation,
    code: codeValidation,
    password: passwordValidation,
    confirmPassword: Joi.string().min(6).required().messages({
        'string.empty': 'Confirm Password is required',
        'string.min': 'Password must be at least 6 characters',
    }),
}).custom((value, helper) => {
    if (value.password !== value.confirmPassword) {
        return helper.message("Passwords don't match");
    }
    return value;
});

// Schema for user verify code validation
export const verifyCodeSchema = Joi.object({
    email: emailValidation,
    code: codeValidation,
});

// Schema for user resend code validation
export const resendCodeSchema = Joi.object({
    email: emailValidation,
});
