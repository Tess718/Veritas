import express from 'express';
import Asset from '../models/Asset.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Read deployed contracts json to seed correct addresses
const deployedPath = join(__dirname, '../../src/constants/deployedContracts.json');
let tokens = {};
try {
  const fileData = readFileSync(deployedPath, 'utf8');
  tokens = JSON.parse(fileData).tokens || {};
} catch (e) {
  console.warn('⚠️ Could not load deployedContracts.json for seeding');
}

const DEFAULT_SEEDS = [
  {
    name: 'Manhattan DePIN H100 GPU Supercluster',
    category: 'depin_gpu',
    categoryName: 'DePIN AI Compute',
    location: 'New York, USA',
    totalValueUSD: 4500000,
    fractionPriceBOT: 0.1,
    fractionPriceUSDT: 0.02,
    totalFractions: 45000000,
    availableFractions: 15700000,
    apy: 14.2,
    imageUrl: '/assets/depin_gpu.png',
    riskScore: 'AA+',
    telemetryType: 'GPU Load & Compute',
    telemetryCurrentValue: '94.8',
    telemetryUnit: '% Utilization',
    verifier: 'Compute Telemetry Oracle',
    spvDocumentHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    contractAddress: tokens['asset-gpu-1'] || '0xB19fE5557b00bB4BdE5b7F0d8e3d3599fa3A5CDB',
    description: 'High-density cluster of 256 NVIDIA H100 SXM5 GPUs dedicated to compute workloads and inference tasks on BOT Chain. Earns real-time rental yield paid per compute second.',
    features: [
      '24/7 Real-Time Hardware Telemetry',
      'Direct API Rental Revenue Stream',
      'Automated Monthly BOT Buyback',
      'Insured Hardware SPV Vault'
    ],
    status: 'live'
  },
  {
    name: 'Sahara CyberGrid Solar Farm Phase II',
    category: 'solar_farm',
    categoryName: 'Green DePIN Energy',
    location: 'Atacama, Chile',
    totalValueUSD: 3200000,
    fractionPriceBOT: 0.08,
    fractionPriceUSDT: 0.016,
    totalFractions: 40000000,
    availableFractions: 15800000,
    apy: 11.8,
    imageUrl: '/assets/solar_farm.png',
    riskScore: 'AAA',
    telemetryType: 'Power Output (kW)',
    telemetryCurrentValue: '4,820',
    telemetryUnit: 'kW Output',
    verifier: 'Solar Energy Telemetry Feed',
    spvDocumentHash: 'QmZtrP69WnZg4n2yG8mZ6H4W1yR9bK8m3n2v1x9y8z7w6',
    contractAddress: tokens['asset-solar-1'] || '0xd049Ea61FBD1edCa2f344fd4F784087A0EA1Ce34',
    description: '50MW solar energy generation infrastructure feeding power to regional data centers. Smart IoT energy meters transmit verifiable generation data onto BOT Chain.',
    features: [
      'On-Chain IoT Energy Metering',
      '15-Year Guaranteed Off-Take PPA',
      'Verified Carbon Offset Attributes',
      'Dynamic Energy Pricing Router'
    ],
    status: 'live'
  },
  {
    name: 'Tokyo Ginza Financial Center Tower',
    category: 'real_estate',
    categoryName: 'Institutional Real Estate',
    location: 'Ginza, Tokyo, Japan',
    totalValueUSD: 6800000,
    fractionPriceBOT: 0.12,
    fractionPriceUSDT: 0.024,
    totalFractions: 56666666,
    availableFractions: 16250000,
    apy: 8.5,
    imageUrl: '/assets/tokyo_tower.png',
    riskScore: 'AAA',
    telemetryType: 'Occupancy Rate',
    telemetryCurrentValue: '98.5',
    telemetryUnit: '% Occupancy',
    verifier: 'SPV Custody Auditor',
    spvDocumentHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    contractAddress: tokens['asset-re-1'] || '0x8e1F48A09cDEF90C36713672A875bAb4B821f12c',
    description: 'Prime Grade-A commercial skyscraper in central Tokyo occupied by global financial institutions and technology firms. Rental revenue feeds directly into dividend payout streams.',
    features: [
      'Prime Financial District Property',
      'Long-Term Corporate Leases',
      'Quarterly Property Appraisal',
      'Liquidity Pool Support on BDEX'
    ],
    status: 'live'
  },
  {
    name: 'U.S. Short-Term Treasury Reserve Vault',
    category: 'treasury',
    categoryName: 'Government Debt Vault',
    location: 'Delaware SPV, USA',
    totalValueUSD: 10000000,
    fractionPriceBOT: 0.05,
    fractionPriceUSDT: 0.01,
    totalFractions: 200000000,
    availableFractions: 72000000,
    apy: 5.2,
    imageUrl: '/assets/treasury_vault.png',
    riskScore: 'AAA',
    telemetryType: 'Yield Collateral',
    telemetryCurrentValue: '100',
    telemetryUnit: '% Collateral Backed',
    verifier: 'Bank Custody Attestation',
    spvDocumentHash: 'QmPZ9GcBqR7M3W4nK6v8yX1z2A3b4C5d6E7f8g9h0i1j2',
    contractAddress: tokens['asset-tbill-1'] || '0x221F49f107901bd572DD62cBe6186d1BF56d9cA0',
    description: 'Institutional-grade vault backed 1:1 by short-dated U.S. Treasury Bills (0-3 month maturity) held in qualified bank custody. Provides predictable base yield on BOT Chain.',
    features: [
      '1:1 U.S. T-Bill Collateral Backing',
      'Daily Interest Accrual & Cash Out',
      'Permissioned ERC-3643 Standard',
      'Low Impermanent Loss Risk'
    ],
    status: 'live'
  }
];

// GET /api/assets — Fetch approved live assets (automatically seed if database is empty)
router.get('/', async (req, res) => {
  try {
    let assets = await Asset.find({ status: 'live' });
    
    if (assets.length === 0) {
      console.log('Database empty! Auto-seeding default live assets...');
      await Asset.insertMany(DEFAULT_SEEDS);
      assets = await Asset.find({ status: 'live' });
    }
    
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/assets/pending — Fetch pending submissions
router.get('/pending', async (req, res) => {
  try {
    const assets = await Asset.find({ status: 'pending' });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/assets/submit — Submit pending listing
router.post('/submit', async (req, res) => {
  try {
    const newAsset = new Asset(req.body);
    const saved = await newAsset.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/assets/approve/:id — Admin approval
router.put('/approve/:id', async (req, res) => {
  try {
    const updated = await Asset.findByIdAndUpdate(
      req.params.id,
      { status: 'live', approvedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/assets/reject/:id — Admin rejection
router.put('/reject/:id', async (req, res) => {
  try {
    const updated = await Asset.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
