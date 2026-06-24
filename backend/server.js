/*
console.log("SERVER STARTED");
console.log("PK length:", process.env.SYSTEM_PRIVATE_KEY?.length);

const pk = process.env.SYSTEM_PRIVATE_KEY.trim();

console.log("Length:", pk.length);
console.log("Starts with 0x:", pk.startsWith("0x"));

console.log(
  "Hex only:",
  /^0x[0-9a-fA-F]{64}$/.test(pk)
);
*/

let priceCache = {
  BTC: 0,
  ETH: 0,
  SOL: 0
};

let lastUpdate = 0;

// smart_contract
const BET_RECORDER_ADDRESS =
  "0xa45EEE463D60fAea777a4516BB5Af1A828F2cE8c";

const BET_RECORDER_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "betId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "asset",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "higher",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "betId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "won",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endPrice",
        "type": "uint256"
      }
    ],
    "name": "BetSettled",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "bets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "betId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "asset",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "higher",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "settled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "endPrice",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "won",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "betId",
        "type": "uint256"
      }
    ],
    "name": "getBet",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "betId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "player",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "asset",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "higher",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "settled",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "endPrice",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "won",
            "type": "bool"
          }
        ],
        "internalType": "struct BetRecorderV3.Bet",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextBetId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "asset",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "higher",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "recordBet",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "betId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endPrice",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "won",
        "type": "bool"
      }
    ],
    "name": "settleBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
// smart_contract

const WebSocket = require('ws');

const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to,uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)"
];

const express = require('express');
const app = express();

const { AppKit } = require("@circle-fin/app-kit");

const kit = new AppKit();

const { createEthersAdapterFromPrivateKey } = require("@circle-fin/adapter-ethers-v6");

const { ethers } = require('ethers');
require('dotenv').config();

app.use((req, res, next) => {
  //console.log(req.method, req.url);
  next();
});

console.log("SERVER STARTING...");

const provider =
  new ethers.JsonRpcProvider(
    process.env.ARC_RPC
  );

const wallet =
  new ethers.Wallet(
    process.env.SYSTEM_PRIVATE_KEY,
    provider
  );

const vault =
  new ethers.Contract(
    process.env.VAULT_ADDRESS,
    [
      "function deposit(address user, bytes32 keyHash, uint256 amount)",
      "function withdraw(address user, bytes32 keyHash, uint256 amount, address recipient)",
      "function getBalance(address user, bytes32 keyHash) view returns(uint256)"
    ],
    wallet
  );
  
const usdc =
  new ethers.Contract(
    process.env.ARC_TESTNET_USDC,
    USDC_ABI,
    wallet
  );
  

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
  "ink-sepolia": { rpc: process.env.INK_SEPOLIA_RPC, usdc: process.env.INK_SEPOLIA_USDC, decimals: 6 },
  "arbitrum-sepolia": { rpc: process.env.ARBITRUM_SEPOLIA_RPC, usdc: process.env.ARBITRUM_SEPOLIA_USDC, decimals: 6 },
  "avalanche-fuji": { rpc: process.env.AVAX_FUJI_RPC, usdc: process.env.AVAX_FUJI_USDC, decimals: 6 },
  "hyperevm-testnet": { rpc: process.env.HYPE_TESTNET_RPC, usdc: process.env.HYPE_TESTNET_USDC, decimals: 6 },
  "unichain-sepolia": { rpc: process.env.UNI_SEPOLIA_RPC, usdc: process.env.UNI_SEPOLIA_USDC, decimals: 6 }

};

const CHAIN_MAP = {
  "arc-testnet": "Arc_Testnet",
  "base-sepolia": "Base_Sepolia",
  "eth-sepolia": "Ethereum_Sepolia",
  "ink-sepolia": "Ink_Sepolia",
  "arbitrum-sepolia": "Arbitrum_Sepolia",
  "avalanche-fuji" : "Avalanche_Fuji",
  "hyperevm-testnet" : "HyperEVM_Testnet",
  "unichain-sepolia" : "Unichain_Sepolia"
};

