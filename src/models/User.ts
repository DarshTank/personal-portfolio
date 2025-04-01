import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  isEmailVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationCode(): string;
  clearVerificationCode(): void;
  isVerificationCodeValid(code: string): boolean;
  generateResetPasswordToken(): string;
  clearResetPasswordToken(): void;
  isResetPasswordTokenValid(token: string): boolean;
  cleanupExpiredTokens(): void;
}

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
  resetPasswordTokenExpires: {
    type: Date,
    select: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate verification code
userSchema.methods.generateVerificationCode = function(): string {
  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
  this.verificationCode = code;
  this.verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return code;
};

// Clear verification code
userSchema.methods.clearVerificationCode = function(): void {
  this.verificationCode = undefined;
  this.verificationCodeExpires = undefined;
};

// Check if verification code is valid
userSchema.methods.isVerificationCodeValid = function(code: string): boolean {
  if (!this.verificationCode || !this.verificationCodeExpires) {
    return false;
  }

  if (this.verificationCodeExpires < new Date()) {
    return false;
  }

  return this.verificationCode === code.toUpperCase();
};

// Generate reset password token
userSchema.methods.generateResetPasswordToken = function(): string {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return token;
};

// Clear reset password token
userSchema.methods.clearResetPasswordToken = function(): void {
  this.resetPasswordToken = undefined;
  this.resetPasswordTokenExpires = undefined;
};

// Check if reset password token is valid
userSchema.methods.isResetPasswordTokenValid = function(token: string): boolean {
  if (!this.resetPasswordToken || !this.resetPasswordTokenExpires) {
    return false;
  }

  if (this.resetPasswordTokenExpires < new Date()) {
    return false;
  }

  return this.resetPasswordToken === token;
};

// Cleanup expired tokens and codes
userSchema.methods.cleanupExpiredTokens = function(): void {
  const now = new Date();
  if (this.verificationCodeExpires && this.verificationCodeExpires < now) {
    this.clearVerificationCode();
  }
  if (this.resetPasswordTokenExpires && this.resetPasswordTokenExpires < now) {
    this.clearResetPasswordToken();
  }
};

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);