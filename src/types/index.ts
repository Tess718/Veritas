export type AssetCategory = 'depin_gpu' | 'solar_farm' | 'real_estate' | 'treasury' | string;

export interface RWAAsset {
  id: string;
  name: string;
  category: AssetCategory;
  categoryName: string;
  location: string;
  totalValueUSD: number;
  fractionPriceBOT: number;
  fractionPriceUSDT: number;
  totalFractions: number;
  availableFractions: number;
  apy: number;
  image: string;
  riskScore: 'AAA' | 'AA+' | 'A+' | 'BBB' | string;
  telemetryType: string;
  telemetryCurrentValue: string;
  telemetryUnit: string;
  verifier: string;
  spvDocumentHash: string;
  contractAddress: string;
  description: string;
  features: string[];
  status?: 'pending' | 'live' | 'rejected';
  submitterAddress?: string;
}

export interface TelemetryDataPoint {
  timestamp: string;
  value: number;
  secondaryValue?: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  botBalance: string;
  usdtBalance: string;
  wbotBalance: string;
  isCorrectNetwork: boolean;
}

export interface UserStakedPosition {
  assetId: string;
  assetName: string;
  fractionsOwned: number;
  stakedAmountBOT: number;
  unclaimedYieldBOT: number;
  dailyYieldBOT: number;
  stakingDate: string;
}

export type ActiveTabType = 'home' | 'marketplace' | 'staking' | 'ai-pilot' | 'proofs' | 'admin';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  engineType?: 'heuristic' | 'llm';
  engineName?: string;
  actionPayload?: {
    type: 'RECOMMEND_PORTFOLIO' | 'EXECUTE_REBALANCE' | 'CLAIM_YIELD';
    details: string;
  };
}