const CHAIN_CONFIG = {

    "arc-testnet": {
      chainId: "0x4cef52",
      rpcUrl: "https://rpc.testnet.arc.network",
      name: "ARC Testnet",
      explorer: "https://testnet.arcscan.app",
      usdcAddress: "0x3600000000000000000000000000000000000000"
    },

    "base-sepolia": {
      chainId: "0x14a34",
      rpcUrl: "https://sepolia.base.org",
      name: "Base Sepolia",
      explorer: "https://sepolia.basescan.org",
      usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
    },

    "base-mainnet": {
      chainId: "0x2105",
      rpcUrl: "https://mainnet.base.org",
      name: "Base Mainnet",
      explorer: "https://basescan.org",
      usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    },

    "eth-sepolia": {
      chainId: "0xaa36a7",
      rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
      name: "Ethereum Sepolia",
      explorer: "https://sepolia.etherscan.io",
      usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
    },

"ink-sepolia": {
  chainId: "763373", //"0xba5ed", // 763373 decimal
  rpcUrl: "https://rpc-gel-sepolia.inkonchain.com",
  name: "Ink Sepolia",
  explorer: "https://explorer-sepolia.inkonchain.com",
  usdcAddress: "0xFabab97dCE620294D2B0b0e46C68964e326300Ac"
},

    "arbitrum-sepolia": {
      chainId: "0x66eee",
      rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
      name: "Arbitrum Sepolia",
      explorer: "https://sepolia.arbiscan.io",
      usdcAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
    },

"avalanche-fuji": {
  chainId: "43113",
  rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
  name: "Avalanche Fuji",
  explorer: "https://testnet.snowtrace.io",
  usdcAddress: "0x5425890298aed601595a70AB815c96711a31Bc65"
},
"hyperevm-testnet": {
  chainId: "998",
  rpcUrl: "https://rpc.hyperliquid-testnet.xyz/evm",
  name: "HyperEVM Testnet",
  explorer: "https://app.hyperliquid-testnet.xyz/explorer",
  usdcAddress: "0x2B3370eE501B4a559b57D449569354196457D8Ab"
},
"unichain-sepolia": {
  chainId: "1301",
  rpcUrl: "https://sepolia.unichain.org",
  name: "Unichain Sepolia",
  explorer: "https://sepolia.uniscan.xyz",
  usdcAddress: "0x31d0220469e10c4E71834a79b1f276d740d3768F"
}
  };

function jsonBigInt(obj) {
  return JSON.parse(
    JSON.stringify(
      obj,
      (_, value) =>
        typeof value === "bigint"
          ? value.toString()
          : value
    )
  );
}

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
/*
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
    chain: CHAIN_MAP[chain]
  },
  to: {
    chain: DEFAULTCHAIN,
    recipientAddress: process.env.ARC_TREASURY
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
        chain: DEFAULTCHAIN,
        recipientAddress: process.env.ARC_TREASURY
      },

      amount: amount.toString(),
      token: "USDC"

    });

res.json(
  jsonBigInt({
    success: true,
    result
  })
);

  } catch (e) {

    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });

  }

});
*/

/*
let priceCache = {};
let lastUpdate = 0;

async function refreshPrices() {

  const assets = {
    BTC: "BTC-USD",
    ETH: "ETH-USD",
    SOL: "SOL-USD"
  };

  for (const [key, pair] of Object.entries(assets)) {

    const r = await fetch(
      `https://api.coinbase.com/v2/prices/${pair}/spot`
    );

    const data = await r.json();

    priceCache[key] = Number(data.data.amount);

  }

  lastUpdate = Date.now();

}

refreshPrices();

setInterval(
  refreshPrices,
  2750 // every 2.75 seconds
);
*/

