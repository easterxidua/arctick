const express = require('express');
const app = express();

const { AppKit } = require("@circle-fin/app-kit");

const kit = new AppKit();

const { createEthersAdapterFromPrivateKey } = require("@circle-fin/adapter-ethers-v6");

const { ethers } = require('ethers');
require('dotenv').config();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

console.log("SERVER STARTING...");

//app.get('/', (req, res) => {
  //res.send('SERVER WORKING');
//});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

const cors = require("cors");

app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const DEFAULTCHAIN = "Arc_Testnet";

const CHAINS = {
  "arc-testnet": { rpc: process.env.ARC_RPC, usdc: process.env.ARC_TESTNET_USDC, decimals: 6 },
  "base-sepolia": { rpc: process.env.BASE_SEPOLIA_RPC, usdc: process.env.BASE_SEPOLIA_USDC, decimals: 6 },
  "eth-sepolia": { rpc: process.env.ETH_SEPOLIA_RPC, usdc: process.env.ETH_SEPOLIA_USDC, decimals: 6 },
  "arbitrum-sepolia": { rpc: process.env.ARBITRUM_SEPOLIA_RPC, usdc: process.env.ARBITRUM_SEPOLIA_USDC, decimals: 6 }
};

const CHAIN_MAP = {
  "arc-testnet": "Arc_Testnet",
  "base-sepolia": "Base_Sepolia",
  "eth-sepolia": "Ethereum_Sepolia",
  "arbitrum-sepolia": "Arbitrum_Sepolia"
};

function getAdapter() {
  return createEthersAdapterFromPrivateKey({
    privateKey: process.env.SYSTEM_PRIVATE_KEY
  });
}

// Always use Arc Testnet as Treasury
function getTreasuryWallet() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC);
  return new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);
}

// Settle Bet (User pays on their chain to Arc Treasury address)
app.post('/api/settle', async (req, res) => {

  try {

    const {
      amount,
      chain
    } = req.body;

    const adapter = getAdapter();

console.log("BRIDGE PARAMS:");

console.dir({
  from: {
    chain: SOURCE_CHAIN
  },
  to: {
    chain: DEST_CHAIN,
    recipientAddress: userAddress
  },
  amount
}, {
  depth: null
});

    const result = await kit.bridge({

      from: {
        adapter,
        chain: CHAIN_MAP[chain]
      },

      to: {
        adapter,
        chain: "Arc_Testnet",
        recipientAddress: process.env.ARC_TREASURY
      },

      amount: amount.toString(),
      token: "USDC"

    });

    res.json({
      success: true,
      result
    });

  } catch (e) {

    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });

  }

});

// Claim Reward (Payout from Arc Treasury to user chain)
app.post('/api/claim', async (req, res) => {

  try {

    const {
      userAddress,
      amount,
      chain
    } = req.body;

    const adapter = getAdapter();

    const payout =
      (Number(amount) * 1.8).toFixed(6);

console.log("BRIDGE PARAMS:");

console.dir({
  from: {
    chain: SOURCE_CHAIN
  },
  to: {
    chain: DEST_CHAIN,
    recipientAddress: userAddress
  },
  amount
}, {
  depth: null
});

    const result = await kit.bridge({

      from: {
        adapter,
        chain: "Arc_Testnet"
      },

      to: {
        adapter,
        chain: CHAIN_MAP[chain],
        recipientAddress: userAddress
      },

      amount: payout,
      token: "USDC"

    });

    res.json({
      success: true,
      payout,
      result
    });

  } catch (e) {

    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });

  }

});

app.get('/api/balance', async (req, res) => {

  try {

    const address = req.query.address;
    const chain = req.query.chain;

    const provider =
      new ethers.JsonRpcProvider(
        CHAINS[chain].rpc
      );

    const usdc =
      new ethers.Contract(
        CHAINS[chain].usdc,
        [
          "function balanceOf(address) view returns (uint256)"
        ],
        provider
      );

    const balance =
      await usdc.balanceOf(address);

    res.json({
      balance:
        ethers.formatUnits(balance, 6)
    });

  } catch (e) {

    res.status(500).json({
      error: e.message
    });

  }

});

app.get('/api/system-balance', async (req, res) => {

  try {

    const provider =
      new ethers.JsonRpcProvider(
        process.env.ARC_RPC
      );

    const usdc =
      new ethers.Contract(
        process.env.ARC_TESTNET_USDC,
        [
          "function balanceOf(address) view returns (uint256)"
        ],
        provider
      );

    const balance =
      await usdc.balanceOf(
        process.env.ARC_TREASURY
      );

    res.json({
      balance:
        ethers.formatUnits(balance, 6)
    });

  } catch (e) {

    res.status(500).json({
      error: e.message
    });

  }

});

app.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Backend alive'
  });
});

app.get('/', (req, res) => {
  res.send('ROOT WORKS');
});

/*
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
*/

app.get('/api/test-bridge-base-to-arc', async (req, res) => {
  try {

    const adapter = createEthersAdapterFromPrivateKey({
      privateKey: process.env.SYSTEM_PRIVATE_KEY
    });

    const result = await kit.bridge({

      from: {
        adapter,
        chain: "Base_Sepolia"
      },

      to: {
        adapter,
        chain: "Arc_Testnet",
        recipientAddress: process.env.ARC_TREASURY
      },

      amount: "1",
      token: "USDC"

    });

    res.send(
      JSON.stringify(
        result,
        (_, v) =>
          typeof v === "bigint"
            ? v.toString()
            : v,
        2
      )
    );

  } catch (e) {

    console.error(e);

    res.status(500).json({
      error: e.message,
      cause: e.cause,
      stack: e.stack
    });

  }
});

const PORT = process.env.PORT || 3000;

console.log("PORT =", process.env.PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});