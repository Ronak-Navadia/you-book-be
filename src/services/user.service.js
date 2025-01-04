import User from "../models/user.model.js";
import redisClient from "../config/redisClient.js";
import bcrypt from "bcryptjs";

// Find user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Create a new user
export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// Save verification code and its expiration
export const saveVerificationCodeInRedis = async (email, code) => {
  const redisKey = `forgotPasswordCode:${email}`;
  const expirationTime = 5 * 60;
  await redisClient.set(redisKey, code, "EX", expirationTime);
};

// Get verification code from Redis
export const getVerificationCodeFromRedis = async (email) => {
  const redisKey = `forgotPasswordCode:${email}`;
  const code = await redisClient.get(redisKey);
  return code ? parseInt(code, 10) : null;
};

export const deleteVerificationCodeFromRedis = async (email) => {
  const redisKey = `forgotPasswordCode:${email}`;
  await redisClient.del(redisKey);
};

// Reset password
export const resetUserPassword = async (email, newPassword) => {
  // NOTE: I could have also use getUser and then save() to fire the pre-save event for hashing password but it got bit slower, while findOneAndUpdate gives performance.
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await User.findOneAndUpdate(
    { email },
    { $set: { password: hashedPassword } },
    { new: true }
  );
};
