import CONFIG from './config.js';
import { ethers } from "ethers";

let provider, signer, userAddress;
let currentBet = { amount: 1, time: 10, direction: "HIGHER" };
let startPrice = 0;
let endPrice = 0;
let countdownInterval = null;

const BACKEND_URL = "http://localhost:3001";   // Change this when you deploy backend

// ==================== GET ETH PRICE ====================
async function getETHPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    return parseFloat(data.ethereum.usd) || 3200;
  } catch (e) {
    console.warn("Price fetch failed, using fallback");
    return 3200;
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

  document.getElementById('app').innerHTML = `
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h2 style="margin:0">ON ARC</h2>
        <div onclick="disconnectWallet()" style="background:#FF8800;color:black;padding:6px 12px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:0.95rem">
          ${shortAddress}
        </div>
      </div>

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
      
      <!-- PREDICT BUTTON - Default Disabled -->
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
}

let livePriceInterval = null;
let isPredictionStarted = false;

function startLivePriceUpdates() {
  if (livePriceInterval) clearInterval(livePriceInterval);

  const updatePrices = async () => {
    const price = await getETHPrice();

    // Textbox 1: Live until PREDICT is pressed
    if (!isPredictionStarted) {
      const tb1 = document.getElementById('livePrice1');
      if (tb1) tb1.value = price.toFixed(2);
    }

    // Textbox 2: Live only after PREDICT is pressed
    if (isPredictionStarted) {
      const tb2 = document.getElementById('livePrice2');
      if (tb2) tb2.value = price.toFixed(2);
    }
  };

  // Initial call + every 1 second
  updatePrices();
  livePriceInterval = setInterval(updatePrices, 1000);
}

// ==================== BET CONTROLS ====================
window.selectAmount = (amt) => { currentBet.amount = amt; showScreen2(); };
window.selectTime = (t) => { currentBet.time = t; showScreen2(); };
window.selectDirection = (dir) => { currentBet.direction = dir; showScreen2(); };

// ==================== PAYMENT & GAME FLOW ====================
async function settleAndPay() {
  if (!signer) return alert("Wallet not connected");

  const confirmed = confirm(`Pay ${currentBet.amount} USDC?`);
  if (!confirmed) return;

  alert("✅ Payment confirmed (Demo)");

  // Enable PREDICT button with normal style
  const predictBtn = document.getElementById('predictBtn');
  if (predictBtn) {
    predictBtn.disabled = false;
    predictBtn.style.background = "#FF8800";
    predictBtn.style.color = "black";
    predictBtn.style.cursor = "pointer";
  }
}

function startPrediction() {
  isPredictionStarted = true;

  // Freeze current price in Textbox 1
  const currentPrice = parseFloat(document.getElementById('livePrice1').value) || 3200;
  startPrice = currentPrice;

  const tb1 = document.getElementById('livePrice1');
  tb1.style.background = "#e0e0e0";
  tb1.style.color = "#444";

  // Enable Textbox 2 for live updates
  const tb2 = document.getElementById('livePrice2');
  tb2.style.background = "#fff";

  // Show prediction area
  document.getElementById('predictionArea').style.display = 'block';

  // Disable everything else
  disableAllControls();

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

  showResultScreen(userWon);
}

function showResultScreen(won) {
  document.getElementById('app').innerHTML = `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px">
      <h1 style="font-size:4.5rem;color:${won ? 'green' : 'red'}">
        ${won ? "YOU WON!" : "YOU LOSE"}
      </h1>
      <p style="font-size:1.3rem">Bet: ${currentBet.amount} USDC | ${currentBet.direction}</p>
      <button class="btn" onclick="${won ? 'claimReward()' : 'resetGame()'}" 
              style="padding:20px 70px;font-size:1.4rem">
        ${won ? 'CLAIM 2x REWARD' : 'PLAY AGAIN'}
      </button>
    </div>
  `;
}

// ==================== CLAIM REWARD (Backend Call) ====================
async function claimReward() {
  if (!userAddress) return alert("Wallet not connected");

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
      alert(`🎉 2x REWARD SENT!\nTransaction: ${result.txHash}`);
    } else {
      alert("❌ Claim failed: " + (result.message || "Unknown error"));
    }
  } catch (error) {
    console.error(error);
    alert("❌ Cannot connect to backend.\nMake sure backend is running on port 3001");
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
  // Reset bet to default values
  currentBet = { amount: 1, time: 10, direction: "HIGHER" };
  
  // Reset prediction state
  isPredictionStarted = false;
  
  // Clear intervals
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (livePriceInterval) {
    clearInterval(livePriceInterval);
    livePriceInterval = null;
  }

  // Go back to Screen 2 with fresh default state
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