function connectCoinbaseWS() {

  const ws = new WebSocket(
    "wss://advanced-trade-ws.coinbase.com"
  );

  ws.on("open", () => {

    console.log(
      "✅ Coinbase WebSocket connected"
    );

    ws.send(JSON.stringify({

      type: "subscribe",

      product_ids: [
        "BTC-USD",
        "ETH-USD",
        "SOL-USD"
      ],

      channel: "ticker"

    }));

  });

  ws.on("message", (data) => {

    try {

      const msg =
        JSON.parse(data.toString());

      if (
        msg.events &&
        msg.events.length > 0
      ) {

        const ticker =
          msg.events[0].tickers?.[0];

        if (!ticker) return;

        const product =
          ticker.product_id;

        const price =
          Number(ticker.price);

        if (
          product === "BTC-USD"
        ) {
          priceCache.BTC = price;
        }

        if (
          product === "ETH-USD"
        ) {
          priceCache.ETH = price;
        }

        if (
          product === "SOL-USD"
        ) {
          priceCache.SOL = price;
        }

        lastUpdate = Date.now();

        //console.log(priceCache);
      }

    } catch (e) {

      console.error(
        "WS Parse Error:",
        e
      );

    }

  });

  ws.on("close", () => {

    console.log(
      "⚠️ Coinbase disconnected"
    );

    setTimeout(
      connectCoinbaseWS,
      5000
    );

  });

  ws.on("error", (e) => {

    console.error(
      "Coinbase WS Error:",
      e.message
    );

  });

}

connectCoinbaseWS();

app.get("/api/price", (req, res) => {

  const asset =
    req.query.asset;

  res.json({

    price:
      priceCache[asset],

    lastUpdate

  });

});

/*
app.get("/api/price", async (req, res) => {
  try {
  const symbol = req.query.symbol;
  const asset = req.query.asset;

    const pairMap = {
      BTC: "BTC-USD",
      ETH: "ETH-USD",
      SOL: "SOL-USD"
    };

  const pair = pairMap[asset];

console.log("asset =", asset);
console.log("symbol =", symbol);
console.log("pair =", pair);

  const r = await fetch(
    //`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    //`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
    `https://api.coinbase.com/v2/prices/${pair}/spot`
  );

  console.log("Status:", r.status);

  const data = await r.json();

  console.log("Response:", data);

res.json({
  price: Number(data.data.amount)
});

  } catch (e) {

    console.error(e);

    res.status(500).json({
      error: e.message
    });

  }

});
*/

app.post('/api/settle', async (req, res) => {

  try {

    const {
      txHash,
      chain,
      amount
    } = req.body;

    // TODO:
    // verify txHash really transferred
    // amount USDC
    // to treasury wallet

    res.json({
      success: true
    });

  } catch (e) {

    console.error("Backend error:", e);

    res.status(500).json({
      success: false,
      message: e.message
    });

  }

});

app.post('/api/bridge-to-arc', async (req, res) => {

  try {

    const {
      chain,
      amount
    } = req.body;

    console.log("BRIDGE REQUEST:");
    console.log("chain =", chain);
    console.log("amount =", amount);

    // Skip bridge if already on Arc
    if (chain === "arc-testnet") {

      return res.json({
        success: true
      });

    }

    const adapter = getAdapter();

    console.log("calling kit.bridge()");

    const result = await kit.bridge({

      from: {
        adapter,
        chain: CHAIN_MAP[chain]
      },

      to: {
        adapter,
        chain: "Arc_Testnet",
        recipientAddress:
          process.env.ARC_TREASURY
      },

      amount: amount.toString(),
      token: "USDC"

    });


    
if (result.state === "error") {

  const failedStep = result.steps.find(
    s => s.state === "error"
  );

  if (
    failedStep?.error?.recoverability === "RETRYABLE"
  ) {

    console.log("Retrying bridge...");

    const retryResult = await kit.retryBridge(
      result,
      {
        from: adapter,
        to: adapter
      }
    );

    console.log("Retry Result:", retryResult);

    return retryResult;
  }
}



    console.log("BRIDGE SUCCESS");
    console.dir(result, { depth: null });

    res.send(
      JSON.stringify(
        result,
        (_, v) =>
          typeof v === "bigint"
            ? v.toString()
            : v
      )
    );

  } catch (e) {

    console.error("BRIDGE FAILED:");
    console.error(e);

    res.status(500).json({
      error: e.message
    });

  }

});

