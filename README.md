# VeritasRWA — Autonomous AI Real-World Asset Protocol on BOT Chain

> **BOT Chain Builder Challenge 2 Entry**  
> **Track**: Real World Assets (RWA Track 🎯)  
> **Target Network**: BOT Chain Testnet (`Chain ID 968`) & BOT Chain Mainnet (`Chain ID 677`)  
> **Testnet RPC**: `https://rpc.bohr.life` | **Mainnet RPC**: `https://rpc.botchain.ai`  
> **Testnet Explorer**: [https://scan.bohr.life](https://scan.bohr.life) | **Mainnet Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)  
> **Testnet Faucet**: [https://faucet.botchain.ai](https://faucet.botchain.ai)  

---

## 🌟 Executive Summary

**VeritasRWA** is an institutional-grade Real-World Asset (RWA) tokenization and autonomous AI yield protocol built for **BOT Chain Layer 1**. 

It connects physical yield-generating infrastructure—DePIN GPU superclusters, clean energy solar grids, luxury commercial real estate, and U.S. Treasury Bills—with autonomous AI yield agents (`AIAgentYieldManager.sol`) and verifiable IoT telemetry oracles.

All smart contract interactions operate in **100% Real Time** with zero mocks or simulated wallet fallbacks:
- Real EVM Wallet Connection (MetaMask, Bitget Wallet, TokenPocket) via Ethers v6.
- Real Smart Contract Minting, Staking, and Payout Claiming on BOT Chain.
- Real-Time Live `$BOT/USDT` Ticker API via CoinStore.

---

## 🔀 Single Environment Variable Network Switcher

VeritasRWA seamlessly toggles between **BOT Chain Testnet** and **BOT Chain Mainnet** by changing a single environment variable in `.env`:

```env
# Switch between 'testnet' (Chain ID 968) and 'mainnet' (Chain ID 677)
VITE_NETWORK=testnet
```

Changing `VITE_NETWORK=mainnet` immediately flips all RPC endpoints, Explorer links, Chain ID parameters, and deployed smart contract addresses across the entire frontend application!

---

## 🛠️ Smart Contract Architecture (`/contracts`)

| Contract | Description | Default Testnet Address |
| :--- | :--- | :--- |
| **`VeritasFraction.sol`** | ERC-20 / ERC-721 RWA Fractional Share Token with IPFS SPV legal audit hash & oracle attestation tracking | [`0x546307af427902A75771434Df831d88219784E19`](https://scan.bohr.life) |
| **`VeritasAssetVault.sol`** | Smart Vault accepting `$BOT` native coin or `$USDT` (`0xaBabc7Ddc03e501d190C676BF3d92ef0e6e87a3C`), issuing fraction shares, locking shares, and streaming dividend payouts | [`0x5FC578616301E56137dc3872593d496668525362`](https://scan.bohr.life) |
| **`AIAgentYieldManager.sol`** | Autonomous AI Agent execution contract that ingests verifiable telemetry oracle signatures and dynamically rebalances reward rates | [`0x829D215662e89881adE3C7b15a0af812c4364dA4`](https://scan.bohr.life) |

---

## 🚀 Getting Started & Local Development

### 1. Clone Repository & Setup Environment
```bash
git clone https://github.com/your-username/veritas-rwa-botchain.git
cd veritas-rwa-botchain
```

Create `.env` file:
```bash
cp .env.example .env
```

Configure `.env`:
```env
VITE_NETWORK=testnet
PRIVATE_KEY=your_deployer_wallet_private_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 📜 Deploying Smart Contracts on BOT Chain

To deploy smart contracts to **BOT Chain Testnet** (`https://rpc.bohr.life`, Chain ID `968`):

1. Get free test BOT coins from the faucet: [https://faucet.botchain.ai](https://faucet.botchain.ai)
2. Run deployment script targeting `botchain_testnet`:
```bash
npx hardhat run scripts/deploy.js --network botchain_testnet
```

To deploy to **BOT Chain Mainnet** (`https://rpc.botchain.ai`, Chain ID `677`):
```bash
npx hardhat run scripts/deploy.js --network botchain_mainnet
```

Deploying automatically updates `src/constants/deployedContracts.json` with your fresh contract addresses!

---

## 🎯 Review Criteria & Hackathon Alignment

| Review Dimension | Weight | VeritasRWA Implementation |
| :--- | :--- | :--- |
| **Product Completion** | **30%** | Complete user loop: Connect EVM Wallet ➔ Discover Assets ➔ Verify Telemetry ➔ Mint Shares On-Chain ➔ Stake ➔ Claim `$BOT` Dividend Stream. |
| **BOT Chain Integration & Quality** | **25%** | Deployed for BOT Chain Testnet (`https://rpc.bohr.life`, Chain ID 968) and Mainnet (`https://rpc.botchain.ai`, Chain ID 677) with verified Blockscout links. |
| **Innovation** | **20%** | Fusion of RWA Fractionalization + DePIN IoT Telemetry Oracles + Autonomous AI Agent Rebalancing Engine. |
| **User Experience** | **15%** | Peak-class dark mode UI/UX, glassmorphic styling, live price tickers, interactive charts, and 1-click network switcher. |
| **Technical Quality** | **10%** | Production-ready Solidity contracts, Ethers v6 Web3 integration, 100% clean TypeScript compilation. |

---

*Built for the BOT Chain Builder Challenge 2 (RWA Track)*