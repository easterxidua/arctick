import CONFIG from './config.js';
import { ethers } from "ethers";

let provider, signer, userAddress;
let currentBet = { amount: 1, time: 10, direction: "HIGHER" };
let startPrice = 0;
let endPrice = 0;
let countdownInterval = null;

const BACKEND_URL = "https://eth-predict-arc-production.up.railway.app";  // Change this when you deploy backend

// ==================== GET ETH PRICE ====================
async function getETHPrice() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
    const data = await res.json();
    
    if (data && data.price) {
      return parseFloat(data.price);
    } else {
      throw new Error("Invalid response");
    }
  } catch (e) {
    console.warn("Binance API failed:", e);
    return 3200; // fallback price
  }
}

async function updateLivePrice(textboxId) {
  const price = await getETHPrice();
  const el = document.getElementById(textboxId);
  if (el) el.value = price.toFixed(2);
}

// ==================== CONNECT WALLET ====================
async function connectWallet() {
  if (!window.ethereum) return alert("❌ No EVM wallet detected.");

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];

    const chain = CONFIG.chains[CONFIG.defaultChain];

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chain.chainId,
          chainName: chain.name,
          rpcUrls: [chain.rpcUrl],
          nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
          blockExplorerUrls: [chain.explorer]
        }]
      });
    } catch (e) {}

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.chainId }]
    });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    alert(`✅ Connected: ${userAddress.slice(0,6)}...${userAddress.slice(-4)}`);
    showScreen2();
  } catch (e) {
    console.error(e);
    alert("Connection failed");
  }
}

// ==================== SCREENS ====================
function showScreen1() {
  document.getElementById('app').innerHTML = `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;background:rgba(255,255,255,0.95)">
      <h1 style="font-size:3.5rem">PREDICT ETH</h1>
      
      <button class="btn" onclick="connectWallet()" style="padding:25px 80px;font-size:1.8rem">
        CONNECT WALLET
      </button>

      <button class="btn" onclick="revokeAllConnections()" 
              style="padding:25px 80px;font-size:1.8rem;background:#FF4444;color:white;">
        REVOKE ALL CONNECTIONS
      </button>
    </div>
  `;
}

async function showScreen2() {
  const shortAddress = userAddress ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : "";
  const userBal = await getUserBalance();           // Your wallet balance
  const systemBal = await getSystemBalance();       // System treasury

  document.getElementById('app').innerHTML = `
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h2 style="margin:0">ON ARC</h2>
        <div onclick="disconnectWallet()" style="background:#FF8800;color:black;padding:6px 12px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:0.95rem">
          ${shortAddress}
        </div>
      </div>

      <!-- USER BALANCE (Your Wallet) -->
      <div style="text-align:center; margin:8px 0; font-weight:bold;">
        Your Balance: <span id="userBalanceDisplay" style="color:#006600;">${userBal} USDC</span>
      </div>

      <!-- SYSTEM BALANCE -->
      <div style="text-align:center; margin:8px 0; padding:10px; background:#f8f8f8; border-radius:8px;">
        <strong>System Balance:</strong> <span id="systemBalanceDisplay">${systemBal} USDC</span>
      </div>

      ${parseFloat(systemBal) < 30 ? `
      <div style="color:#d00; text-align:center; font-size:0.9rem; margin:10px 0;">
        ⚠️ System balance IS ALMOST EMPTY.<br>
        If system balance too low, you may receive only your original bet (no profit)
      </div>` : ''}

      <h1>PREDICT ETH PRICES</h1>
      <h2>ON ARC</h2>

      <h2>BET AMOUNT</h2>
      <div class="flex-row">
        <div class="option-btn ${currentBet.amount===1?'active':''}" onclick="selectAmount(1)">1 USDC</div>
        <div class="option-btn ${currentBet.amount===5?'active':''}" onclick="selectAmount(5)">5 USDC</div>
        <div class="option-btn ${currentBet.amount===10?'active':''}" onclick="selectAmount(10)">10 USDC</div>
      </div>

      <h2>TIME FRAME</h2>
      <div class="flex-row">
        <div class="option-btn ${currentBet.time===10?'active':''}" onclick="selectTime(10)">10s</div>
        <div class="option-btn ${currentBet.time===30?'active':''}" onclick="selectTime(30)">30s</div>
        <div class="option-btn ${currentBet.time===60?'active':''}" onclick="selectTime(60)">60s</div>
      </div>

      <h2>PREDICTION</h2>
      <div class="flex-row">
        <div class="option-btn ${currentBet.direction==='HIGHER'?'active':''}" onclick="selectDirection('HIGHER')">HIGHER</div>
        <div class="option-btn ${currentBet.direction==='LOWER'?'active':''}" onclick="selectDirection('LOWER')">LOWER</div>
      </div>

      <h2>ETH LIVE PRICE</h2>
      <input type="text" id="livePrice1" class="readonly" value="Loading..." readonly>
      <input type="text" id="livePrice2" class="readonly" value="0.00" readonly>

      <button class="btn" id="settleBtn" onclick="settleAndPay()">SETTLE ${currentBet.amount} USDC</button>
      
      <button id="predictBtn" class="btn" onclick="startPrediction()" 
              style="background:#cccccc; color:#666; cursor:not-allowed;" disabled>
        PREDICT
      </button>

      <div id="predictionArea" style="display:none; text-align:center; margin-top:20px">
        <input type="text" id="countdown" class="readonly" value="0" style="font-size:3.5rem; font-weight:bold;">
        <p style="color:#d00; font-weight:bold; margin-top:15px; font-size:1rem;">
          DON'T LEAVE THE SCREEN<br>YOUR BET MAY FAIL AND YOU MAY LOSE YOUR BET MONEY
        </p>
      </div>
    </div>
  `;

    startLivePriceUpdates();
  
  // Balance refresh every 1 second
  if (balanceInterval) clearInterval(balanceInterval);
  balanceInterval = setInterval(updateBalances, 1000);

  // Initial call
  updateBalances();
}

