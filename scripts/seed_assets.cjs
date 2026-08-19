const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read deployed contracts manifest to get fresh addresses
const deployedPath = path.join(__dirname, '../src/constants/deployedContracts.json');
let deployedContracts = {};
try {
  deployedContracts = JSON.parse(fs.readFileSync(deployedPath, 'utf8'));
} catch (err) {
  console.log('⚠️ Could not read deployedContracts.json, using hardcoded address fallbacks.');
}

const tokens = deployedContracts.tokens || {};

const assetsToSeed = [
  {
    name: 'Manhattan DePIN H100 GPU Supercluster',
    category: 'depin_gpu',
    category_name: 'DePIN AI Compute',
    location: 'New York, USA',
    total_value_usd: 4500000,
    fraction_price_bot: 0.1,
    fraction_price_usdt: 0.02,
    total_fractions: 45000000,
    available_fractions: 15700000,
    apy: 14.2,
    image_url: '/assets/depin_gpu.png',
    risk_score: 'AA+',
    telemetry_type: 'GPU Load & Compute',
    telemetry_current_value: '94.8',
    telemetry_unit: '% Utilization',
    verifier: 'Compute Telemetry Oracle',
    spv_document_hash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    contract_address: tokens['asset-gpu-1'] || '0x218E0E346e7b83871832Ec2c534a84961a3940A0',
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
    category_name: 'Green DePIN Energy',
    location: 'Atacama, Chile',
    total_value_usd: 3200000,
    fraction_price_bot: 0.08,
    fraction_price_usdt: 0.016,
    total_fractions: 40000000,
    available_fractions: 15800000,
    apy: 11.8,
    image_url: '/assets/solar_farm.png',
    risk_score: 'AAA',
    telemetry_type: 'Power Output (kW)',
    telemetry_current_value: '4,820',
    telemetry_unit: 'kW Output',
    verifier: 'Solar Energy Telemetry Feed',
    spv_document_hash: 'QmZtrP69WnZg4n2yG8mZ6H4W1yR9bK8m3n2v1x9y8z7w6',
    contract_address: tokens['asset-solar-1'] || '0x294514eEB662B9d555FF13b16c9d32B1ba633335',
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
    category_name: 'Institutional Real Estate',
    location: 'Ginza, Tokyo, Japan',
    total_value_usd: 6800000,
    fraction_price_bot: 0.12,
    fraction_price_usdt: 0.024,
    total_fractions: 56666666,
    available_fractions: 16250000,
    apy: 8.5,
    image_url: '/assets/tokyo_tower.png',
    risk_score: 'AAA',
    telemetry_type: 'Occupancy Rate',
    telemetry_current_value: '98.5',
    telemetry_unit: '% Occupancy',
    verifier: 'SPV Custody Auditor',
    spv_document_hash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    contract_address: tokens['asset-re-1'] || '0x03b6AabAB7796A2A63631E211e707b91Fe867784',
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
    category_name: 'Government Debt Vault',
    location: 'Delaware SPV, USA',
    total_value_usd: 10000000,
    fraction_price_bot: 0.05,
    fraction_price_usdt: 0.01,
    total_fractions: 200000000,
    available_fractions: 72000000,
    apy: 5.2,
    image_url: '/assets/treasury_vault.png',
    risk_score: 'AAA',
    telemetry_type: 'Yield Collateral',
    telemetry_current_value: '100',
    telemetry_unit: '% Collateral Backed',
    verifier: 'Bank Custody Attestation',
    spv_document_hash: 'QmPZ9GcBqR7M3W4nK6v8yX1z2A3b4C5d6E7f8g9h0i1j2',
    contract_address: tokens['asset-tbill-1'] || '0x533dFb5B101BCAe29aDFfcAc39a6A3E5106D23bC',
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

async function seed() {
  console.log('==================================================');
  console.log(' Seeding RWA Assets to Supabase Database');
  console.log(' Project URL:', supabaseUrl);
  console.log('==================================================\n');

  try {
    // Delete existing records to avoid duplicates when running multiple times
    console.log('Cleaning existing assets from rwa_assets table...');
    const { error: deleteErr } = await supabase
      .from('rwa_assets')
      .delete()
      .neq('name', '___never_delete___'); // deletes everything

    if (deleteErr) {
      console.warn('⚠️ Delete query warning (continuing with insert):', deleteErr.message);
    }

    console.log('Inserting 4 core RWA assets...');
    const { data, error: insertErr } = await supabase
      .from('rwa_assets')
      .insert(assetsToSeed);

    if (insertErr) throw insertErr;

    console.log('🎉 Database seeding completed successfully!');
    console.log('All 4 assets are now live in your Supabase marketplace.');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message || err);
    process.exit(1);
  }
}

seed();
