const { AppKit } = require("@circle-fin/app-kit");
const {
  createEthersAdapterFromPrivateKey
} = require("@circle-fin/adapter-ethers-v6");

const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();

const SUPPORTED_CHAINS = {
  "arc-testnet": "Arc_Testnet"
};

const CHAINS = {
  "arc-testnet": {
    rpc: process.env.ARC_RPC,
    usdcAddress: process.env.ARC_TESTNET_USDC,
    decimals: 6,
    name: "ARC Testnet"
  },
  "base-sepolia": {
    rpc: process.env.BASE_SEPOLIA_RPC,
    usdcAddress: process.env.BASE_SEPOLIA_USDC,
    decimals: 6,
    name: "Base Sepolia"
  },
  "eth-sepolia": {
    rpc: process.env.ETH_SEPOLIA_RPC,
    usdcAddress: process.env.ETH_SEPOLIA_USDC,
    decimals: 6,
    name: "Ethereum Sepolia"
  },
  "arbitrum-sepolia": {
    rpc: process.env.ARBITRUM_SEPOLIA_RPC,
    usdcAddress: process.env.ARBITRUM_SEPOLIA_USDC,
    decimals: 6,
    name: "Arbitrum Sepolia"
  }
};

// Strong Preflight Handler
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle Preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

// ==================== NEW: getSystemWallet Function ====================
/*
function getSystemWallet(chainKey) {
  const config = CHAINS[chainKey];
  if (!config) throw new Error(`Chain ${chainKey} not supported`);

  const provider = new ethers.JsonRpcProvider(config.rpc);
  return new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);
}*/
// =====================================================================

// New: getSystemWallet for Arc Treasury
function getSystemWallet() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC);
  return new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);
}

const chainConfig = CHAINS[chain];
if (!chainConfig) {
  return res.status(400).json({
    success: false,
    message: "❌ Chain not supported."
  });
}

const provider = new ethers.JsonRpcProvider(
  chainConfig.rpc
);

const systemWallet = new ethers.Wallet(
  process.env.SYSTEM_PRIVATE_KEY,
  provider
);

//const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC);
//const systemWallet = new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);

console.log("✅ System wallet loaded:", systemWallet.address);

const kit = new AppKit();

const adapter = createEthersAdapterFromPrivateKey({
  privateKey: process.env.SYSTEM_PRIVATE_KEY
});