// Claim Reward (Payout from Arc Treasury to user chain)
/*
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
    chain: CHAIN_MAP[chain]
  },
  to: {
    chain: DEFAULTCHAIN,
    recipientAddress: process.env.ARC_TREASURY
  },
  amount
}, {
  depth: null
});

    const result = await kit.bridge({

      from: {
        adapter,
        chain: DEFAULTCHAIN
      },

      to: {
        adapter,
        chain: CHAIN_MAP[chain],
        recipientAddress: userAddress
      },

      amount: payout,
      token: "USDC"

    });

res.json(
  jsonBigInt({
      success: true,
      payout,
      result
  })
);

  } catch (e) {

    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });

  }

});
*/

// smart_contract
app.post(
  "/api/settle-bet",
  async (req, res) => {

    try {

      const {
        betId,
        endPrice,
        won
      } = req.body;

      const provider =
        new ethers.JsonRpcProvider(
          "https://rpc.testnet.arc.network"
        );

/*
console.log(
  "Length:",
  process.env.SYSTEM_PRIVATE_KEY.length
);

console.log(
  "Starts with 0x:",
  process.env.SYSTEM_PRIVATE_KEY.startsWith("0x")
);
*/

const pk = process.env.SYSTEM_PRIVATE_KEY;

//console.log("PK RAW:", JSON.stringify(pk));
//console.log("Length:", pk?.length);

const wallet = new ethers.Wallet(
  pk.trim(),
  provider
);

      //const wallet =
        //new ethers.Wallet(
          //process.env.SYSTEM_PRIVATE_KEY.trim(),
          //provider
        //);

//const pk = process.env.SYSTEM_PRIVATE_KEY.trim();

//console.log("Creating wallet...");

//const wallet = new ethers.Wallet(pk);

//console.log("Wallet address:", wallet.address);

//const connectedWallet =
  //wallet.connect(provider);

console.log("Connected wallet:", wallet.address);

      const contract =
        new ethers.Contract(
          BET_RECORDER_ADDRESS,
          BET_RECORDER_ABI,
          wallet
        );

        console.log("betId:", betId);
console.log("endPrice:", endPrice);
console.log("won:", won);

console.log(
  typeof betId,
  typeof endPrice,
  typeof won
);

console.log("BEFORE settleBet");

      const tx =
        await contract.settleBet(
          betId,
          Math.floor(
            endPrice * 100
          ),
          won
        );

      console.log("TX SENT:", tx.hash);

      await tx.wait();

      console.log("TX CONFIRMED");

      res.json({
        success: true,
        txHash: tx.hash
      });

    } catch (e) {

      console.error(e);

      res.json({
        success: false,
        message: e.message
      });

    }

  }
);

app.post(
  "/api/record-bet",
  async (req, res) => {

    try {

const {
  player,
  asset,
  higher,
  amount,
  startPrice,
  duration
} = req.body;

      const provider =
        new ethers.JsonRpcProvider(
          process.env.ARC_RPC
        );

      const wallet =
        new ethers.Wallet(
          process.env.SYSTEM_PRIVATE_KEY.trim(),
          provider
        );

      const contract =
        new ethers.Contract(
          BET_RECORDER_ADDRESS,
          BET_RECORDER_ABI,
          wallet
        );

        console.log(
  contract.interface.fragments
    .map(f => f.name)
);

      const tx =
await contract.recordBet(
  player,
  asset,
  higher,
  amount,
  startPrice,
  duration
);

      await tx.wait();

      const nextBetId =
  await contract.nextBetId();

const betId =
  Number(nextBetId) - 1;

      console.log(
        "Bet recorded:",
        tx.hash
      );

res.json({
  success: true,
  txHash: tx.hash,
  betId: betId
});

    } catch (e) {

      console.error(e);

      res.json({
        success: false,
        message: e.message
      });

    }

  }
);
// smart_contract

