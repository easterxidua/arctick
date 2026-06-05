const express = require('express');
const app = express();

const { AppKit } = require("@circle-fin/app-kit");

const kit = new AppKit();

console.log("kit.estimateBridge =", typeof kit.estimateBridge);
console.log("kit.bridge =", kit.bridge);
console.log(require("@circle-fin/app-kit/package.json").version);
console.log(typeof kit.estimateBridge);

app.get('/api/debug-context', async (req, res) => {
  try {
    res.json(kit.context);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

console.log(JSON.stringify(kit.context, null, 2));

console.log(kit.estimateBridge.toString());

console.log(kit.bridge.toString());

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

// Always use Arc Testnet as Treasury
function getTreasuryWallet() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC);
  return new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);
}

// Settle Bet (User pays on their chain to Arc Treasury address)
app.post('/api/settle', async (req, res) => {

  try {

    const {
      userAddress,
      amount,
      chain
    } = req.body;

    const adapter =
      createEthersAdapterFromPrivateKey({
        privateKey: process.env.SYSTEM_PRIVATE_KEY
      });

    const ARC_CHAIN_MAP = {
      "arc-testnet": "Arc_Testnet",
      "base-sepolia": "Base_Sepolia",
      "eth-sepolia": "Ethereum_Sepolia",
      "arbitrum-sepolia": "Arbitrum_Sepolia"
    };

    const result = await kit.bridge({

      from: {
        adapter,
        chain: ARC_CHAIN_MAP[chain]
      },

      to: {
        recipientAddress: process.env.ARC_TREASURY,
        chain: DEFAULTCHAIN
      },

      amount: amount.toString()

    });

    return res.json({
      success: true,
      txHash: result.txHash
    });

  } catch(error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

// Claim Reward (Payout from Arc Treasury to user chain)
/*
app.post('/api/claim', async (req, res) => {
  const { userAddress, amount, chain } = req.body;

  if (!userAddress || !amount || !chain) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const treasuryWallet = getTreasuryWallet(); // Always Arc Testnet

    const fullPayout = ethers.parseUnits(amount.toString(), 6) * 180n / 100n;

  const result = await kit.bridge({
  from: {
    adapter,
    chain: DEFAULTCHAIN
  },
  to: {
    recipientAddress: userAddress,
    chain: destinationChain
  },
  amount: payoutAmount
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
*/

app.get('/api/system-balance', async (req, res) => {

  try {

    const provider =
      new ethers.JsonRpcProvider(process.env.ARC_RPC);

    const treasuryAddress =
      "0x9068D4A1edCea0e553525E8Ca5edbE57DfE900b6";

    const usdc = new ethers.Contract(
      CHAINS["arc-testnet"].usdc,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );

    const balance =
      await usdc.balanceOf(treasuryAddress);

    res.json({
      balance: ethers.formatUnits(balance, 6)
    });

  } catch (e) {

    console.error(e);

    res.status(500).json({
      error: e.message
    });

  }

});

app.get('/api/debug-wallet', async (req, res) => {

  const provider =
    new ethers.JsonRpcProvider(process.env.ARC_RPC);

  const wallet =
    new ethers.Wallet(
      process.env.SYSTEM_PRIVATE_KEY,
      provider
    );

  res.json({
    address: wallet.address
  });

});

app.get('/api/test-bridge2', async (req, res) => {

  try {

    const adapter =
      createEthersAdapterFromPrivateKey({
        privateKey: process.env.SYSTEM_PRIVATE_KEY
      });

    const result = await kit.bridge({

      from: {
        adapter,
        chain: "Arc_Testnet"
      },

      to: "0x9068D4A1edCea0e553525E8Ca5edbE57DfE900b6",

      amount: "1"

    });

    res.json(result);

  } catch(e) {

    console.error(e);

    res.status(500).json({
      error: e.message,
      stack: e.stack
    });

  }

});

app.get('/api/appkit-inspect', async (req, res) => {

  try {

    res.json({
      methods: Object.getOwnPropertyNames(
        Object.getPrototypeOf(kit)
      )
    });

  } catch (e) {

    res.status(500).json({
      error: e.message
    });

  }

});

app.get('/api/appkit-dump', async (req, res) => {

  try {

    res.json({
      keys: Object.keys(kit)
    });

  } catch (e) {

    res.status(500).json({
      error: e.message
    });

  }

});

app.get('/api/supported-chains', async (req, res) => {

  try {

    const chains = await kit.getSupportedChains();

    res.json(chains);

  } catch (e) {

    console.error(e);

    res.status(500).json({
      error: e.message,
      stack: e.stack
    });

  }

});

app.get('/api/test-estimate2', async (req, res) => {

  try {

    const version =
      require("@circle-fin/app-kit/package.json").version;

    res.json({
      version,
      kitKeys: Object.keys(kit)
    });

  } catch (e) {

    res.status(500).json({
      error: e.message,
      stack: e.stack
    });

  }

});

app.get('/api/test-estimate3', async (req, res) => {

  try {

    const adapter =
      createEthersAdapterFromPrivateKey({
        privateKey: process.env.SYSTEM_PRIVATE_KEY
      });

    const params = {

      from: {
        adapter,
        chain: "Arc_Testnet"
      },

      to: {
        chain: "Arc_Testnet"
      },

      amount: "1"

    };

    console.log(
      JSON.stringify(params, null, 2)
    );

    const result =
      await kit.estimateBridge(params);

    res.json(result);

  } catch (e) {

    console.error("FULL ERROR:", e);

    res.status(500).json({
      message: e.message,
      details: e.details,
      issues: e.issues,
      cause: e.cause
    });

  }

});

app.get('/api/test-estimate', async (req, res) => {

  try {

    const adapter =
      createEthersAdapterFromPrivateKey({
        privateKey: process.env.SYSTEM_PRIVATE_KEY
      });

      console.log("adapter =", adapter);

console.log("from =", {
  adapter,
  chain: "Arc_Testnet"
});

console.log("to =", {
  chain: "Arc_Testnet",
  address: "0x8c7265922029899ec69755c96c7c83363c197e90"
});

const estimateParams = {
  from: {
    adapter,
    chain: "Arc_Testnet"
  },

  to: {
    chain: "Arc_Testnet",
    address: "0x8c7265922029899ec69755c96c7c83363c197e90"
  },

  amount: "1"
};

console.log(
  "estimate params =",
  JSON.stringify(estimateParams, null, 2)
);

console.log(
  "estimateBridge typeof =",
  typeof kit.estimateBridge
);

const result = await kit.estimateBridge({

  from: {
    adapter,
    chain: "Arc_Testnet"
  },

  to: {
    chain: "Arc_Testnet",
    address: "0x8c7265922029899ec69755c96c7c83363c197e90"
  },

  amount: "1"

});

    res.json(result);

  } catch (e) {

    console.error(e);

    res.status(500).json({
      error: e.message,
      stack: e.stack
    });

  }

});

app.get('/api/appkit-version', async (req, res) => {

  res.json({
    appkitVersion: require("@circle-fin/app-kit/package.json").version
  });

});

app.get('/api/test-bridge', async (req, res) => {

  try {

    const adapter =
      createEthersAdapterFromPrivateKey({
        privateKey: process.env.SYSTEM_PRIVATE_KEY
      });

    const result = await kit.bridge({

      from: {
        adapter,
        chain: "Arc_Testnet"
      },

      to: {
        recipientAddress:
          "0x9068D4A1edCea0e553525E8Ca5edbE57DfE900b6",
        chain: "Arc_Testnet"
      },

      amount: "1"

    });

    res.json(result);

  } catch(e) {

    console.error(e);

    res.status(500).json({
      error: e.message,
      stack: e.stack
    });

  }

});

app.get('/api/test-appkit', async (req, res) => {

  try {

    res.json({
      appkitLoaded: !!kit
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

const PORT = process.env.PORT || 3000;

console.log("PORT =", process.env.PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});