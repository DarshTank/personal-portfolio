import mongoose from "mongoose";
import { Portfolio } from "@/app/types/portfolio";

const portfolioSchema = new mongoose.Schema<Portfolio>(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    role: { type: String, required: true },
    brandTitle: { type: String, required: true },
    email: { type: String, required: true },
    about: { type: String, required: true },
    linkedin: { type: String },
    github: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    resumeUrl: { type: String },
    template: { type: String, required: true },
    sections: [
      {
        type: {
          type: String,
          enum: ["hero", "about", "skills", "projects", "experience", "education", "contact"],
          required: true,
        },
        title: String,
        content: mongoose.Schema.Types.Mixed,
        order: Number,
        isVisible: Boolean,
      },
    ],
    isPublished: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
portfolioSchema.index({ userId: 1 });
portfolioSchema.index({ isPublished: 1 });

// Add methods
portfolioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Add static methods
portfolioSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId });
};

portfolioSchema.statics.findPublished = function () {
  return this.find({ isPublished: true });
};

export const PortfolioModel = mongoose.models.Portfolio || mongoose.model<Portfolio>("Portfolio", portfolioSchema); 