/*
TEST
*/
app.get("/api/vault/test", (req, res) => {

  res.json({
    success: true,
    message: "Vault route working"
  });

});

/*
DEPOSIT
*/
app.post(
  "/api/vault/deposit",
  async (req,res) => {

    try {

      const {
        amount,
        chain,
        keyHash,
        userAddress
      } = req.body;

      const amount6 =
        ethers.parseUnits(
          amount,
          6
        );

      //
      // bridge first if needed
      //

      if (
        chain !==
        "arc-testnet"
      ) {

        await bridgeToArc(
          chain,
          amount
        );

      }

      //
      // treasury -> vault
      //

      const transferTx =
        await usdc.transfer(
          process.env.VAULT_ADDRESS,
          amount6
        );

      await transferTx.wait();

      //
      // record ownership
      //

      const depositTx =
        await vault.deposit(
          userAddress,
          keyHash,
          amount6
        );

      await depositTx.wait();

      res.json({
        success:true
      });

    } catch(err) {

      console.error(err);

      res.status(500).json({
        success:false,
        message:err.message
      });

    }

});

/* WITHDRAW */ 
app.post( "/api/vault/withdraw", async (req,res) => { 
  try { const { secret, amount, userAddress } = req.body; 
  const keyHash = ethers.keccak256( ethers.toUtf8Bytes( secret ) ); 
  const amount6 = ethers.parseUnits( amount, 6 ); 
  const tx = await vault.withdraw( userAddress, keyHash, amount6, userAddress ); 
  await tx.wait(); res.json({ success:true }); } 
  catch(err) { res.status(500).json({ success:false, message:err.message }); } });

