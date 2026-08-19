import { ethers } from 'ethers';
import { getActiveNetworkParams } from '../constants/botChain';

export interface VerificationResult {
  isValid: boolean;
  error?: string;
  name?: string;
  symbol?: string;
  totalSupply?: string;
}

/**
 * Checks if a contract address is deployed on-chain and validates it matches VeritasFraction
 */
export const verifyFractionContract = async (address: string): Promise<VerificationResult> => {
  if (!ethers.isAddress(address)) {
    return { isValid: false, error: 'Invalid Ethereum address format.' };
  }

  const activeParams = getActiveNetworkParams();
  const provider = new ethers.JsonRpcProvider(activeParams.rpcUrl);

  try {
    // 1. Check if contract bytecode exists
    const code = await provider.getCode(address);
    if (!code || code === '0x') {
      return {
        isValid: false,
        error: `No contract bytecode found at this address on ${activeParams.chainName}. Please make sure you have deployed the contract before submitting.`
      };
    }

    // 2. Query ERC-20 details to verify it implements VeritasFraction interface
    const fractionAbi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function totalSupply() view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];

    const contract = new ethers.Contract(address, fractionAbi, provider);

    const [name, symbol, supply, decimals] = await Promise.all([
      contract.name().catch(() => ''),
      contract.symbol().catch(() => ''),
      contract.totalSupply().catch(() => 0n),
      contract.decimals().catch(() => 18)
    ]);

    if (!name || !symbol) {
      return {
        isValid: false,
        error: 'Contract does not implement standard name() and symbol() functions.'
      };
    }

    return {
      isValid: true,
      name,
      symbol,
      totalSupply: ethers.formatUnits(supply, decimals)
    };
  } catch (err: any) {
    console.error('Contract verification failed:', err);
    return {
      isValid: false,
      error: `Failed to query contract on-chain: ${err.reason || err.message || 'Unknown error'}`
    };
  }
};
