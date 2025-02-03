import {
    findUserByEmail,
    createUser,
    saveVerificationCodeInRedis,
    resetUserPassword,
    getVerificationCodeFromRedis,
    deleteVerificationCodeFromRedis,
} from "../services/user.service.js";
import {
    generateToken,
    getUserLocation,
    generateVerificationCode,
} from "../helpers/utils.js";
import { sendMail } from "../services/mail.service.js";

// Signup User API
export const signupUser = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        // Get user location
        const location = getUserLocation(req);

        // Check if the user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({ code: 0, message: "User already exists" });
        }

        // Create new user
        const user = await createUser({ name, email, password, age, location });

        // Convert to plain object and remove internal Mongoose properties
        const userData = user.toObject();

        // Generate JWT and store in user
        const token = generateToken(user._id, user.email);
        userData.token = token;

        res.status(201).json({
            code: 1,
            message: "User registered successfully",
            data: userData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

// Login User API
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ code: 0, message: "User not found" });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ code: 0, message: "Invalid email or password" });
        }

        // Convert to plain object and remove internal Mongoose properties
        const userData = user.toObject();

        // Generate JWT and store in userData
        const token = generateToken(user._id, user.email);
        userData.token = token;

        res.status(200).json({
            code: 1,
            message: "Login successful",
            data: userData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

// Forgot Password API
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user)
            return res.status(404).json({ code: 0, message: "User not found" });

        const code = generateVerificationCode();
        await saveVerificationCodeInRedis(email, code);

        // Mock sending email
        await sendMail(
            email,
            "Reset Your Password",
            "verification-code.template",
            {
                code,
            }
        );
        console.log(`Verification code sent to ${email}: ${code}`);

        res.status(200).json({
            code: 1,
            message: `Verification code sent to email ${email} and code is ${code}`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

// Reset Password API
export const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        await resetUserPassword(email, password);

        res.status(200).json({ code: 1, message: "Password reset successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

// Verify Code API
export const verifyCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const savedCode = await getVerificationCodeFromRedis(email);
        if (!savedCode || savedCode !== code) {
            return res
                .status(400)
                .json({
                    code: 0,
                    message: "Invalid or expired verification code",
                });
        }

        deleteVerificationCodeFromRedis(email);

        res.status(200).json({ code: 1, message: "Code verified" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

// Resend Code API
export const resendCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user)
            return res.status(404).json({ code: 0, message: "User not found" });

        const code = generateVerificationCode();
        await saveVerificationCodeInRedis(email, code);

        // Mock sending email
        console.log(`Verification code sent to ${email}: ${code}`);

        res.status(200).json({
            code: 1,
            message: `New Verification code sent to email ${email} and code is ${code}`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};
