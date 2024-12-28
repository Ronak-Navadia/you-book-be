import User from '../models/userModel.js';
import redisClient from "../config/redisClient.js";
import bcrypt from "bcryptjs";

// Find user by email
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// Create a new user
const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

// Save verification code and its expiration
const saveVerificationCodeInRedis = async (email, code) => {
    const redisKey = `forgotPasswordCode:${email}`;
    const expirationTime = 5 * 60;
    await redisClient.set(redisKey, code, 'EX', expirationTime);
};

// Get verification code from Redis
const getVerificationCodeFromRedis = async (email) => {
    const redisKey = `forgotPasswordCode:${email}`;
    const code = await redisClient.get(redisKey);
    return code ? parseInt(code, 10) : null;
};

const deleteVerificationCodeFromRedis = async (email) => {
    const redisKey = `forgotPasswordCode:${email}`;
    await redisClient.del(redisKey)
}

// Reset password
const resetPassword = async (email, newPassword) => {
    // NOTE: I could have also use getUser and then save() to fire the pre-save event for hashing password but it got bit slower, while findOneAndUpdate gives performance.
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await User.findOneAndUpdate(
        { email },
        { $set: { password: hashedPassword } },
        { new: true }
    );
};

export default {
    findUserByEmail,
    createUser,
    saveVerificationCodeInRedis,
    getVerificationCodeFromRedis,
    deleteVerificationCodeFromRedis,
    resetPassword
}