// Replace your startLivePriceUpdates() with this:
let livePriceInterval = null;
let balanceInterval = null;
let isPredictionStarted = false;

function startLivePriceUpdates() {
  if (livePriceInterval) clearInterval(livePriceInterval);

  const updatePrices = async () => {
    const price = await getETHPrice();

    const tb1 = document.getElementById('livePrice1');
    const tb2 = document.getElementById('livePrice2');

    if (tb1 && !isPredictionStarted) {
      tb1.value = price.toFixed(2);
    }

    if (tb2 && isPredictionStarted) {
      tb2.value = price.toFixed(2);
    }
  };

  updatePrices();
  livePriceInterval = setInterval(updatePrices, 100); // Every 0.1 second (100ms)
}

// ==================== BET CONTROLS ====================
window.selectAmount = (amt) => { currentBet.amount = amt; showScreen2(); };
window.selectTime = (t) => { currentBet.time = t; showScreen2(); };
window.selectDirection = (dir) => { currentBet.direction = dir; showScreen2(); };

// ==================== PAYMENT & GAME FLOW ====================
async function settleAndPay() {
  if (!signer) return alert("Wallet not connected");

  const amount = currentBet.amount;
  const SYSTEM_WALLET = "0x9068d4a1edcea0e553525e8ca5edbe57dfe900b6";   // ← Put your real address

  try {
    // === 1. Check User Balance First ===
    const balance = await provider.getBalance(userAddress);
    const requiredAmount = ethers.parseUnits(amount.toString(), 18);
    
    console.log(`Balance: ${ethers.formatUnits(balance, 18)} | Required: ${amount}`);

    if (balance < requiredAmount) {
      alert(`❌ Insufficient USDC!\n\nYou have: ${ethers.formatUnits(balance, 18)} USDC\nYou need: ${amount} USDC`);
      return;
    }

    // === 2. Send Payment ===
    const tx = await signer.sendTransaction({
      to: SYSTEM_WALLET,
      value: requiredAmount
    });

    alert(`⏳ Sending ${amount} USDC...\nTx Hash: ${tx.hash}`);

    const receipt = await tx.wait();
    
    alert(`✅ Payment Successful!\n${amount} USDC sent to system wallet.\n\nTransaction Hash:\n${receipt.transactionHash}`);

    // Enable Predict and disable other controls
    disableBetControls();

    const predictBtn = document.getElementById('predictBtn');
    if (predictBtn) {
      predictBtn.disabled = false;
      predictBtn.style.background = "#FF8800";
      predictBtn.style.color = "black";
      predictBtn.style.cursor = "pointer";
    }

  } catch (error) {
    console.error(error);
    if (error.code === 4001) {
      alert("❌ Transaction rejected by user.");
    } else {
      alert("❌ Payment failed: " + (error.shortMessage || error.message));
    }
  }
}

