const { AppKit } = require("@circle-fin/app-kit");
const { createEthersAdapterFromPrivateKey } = require("@circle-fin/adapter-ethers-v6");

const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const CHAINS = {
  "arc-testnet": { rpc: process.env.ARC_RPC, usdc: process.env.ARC_TESTNET_USDC, decimals: 6 },
  "base-sepolia": { rpc: process.env.BASE_SEPOLIA_RPC, usdc: process.env.BASE_SEPOLIA_USDC, decimals: 6 },
  "eth-sepolia": { rpc: process.env.ETH_SEPOLIA_RPC, usdc: process.env.ETH_SEPOLIA_USDC, decimals: 6 },
  "arbitrum-sepolia": { rpc: process.env.ARBITRUM_SEPOLIA_RPC, usdc: process.env.ARBITRUM_SEPOLIA_USDC, decimals: 6 }
};

// Always use Arc Testnet as Treasury
function getTreasuryWallet() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC);
  return new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);
}

// Settle Bet (User pays on their chain to Arc Treasury address)
app.post('/api/settle', async (req, res) => {
  const { userAddress, amount, chain } = req.body;

  if (!userAddress || !amount || !chain) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  res.json({
    success: true,
    message: `Bet of ${amount} USDC received on ${chain}. Funds sent to Arc Treasury.`,
    chain: chain
  });
});

// Claim Reward (Payout from Arc Treasury to user chain)
app.post('/api/claim', async (req, res) => {
  const { userAddress, amount, chain } = req.body;

  if (!userAddress || !amount || !chain) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const treasuryWallet = getTreasuryWallet(); // Always Arc Testnet

    const fullPayout = ethers.parseUnits(amount.toString(), 6) * 180n / 100n;

    const result = await kit.send({
      from: {
        adapter: createEthersAdapterFromPrivateKey({ privateKey: process.env.SYSTEM_PRIVATE_KEY }),
        chain: "Arc_Testnet"
      },
      to: userAddress,
      amount: ethers.formatUnits(fullPayout, 6),
      token: "USDC",
      destinationChain: chain   // Bridge to user selected chain
    });

    res.json({
      success: true,
      message: "Reward bridged from Arc Treasury",
      txHash: result.txHash,
      amountSent: ethers.formatUnits(fullPayout, 6),
      chain: chain
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// System Balance (Always show Arc Testnet Treasury)
app.get('/api/system-balance', async (req, res) => {
  try {
    const treasuryWallet = getTreasuryWallet();
    const usdc = new ethers.Contract(
      CHAINS["arc-testnet"].usdc,
      ["function balanceOf(address) view returns (uint256)"],
      treasuryWallet.provider
    );

    const balance = await usdc.balanceOf(treasuryWallet.address);

    res.json({
      balance: ethers.formatUnits(balance, 6)
    });
  } catch (e) {
    console.error(e);
    res.json({ balance: "0" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});