// Claim endpoint with logging
app.post('/api/claim', async (req, res) => {
  console.log(`[CLAIM] Request received from ${req.headers.origin}`);
  console.log(`[CLAIM] Body:`, req.body);

  //const { userAddress, amount } = req.body;
  const {
  userAddress,
  amount,
  chain
  } = req.body;

  const chainConfig = CHAINS[chain];

  console.log("System Wallet:", systemWallet.address);
  console.log("User Address:", userAddress);
  console.log("Amount:", amount);
  console.log("Chain:", chain);

  if (!userAddress || !amount) {
    return res.status(400).json({ success: false, message: "❌ Missing data." });
  }

  // ... rest of your claim logic (same as before)
  try {

    // ==================== USE getSystemWallet HERE ====================
    const systemWallet = getSystemWallet(chain);   // ←←← ADD THIS LINE
    // =================================================================

    const treasuryWallet = getSystemWallet(DEFAULTCHAIN);   // Always use Arc Treasury
    
    const betAmount = ethers.parseUnits(amount.toString(), 6); //18
    const fullPayout = betAmount * 180n / 100n;

    const USDC_ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function transfer(address to, uint amount) returns (bool)"
    ];

    const usdc = new ethers.Contract(
      chainConfig.usdc,
      USDC_ABI,
      systemWallet          // ← Use the correct wallet for the selected chain
    );

    const usdcArc = new ethers.Contract(
      CHAINS[DEFAULTCHAIN].usdcAddress,
      ["function balanceOf(address) view returns (uint256)", "function transfer(address, uint256) returns (bool)"],
      treasuryWallet
    );

//const systemBalance = await provider.getBalance(systemWallet.address);
const systemBalanceLama = await usdc.balanceOf(
  systemWallet.address
);

const systemBalance = await usdcArc.balanceOf(treasuryWallet.address);

    let payoutAmount = fullPayout;
    let message = `✅ Payment complete.\n\nYou have received your ● USDC winning bet, minus 10% fee. TEST.`;

    if (systemBalance < fullPayout) {
      payoutAmount = betAmount;
      message = `❌ Treasury low.\n\nYour ● USDC is returned to your wallet.`;
    }

    //const tx = await systemWallet.sendTransaction({
      //to: userAddress,
      //value: payoutAmount
    //});

    //await tx.wait();

/*
const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];
*/
/*
const usdc = new ethers.Contract(
  chainConfig.usdc,
  USDC_ABI,
  provider
);
*/

const balance = await usdc.balanceOf(systemWallet.address);

console.log("System Wallet:", systemWallet.address);
console.log("USDC Balance:", ethers.formatUnits(balance, 6));
console.log("Trying to send:", ethers.formatUnits(payoutAmount, 6));

console.log("Bet Amount:", betAmount.toString());
console.log("Full Payout:", fullPayout.toString());
console.log("Payout Amount:", payoutAmount.toString());

//const chain = req.body.chain || "arc-testnet";

console.log("================================");
console.log("Selected Chain:", chain);
console.log("AppKit Chain:", SUPPORTED_CHAINS[chain]);
console.log("Recipient:", userAddress);
console.log("Amount:", ethers.formatUnits(payoutAmount, 6));
console.log("================================");

/*
const result = await kit.send({
  from: {
    adapter,
    chain: SUPPORTED_CHAINS[chain]
  },
  to: userAddress,
  amount: ethers.formatUnits(payoutAmount, 6),
  token: "USDC"
});

    res.json({
      success: true,
      message: message,
      //txHash: tx.hash,
      txHash: result.txHash,
      amountSent: ethers.formatUnits(payoutAmount, 6), //18
      explorerUrl: result.explorerUrl
    });
*/

    // 1. Transfer from Arc Treasury
    const tx = await usdcArc.transfer(treasuryWallet.address, payoutAmount); // temporary to self for bridging
    await tx.wait();

    // 2. Bridge using Arc Kit (Circle Cross Chain Transfer)
    const result = await kit.send({
      from: {
        adapter: createEthersAdapterFromPrivateKey({ privateKey: process.env.SYSTEM_PRIVATE_KEY }),
        chain: "Arc_Testnet"
      },
      to: userAddress,
      amount: ethers.formatUnits(payoutAmount, 6),
      token: "USDC",
      destinationChain: SUPPORTED_CHAINS[chain]   // Bridge to selected chain
    });

    res.json({
      success: true,
      message: message,
      txHash: tx.hash,
      amountSent: ethers.formatUnits(payoutAmount, 6),
      chain: chain
    });

  } catch (error) {
    console.error("[CLAIM ERROR]", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// === NEW: Get System Balance Endpoint ===
/*
app.get('/api/system-balance', async (req, res) => {
  try {
    const balance = await provider.getBalance(systemWallet.address);
    res.json({
      balance: ethers.formatUnits(balance, 6) //18
    });
  } catch (e) {
    console.error(e);
    res.json({ balance: "0" });
  }
});
*/

app.get('/api/system-balance', async (req, res) => {

  const chain = req.query.chain || DEFAULTCHAIN; //"arc-testnet";

  try {
    // Use the new function
  const systemWallet = getSystemWallet(chain);
  const chainConfig = CHAINS[chain];

  /*
  const provider = new ethers.JsonRpcProvider(
    chainConfig.rpc
  );
  */
 
  /*
  const systemWallet = new ethers.Wallet(
    process.env.SYSTEM_PRIVATE_KEY,
    provider
  );
  */

const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

const usdc = new ethers.Contract(
  chainConfig.usdc,
  USDC_ABI,
  systemWallet.provider
);

const balance = await usdc.balanceOf(
  systemWallet.address
);

  res.json({
    balance: ethers.formatUnits(balance, 6)
  });

} catch (e) {
    console.error(e);
    res.json({ balance: "0" });
  }
});

// New: Settle Bet (User pays to Arc Treasury)
app.post('/api/settle', async (req, res) => {
  const { userAddress, amount, chain } = req.body;

  if (!userAddress || !amount || !chain) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const userWallet = new ethers.Wallet(/* user's private key is not here, we use signer from frontend */);

    // This part is handled in frontend using user's signer
    // Backend just confirms and logs

    res.json({
      success: true,
      message: `Bet settled. ${amount} USDC received on ${chain} and will be bridged to Arc Treasury.`,
      chain: chain
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});