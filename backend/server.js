const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();

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

const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC);
const systemWallet = new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);

console.log("✅ System wallet loaded:", systemWallet.address);

// Claim endpoint with logging
app.post('/api/claim', async (req, res) => {
  console.log(`[CLAIM] Request received from ${req.headers.origin}`);
  console.log(`[CLAIM] Body:`, req.body);

  const { userAddress, amount } = req.body;

  if (!userAddress || !amount) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  // ... rest of your claim logic (same as before)
  try {
    const betAmount = ethers.parseUnits(amount.toString(), 18);
    const fullPayout = betAmount * 180n / 100n;

    const systemBalance = await provider.getBalance(systemWallet.address);
    let payoutAmount = fullPayout;
    let message = `You won 2x - 10% fee`;

    if (systemBalance < fullPayout) {
      payoutAmount = betAmount;
      message = `System balance low. Only original bet returned`;
    }

    const tx = await systemWallet.sendTransaction({
      to: userAddress,
      value: payoutAmount
    });

    await tx.wait();

    res.json({
      success: true,
      message: message,
      txHash: tx.hash,
      amountSent: ethers.formatUnits(payoutAmount, 18)
    });

  } catch (error) {
    console.error("[CLAIM ERROR]", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// === NEW: Get System Balance Endpoint ===
app.get('/api/system-balance', async (req, res) => {
  try {
    const balance = await provider.getBalance(systemWallet.address);
    res.json({
      balance: ethers.formatUnits(balance, 18)
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