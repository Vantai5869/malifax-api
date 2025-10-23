import mongoose, { Document, Schema } from 'mongoose';

export interface IPartner extends Document {
  name: string;
  logo_src: string;
  website_url: string;
  alt_text: string;
  order_index: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo_src: {
    type: String,
    required: true
  },
  website_url: {
    type: String,
    required: true
  },
  alt_text: {
    type: String,
    required: true
  },
  order_index: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
PartnerSchema.index({ order_index: 1 });
PartnerSchema.index({ name: 1 });

export const Partner = mongoose.model<IPartner>('Partner', PartnerSchema);
