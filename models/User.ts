import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username cannot be longer than 20 characters"],
    match: [/^[a-z][a-z0-9_]*$/, "Username can only contain lowercase letters, numbers, and underscores, and must start with a letter"],
    validate: {
      validator: function(v: string) {
        const reservedWords = ['admin', 'root', 'system', 'user', 'test'];
        return !reservedWords.includes(v.toLowerCase());
      },
      message: "This username is not allowed"
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    select: false,
  },
  verificationCodeExpires: {
    type: Date,
    select: false,
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpires: {
    type: Date,
    select: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Generate verification code
userSchema.methods.generateVerificationCode = function() {
  const code = crypto.randomInt(100000, 999999).toString();
  this.verificationCode = code;
  this.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  return code;
};

// Clear verification code
userSchema.methods.clearVerificationCode = function() {
  this.verificationCode = undefined;
  this.verificationCodeExpires = undefined;
};

// Check if verification code is valid
userSchema.methods.isVerificationCodeValid = function(code: string) {
  if (!this.verificationCode || !this.verificationCodeExpires) {
    return false;
  }
  
  if (this.verificationCodeExpires < new Date()) {
    this.clearVerificationCode();
    return false;
  }
  
  return this.verificationCode === code;
};

// Generate reset password token
userSchema.methods.generateResetPasswordToken = function() {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = token;
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return token;
};

// Clear reset password token
userSchema.methods.clearResetPasswordToken = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

// Check if reset password token is valid
userSchema.methods.isResetPasswordTokenValid = function(token: string) {
  if (!this.resetPasswordToken || !this.resetPasswordExpires) {
    return false;
  }
  
  if (this.resetPasswordExpires < new Date()) {
    this.clearResetPasswordToken();
    return false;
  }
  
  return this.resetPasswordToken === token;
};

// Cleanup expired tokens and codes
userSchema.methods.cleanupExpiredTokens = function() {
  const now = new Date();
  
  if (this.verificationCodeExpires && this.verificationCodeExpires < now) {
    this.clearVerificationCode();
  }
  
  if (this.resetPasswordExpires && this.resetPasswordExpires < now) {
    this.clearResetPasswordToken();
  }
};

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema); 