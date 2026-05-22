import CONFIG from './config.js';
import { ethers } from "ethers";

let provider, signer, userAddress;
let currentBet = { amount: 1, time: 10, direction: "HIGHER" };
let startPrice = 0;
let endPrice = 0;
let countdownInterval = null;

// Get real ETH price
async function getETHPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    return parseFloat(data.ethereum.usd) || 3200;
  } catch (e) {
    return 3200;
  }
}

async function updateLivePrice(textboxId) {
  const price = await getETHPrice();
  const el = document.getElementById(textboxId);
  if (el) el.value = price.toFixed(2);
}

// ==================== CONNECT WALLET (Already working) ====================
async function connectWallet() {
  if (!window.ethereum) return alert("No wallet found");

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];

    const chain = CONFIG.chains[CONFIG.defaultChain];

    try {
      await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ ...chain }] });
    } catch (e) {}

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.chainId }]
    });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    alert(`✅ Connected: ${userAddress.slice(0,8)}...`);
    showScreen2();
  } catch (e) {
    console.error(e);
    alert("Connection error");
  }
}

// ==================== SCREENS ====================
function showScreen1() {
  document.getElementById('app').innerHTML = `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;background:rgba(255,255,255,0.95)">
      <h1 style="font-size:3.5rem">PREDICT ETH</h1>
      <button class="btn" onclick="connectWallet()" style="padding:25px 80px;font-size:1.8rem">CONNECT WALLET</button>
    </div>
  `;
}

async function showScreen2() {
  const shortAddress = userAddress 
    ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` 
    : "Not Connected";

  document.getElementById('app').innerHTML = `
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <h2 style="margin:0">ON ARC</h2>
        <div onclick="disconnectWallet()" 
             style="background:#FF8800;color:black;padding:8px 14px;border-radius:8px;
                    font-size:0.95rem;font-weight:bold;cursor:pointer">
          ${shortAddress}
        </div>
      </div>

      <h1>PREDICT ETH PRICES</h1>

      <h2>BET AMOUNT</h2>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <div class="option-btn ${currentBet.amount===1?'active':''}" onclick="selectAmount(1)">1 USDC</div>
        <div class="option-btn ${currentBet.amount===5?'active':''}" onclick="selectAmount(5)">5 USDC</div>
        <div class="option-btn ${currentBet.amount===10?'active':''}" onclick="selectAmount(10)">10 USDC</div>
      </div>

      <h2>TIME FRAME</h2>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <div class="option-btn ${currentBet.time===10?'active':''}" onclick="selectTime(10)">10 SECONDS</div>
        <div class="option-btn ${currentBet.time===30?'active':''}" onclick="selectTime(30)">30 SECONDS</div>
        <div class="option-btn ${currentBet.time===60?'active':''}" onclick="selectTime(60)">60 SECONDS</div>
      </div>

      <h2>PREDICTION</h2>
      <div style="display:flex;gap:12px;justify-content:center">
        <div class="option-btn ${currentBet.direction==='HIGHER'?'active':''}" onclick="selectDirection('HIGHER')">HIGHER</div>
        <div class="option-btn ${currentBet.direction==='LOWER'?'active':''}" onclick="selectDirection('LOWER')">LOWER</div>
      </div>

      <h2>ETH LIVE PRICE</h2>
      <input type="text" id="livePrice1" class="readonly" value="Loading..." readonly>
      <input type="text" id="livePrice2" class="readonly" value="0.00" readonly>

      <button class="btn" onclick="settleAndPay()" style="margin:25px 0 10px;width:100%;padding:18px">SETTLE ${currentBet.amount} USDC</button>

      <div id="predictionArea" style="display:none; text-align:center">
        <input type="text" id="countdown" class="readonly" value="0" style="font-size:3rem; margin:15px 0">
        <button id="predictBtn" class="btn" onclick="startPrediction()" disabled style="width:100%">PREDICT NOW</button>
      </div>
    </div>
  `;

  // Start live price updates
  setInterval(() => updateLivePrice('livePrice1'), 4000);
  updateLivePrice('livePrice1');
}

window.selectAmount = (amt) => { currentBet.amount = amt; showScreen2(); };
window.selectTime = (t) => { currentBet.time = t; showScreen2(); };
window.selectDirection = (dir) => { currentBet.direction = dir; showScreen2(); };

async function settleAndPay() {
  if (!signer) return alert("Wallet not connected");

  // TODO: Real USDC transfer (demo for now)
  const confirmed = confirm(`Pay ${currentBet.amount} USDC to place bet?`);
  if (!confirmed) return;

  alert("✅ Payment confirmed (Demo - In real version this will transfer tokens)");
  document.getElementById('predictionArea').style.display = 'block';
  document.getElementById('predictBtn').disabled = false;
}

function startPrediction() {
  startPrice = parseFloat(document.getElementById('livePrice1').value);
  document.getElementById('livePrice1').style.background = "#e0e0e0";

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

window.claimReward = () => {
  alert("🎉 2x Reward sent to your wallet! (Backend simulation)");
  resetGame();
};

window.resetGame = () => {
  currentBet = { amount: 1, time: 10, direction: "HIGHER" };
  showScreen2();
};

// Initialize
document.addEventListener('DOMContentLoaded', showScreen1);

window.connectWallet = connectWallet;

// Add this function (replace the old one)
async function disconnectWallet() {
  if (!confirm("Disconnect wallet from this app?")) return;

  try {
    // Best practice: Revoke permissions (works on MetaMask)
    if (window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{
          eth_accounts: {}
        }]
      }).catch(() => {}); // Ignore if not supported
    }

    // Clear all local state
    userAddress = null;
    provider = null;
    signer = null;

    // Clear any intervals
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    alert("✅ Wallet disconnected successfully");
    showScreen1(); // Return to connect screen

  } catch (error) {
    console.error("Disconnect error:", error);
    // Fallback: just clear state and reload
    userAddress = null;
    provider = null;
    signer = null;
    location.reload();
  }
}

window.disconnectWallet = disconnectWallet;