function startPrediction() {
  isPredictionStarted = true;
  console.log("🚀 Prediction started - Now updating Textbox 2");

  // Freeze Textbox 1
  const tb1 = document.getElementById('livePrice1');
  startPrice = parseFloat(tb1.value) || 3200;
  tb1.style.background = "#e0e0e0";
  tb1.style.color = "#444";

  // Show prediction area
  document.getElementById('predictionArea').style.display = 'block';

  // Disable everything else
  disableAllControls();

  // Start countdown
  let timeLeft = currentBet.time;
  const countdownEl = document.getElementById('countdown');
  countdownEl.value = timeLeft;

  countdownInterval = setInterval(() => {
    timeLeft--;
    countdownEl.value = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      endGame();
    }
  }, 1000);
}

function disableBetControls() {
  const optionBtns = document.querySelectorAll('.option-btn');
  optionBtns.forEach(btn => {
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';
    btn.style.background = '#cccccc';
    btn.style.color = '#666';
  });

  const settleBtn = document.getElementById('settleBtn');
  if (settleBtn) {
    settleBtn.disabled = true;
    settleBtn.style.background = '#cccccc';
    settleBtn.style.color = '#666';
    settleBtn.style.cursor = 'not-allowed';
  }
}

function disableAllControls() {
  // Disable buttons
  const buttons = document.querySelectorAll('.btn, .option-btn');
  buttons.forEach(btn => {
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';
    btn.style.background = '#cccccc';
    btn.style.color = '#666';
  });

  // Disable price boxes except countdown
  document.getElementById('livePrice1').style.opacity = '0.7';
  document.getElementById('livePrice2').style.opacity = '1';
}

async function endGame() {
  endPrice = await getETHPrice();
  document.getElementById('livePrice2').value = endPrice.toFixed(2);

  const isHigher = endPrice > startPrice;
  const userWon = (currentBet.direction === "HIGHER" && isHigher) || 
                  (currentBet.direction === "LOWER" && !isHigher);

  if (userWon) {
    await autoClaimReward();     // Automatic payout
  } else {
    alert("You Lose. Better luck next time.");
    resetGame();
  }
}

async function getUserBalance() {
  if (!provider || !userAddress) return "0.0000";
  try {
    const bal = await provider.getBalance(userAddress);
    return parseFloat(ethers.formatUnits(bal, 18)).toFixed(4);
  } catch(e) {
    return "0.0000";
  }
}

async function getSystemBalance() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/system-balance`);
    const data = await response.json();
    return parseFloat(data.balance).toFixed(4);
  } catch(e) {
    return "0.0000";
  }
}

async function showResultScreen(won) {
  const systemBalance = await getSystemBalance();

  document.getElementById('app').innerHTML = `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px">
      <h1 style="font-size:4.5rem;color:${won ? 'green' : 'red'}">
        ${won ? "YOU WON!" : "YOU LOSE"}
      </h1>
      <p style="font-size:1.3rem">Bet: ${currentBet.amount} USDC | ${currentBet.direction}</p>
      
      ${won ? `
        <div style="background:#f0f0f0;padding:15px 25px;border-radius:10px;text-align:center">
          <strong>System Balance:</strong> ${systemBalance} USDC
        </div>
      ` : ''}
      
      <p style="color:#d00; font-size:1rem; max-width:320px; text-align:center;">
        Note: If system balance was low, you may receive only your original bet (no profit)
      </p>

      <button class="btn" onclick="${won ? 'claimReward()' : 'resetGame()'}" 
              style="padding:20px 70px;font-size:1.4rem">
        ${won ? 'CLAIM REWARD' : 'PLAY AGAIN'}
      </button>
    </div>
  `;
}

// ==================== CLAIM REWARD (Backend Call) ====================
async function claimReward() {
  if (!userAddress) return alert("Wallet not connected");

  const loadingMsg = alert("Checking system balance and processing reward...");

  try {
    const response = await fetch(`${BACKEND_URL}/api/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress: userAddress,
        amount: currentBet.amount
      })
    });

    const result = await response.json();

    if (result.success) {
      alert(`🎉 ${result.message}\n\nTransaction Hash:\n${result.txHash}`);
    } else {
      alert("❌ Claim failed: " + result.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Cannot connect to backend. Make sure backend is running.");
  }

  resetGame();
}

