import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    age: {
        type: Number,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

// Exclude password,  from query results
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret._id;
        return ret;
    },
});

// Exclude password from query results
userSchema.set('toObject', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret._id;
        return ret;
    }
});

// Export the model
const User = mongoose.model('User', userSchema);

export default User;
