import jwt from 'jsonwebtoken';
import geoip from 'geoip-lite';
import crypto from "crypto";

// Generate token
export const generateToken = (userId, email) => {
    return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Get user location
export const getUserLocation = (req) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Handle localhost IPs
    if (ip === '127.0.0.1' || ip === '::1') {
        return 'Localhost (Location unavailable)';
    }
    
    const geo = geoip.lookup(ip);
    return geo ? `${geo.city}, ${geo.country}` : 'Unknown';
};

// Generate a random 4-digit code
export const generateVerificationCode = () => {
    return crypto.randomInt(1000, 9999).toString();
}