// ==================== DISCONNECT & REVOKE ====================
async function disconnectWallet() {
  if (!confirm("Disconnect wallet?")) return;
  userAddress = null;
  provider = null;
  signer = null;
  if (countdownInterval) clearInterval(countdownInterval);
  alert("✅ Wallet disconnected");
  showScreen1();
}

async function revokeAllConnections() {
  if (!confirm("Reset all connections?")) return;
  userAddress = null;
  provider = null;
  signer = null;
  if (countdownInterval) clearInterval(countdownInterval);
  alert("✅ All connections revoked.");
  showScreen1();
}

function resetGame() {
  currentBet = { amount: 1, time: 10, direction: "HIGHER" };
  isPredictionStarted = false;

  if (countdownInterval) clearInterval(countdownInterval);
  if (livePriceInterval) clearInterval(livePriceInterval);
  if (balanceInterval) clearInterval(balanceInterval);

  showScreen2();
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', showScreen1);

window.connectWallet = connectWallet;
window.disconnectWallet = disconnectWallet;
window.revokeAllConnections = revokeAllConnections;
window.settleAndPay = settleAndPay;
window.startPrediction = startPrediction;
window.claimReward = claimReward;
window.resetGame = resetGame;

let balanceInterval = null;

async function updateUserBalance() {
  if (!provider || !userAddress) return;

  try {
    const balance = await provider.getBalance(userAddress);
    const formattedBalance = parseFloat(ethers.formatUnits(balance, 18)).toFixed(4);
    
    const balanceEl = document.getElementById('userBalance');
    if (balanceEl) {
      balanceEl.textContent = `${formattedBalance} USDC`;
    }
  } catch (e) {
    console.warn("Balance fetch failed", e);
  }
}

async function updateBalances() {
  // Update User Balance
  const userBal = await getUserBalance();
  const userEl = document.getElementById('userBalanceDisplay');
  if (userEl) userEl.textContent = `${userBal} USDC`;

  // Update System Balance
  const systemBal = await getSystemBalance();
  const systemEl = document.getElementById('systemBalanceDisplay');
  if (systemEl) systemEl.textContent = `${systemBal} USDC`;

  // Warning if system balance is low
  const warningContainer = document.getElementById('systemWarning');
  if (warningContainer) {
    warningContainer.style.display = parseFloat(systemBal) < 30 ? 'block' : 'none';
  }
}

async function autoClaimReward() {
  alert("Processing your reward...");

  try {
    const response = await fetch(`${BACKEND_URL}/api/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress: userAddress,
        amount: currentBet.amount
      })
    });

    const result = await response.json();

    if (result.success) {
      alert(`🎉 ${result.message}\nTx: ${result.txHash}`);
    } else {
      alert("Claim failed: " + result.message);
    }
  } catch (e) {
    alert("Cannot connect to backend.");
  }

  resetGame();
}

async function switchWallet() {
  if (!window.ethereum) return alert("No wallet detected");

  try {
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];
    alert("Wallet switched successfully");
    showScreen2();
  } catch (e) {
    alert("Failed to switch wallet");
  }
}

window.switchWallet = switchWallet;

console.log("System Wallet Address:", 
  new ethers.Wallet("0x123456789123456789123456789123456789123456789123456789").address);