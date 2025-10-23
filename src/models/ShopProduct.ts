import mongoose, { Document, Schema } from 'mongoose';

export interface IShopProduct extends Document {
  title: string;
  description: string;
  logo_src: string;
  logo_alt: string;
  order_index: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShopProductSchema = new Schema<IShopProduct>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo_src: {
    type: String,
    required: true
  },
  logo_alt: {
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
ShopProductSchema.index({ order_index: 1 });
ShopProductSchema.index({ title: 1 });

export const ShopProduct = mongoose.model<IShopProduct>('ShopProduct', ShopProductSchema);
