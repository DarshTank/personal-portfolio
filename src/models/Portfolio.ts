import mongoose, { Model } from "mongoose";
import { Portfolio, Section } from "@/app/types/portfolio";

const sectionSchema = new mongoose.Schema<Section>({
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }
});

// Omit the id field from Portfolio when extending Document
type PortfolioDocumentProps = Omit<Portfolio, 'id'>;

interface PortfolioDocument extends PortfolioDocumentProps, mongoose.Document {
  id: string; // Add it back as a string
}

interface PortfolioModel extends Model<PortfolioDocument> {
  findByUserId(userId: string): Promise<PortfolioDocument[]>;
  findPublished(): Promise<PortfolioDocument[]>;
}

const portfolioSchema = new mongoose.Schema<PortfolioDocument>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    sections: { type: [sectionSchema], default: [] },
    isPublished: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add indexes for better query performance
portfolioSchema.index({ userId: 1 });
portfolioSchema.index({ isPublished: 1 });

// Add static methods
portfolioSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId });
};

portfolioSchema.statics.findPublished = function () {
  return this.find({ isPublished: true });
};

// Create or update the model
let PortfolioModel: PortfolioModel;

try {
  // Try to get the existing model
  PortfolioModel = mongoose.model<PortfolioDocument, PortfolioModel>("Portfolio");
} catch {
  // Model doesn't exist, create it
  PortfolioModel = mongoose.model<PortfolioDocument, PortfolioModel>("Portfolio", portfolioSchema);
}

export { PortfolioModel };