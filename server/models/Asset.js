import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryName: { type: String, required: true },
  location: { type: String, required: true },
  totalValueUSD: { type: Number, required: true },
  fractionPriceBOT: { type: Number, required: true },
  fractionPriceUSDT: { type: Number, required: true },
  totalFractions: { type: Number, required: true },
  availableFractions: { type: Number, required: true },
  apy: { type: Number, required: true },
  riskScore: { type: String, required: true },
  telemetryType: { type: String },
  telemetryCurrentValue: { type: String },
  telemetryUnit: { type: String },
  verifier: { type: String },
  spvDocumentHash: { type: String },
  contractAddress: { type: String, required: true },
  description: { type: String },
  features: { type: [String], default: [] },
  imageUrl: { type: String },
  submitterAddress: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'live', 'rejected'] },
  approvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Asset', AssetSchema);
