import express from "express"

import { signupUser, loginUser, forgotPassword, verifyCode, resetPassword, resendCode } from '../controllers/userController.js';
import { validateRequest } from '../middlewares/validate.js';
import { signupSchema, loginSchema, forgotPasswordSchema, verifyCodeSchema, resetPasswordSchema, resendCodeSchema } from '../validations/userValidation.js';

const router = express.Router();

// Signup route
router.post('/signup',validateRequest(signupSchema), signupUser);

// Login route
router.post('/login',validateRequest(loginSchema), loginUser);

// forgot password
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);

// verify code
router.post('/verify-code',validateRequest(verifyCodeSchema), verifyCode);

// reset password
router.post('/reset-password',validateRequest(resetPasswordSchema), resetPassword);

//resend code
router.post('/resend-code',validateRequest(resendCodeSchema), resendCode)

export default router;