app.post('/api/claim', async (req, res) => {

  try {

    const {
      userAddress,
      chain,
      amount
    } = req.body;

    const payout = ((Number(amount) * 2)*0.95).toFixed(6);

//
// ARC USER
// DIRECT TRANSFER
//

if (chain === "arc-testnet") {

  const provider = new ethers.JsonRpcProvider(
    CHAIN_CONFIG["arc-testnet"].rpcUrl
  );

  const treasuryWallet =
    new ethers.Wallet(
      process.env.PRIVATE_KEY,
      provider
    );

  const usdc = new ethers.Contract(
    CHAIN_CONFIG["arc-testnet"].usdcAddress,
    USDC_ABI,
    treasuryWallet
  );

  const tx = await usdc.transfer(
    userAddress,
    ethers.parseUnits(
      payout.toString(),
      6
    )
  );

  await tx.wait();

  return res.json({
    success: true,
    txHash: tx.hash
  });
}

    const adapter = getAdapter();

    const result = await kit.bridge({

      from: {
        adapter,
        chain: "Arc_Testnet"
      },

      to: {
        adapter,
        chain: CHAIN_MAP[chain],
        recipientAddress:
          userAddress
      },

      amount: payout,
      token: "USDC"

    });



if (result.state === "error") {

  const failedStep = result.steps.find(
    s => s.state === "error"
  );

  if (
    failedStep?.error?.recoverability === "RETRYABLE"
  ) {

    console.log("Retrying bridge...");

    const retryResult = await kit.retryBridge(
      result,
      {
        from: adapter,
        to: adapter
      }
    );

    console.log("Retry Result:", retryResult);

    return retryResult;
  }
}



res.send(
  JSON.stringify(
    {
      success: true,
      txHash:
        result.transactionHash ||
        result.txHash ||
        null,
      bridgeResult: result
    },
    (_, v) =>
      typeof v === "bigint"
        ? v.toString()
        : v
  )
);

  } catch (e) {

    res.status(500).json({
      error: e.message
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

app.get("/api/system-balance", async (req, res) => {

  try {

    const provider = new ethers.JsonRpcProvider(
      CHAIN_CONFIG["arc-testnet"].rpcUrl
    );

    const usdc = new ethers.Contract(
      CHAIN_CONFIG["arc-testnet"].usdcAddress,
      USDC_ABI,
      provider
    );

    const balance = await usdc.balanceOf(
      process.env.ARC_TREASURY
    );

    res.json({
      success: true,
      balance: ethers.formatUnits(balance, 6)
    });

  } catch (e) {

    res.status(500).json({
      success: false,
      message: e.message
    });

  }

});

app.get("/api/user-balance", async (req, res) => {

  try {

    const { chain, address } = req.query;

    console.log("chain =", chain);
    console.log("address =", address);

    console.log(
      "config =",
      CHAIN_CONFIG[chain]
    );

    const provider =
      new ethers.JsonRpcProvider(
        CHAIN_CONFIG[chain].rpcUrl
      );

    const usdc = new ethers.Contract(
      CHAIN_CONFIG[chain].usdcAddress,
      USDC_ABI,
      provider
    );

    const balance =
      await usdc.balanceOf(address);

    console.log(
      "raw balance =",
      balance.toString()
    );

    res.json({
      success: true,
      balance:
        ethers.formatUnits(balance, 6)
    });

  } catch (e) {

    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });

  }

});

/* smart-contract*/
app.get("/api/leaderboard", async (req, res) => {

  try {

    const provider =
      new ethers.JsonRpcProvider(
        process.env.ARC_RPC
      );

    const contract =
      new ethers.Contract(
        BET_RECORDER_ADDRESS,
        BET_RECORDER_ABI,
        provider
      );

    const nextBetId =
      Number(
        await contract.nextBetId()
      );

    const players = {};

    for (
      let i = 0;
      i < nextBetId;
      i++
    ) {

      const bet =
        await contract.getBet(i);

      const wallet =
        bet.player.toLowerCase();

      if (!players[wallet]) {

        players[wallet] = {

          wallet,

          pnl: 0,

          totalVolume: 0,

          totalWins: 0,

          totalBets: 0

        };

      }

      const p =
        players[wallet];

      const amount =
        Number(bet.amount);

      p.totalVolume += amount;

      p.totalBets += 1;

      if (bet.won) {

        p.totalWins += 1;

        p.pnl += amount * 0.9;

      } else {

        p.pnl -= amount;

      }

    }

  const TREASURY =
  process.env.ARC_TREASURY;

    const leaderboard =
      Object.values(players).filter(row => {

      const wallet =
        row.wallet.toLowerCase();

      // remove treasury
      if (wallet === TREASURY)
        return false;

      // remove zero address
      if (
        wallet ===
        "0x0000000000000000000000000000000000000000"
      )
        return false;

      return true;

    })

      .sort(
        (a, b) =>
          b.pnl - a.pnl
      )
      .map((row, index) => ({

        rank:
          index + 1,

        wallet:
          row.wallet,

        pnl:
          Number(
            row.pnl.toFixed(2)
          ),

        totalVolume:
          row.totalVolume,

        totalWins:
          row.totalWins,

        totalBets:
          row.totalBets

      }));

    res.json({
      success: true,
      leaderboard
    });

  } catch (e) {

    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });

  }

});
/* smart-contract*/

app.get('/ping', (req, res) => {
res.json(
  jsonBigInt({
    success: true,
    message: 'Backend alive'
  })
);
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

app.get("/version", (req, res) => {
  res.json({
    version: "2026-06-06-v1"
  });
});

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

//console.log("PORT =", process.env.PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});