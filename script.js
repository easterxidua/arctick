import CONFIG from './config.js';
import { ethers } from "ethers";

let provider, signer, userAddress;
let currentBet = { amount: 1, time: 10, direction: "HIGHER" };
let startPrice = 0;
let endPrice = 0;
let countdownInterval = null;

let hargawisfix = 0;
let hargaisehjalan = 0;

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
    console.warn("❌ Binance API failed. ", e);
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

    alert(`✅ Wallet connected ∼ ${userAddress.slice(0,6)}...${userAddress.slice(-4)}.`);
    showScreen2();
  } catch (e) {
    console.error(e);
    alert("❌ Fail to connect. Do try again.");
  }
}

// ==================== SCREENS ====================
function showScreen1() {
  document.getElementById('app').innerHTML = `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:0px;background:transparent;padding:0px"; padding-top:40px>

      <img src="logo/arc_mascot_title.png"
           alt="arcdicted_mascot" 
           style="width:480px; height:auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">
      
      <div style="display:flex;flex-direction:column;gap:0px;width:100%;max-width:320px;margin-top:0px">
        <button class="btn" onclick="connectWallet()" style="padding:22px 60px;font-size:1.8rem">
          connect
        </button>

        <button class="btn_rev" onclick="revokeAllConnections()" 
                style="padding:22px 60px;font-size:1.8rem;">
          revoke
        </button>
      </div>
    </div>
  `;
}

// Default asset
currentBet.asset = "BTC";   // Change default if needed

window.selectAsset = (asset) => {
  currentBet.asset = asset;
  showScreen2();   // This will restart everything cleanly
};

// Dynamic price title
function updatePriceTitle() {
  const titleEl = document.getElementById('priceTitle');
  if (titleEl) {
    /*titleEl.textContent = `🔵 ${currentBet.asset}/USDT Live Price`;*/
    titleEl.innerHTML  = `${currentBet.asset} &bull; USDT Live Price`;
  }
}

async function showScreen2() {
  const shortAddress = userAddress ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : "";
  const userBal = await getUserBalance();
  const systemBal = await getSystemBalance();

  document.getElementById('app').innerHTML = `
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="margin:0" class="readonly2">arcDicted &bull; on ARC</div>
        <div onclick="disconnectWallet()" class="btn_smol">
          ${shortAddress}
        </div>
      </div>

      <!-- ARC Logo - Centered under disconnect button -->
      <div style="display:flex;justify-content:center;margin:15px 0 20px 0;">
        <img src="logo/arc_logo_small.png" 
             alt="arc_logo" 
             style="width:64px; height:auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">
      </div>

      <div class="readonly3" style="display:flex; justify-content:space-between; align-items:center;">
        Treasury's &bull; USDC balance ∼ <span id="systemBalanceDisplay"> ${systemBal} &bull; USDC</span>
      </div>

      <div class="readonly3" style="display:flex; justify-content:space-between; align-items:center;">
        Your &bull; USDC balance ∼ <span id="userBalanceDisplay"> ${userBal} &bull; USDC</span>
      </div>

<hr>

      <div class="readonly2"">
        🔵 Which coin's you want to predict its future price?</span>
      </div>

<div class="flex-row">
  <div class="option-btn-circle ${currentBet.asset==='BTC'?'active':''}" onclick="selectAsset('BTC')">
    <img src="logo/btc_logo_small.png" alt="btc_logo" width="32" height="32" filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));>
    
  </div>

  <div class="option-btn-circle ${currentBet.asset==='ETH'?'active':''}" onclick="selectAsset('ETH')">
    <img src="logo/eth_logo_small.png" alt="eth_logo"width="32" height="32" filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));>
    
  </div>

  <div class="option-btn-circle ${currentBet.asset==='SOL'?'active':''}" onclick="selectAsset('SOL')">
    <img src="logo/sol_logo_small.png" alt="sol_logo" width="32" height="32" filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));>
    
  </div>
</div>

      <div class="readonly2"">
        🔵 How many • USDC you're willing to bet?</span>
      </div>
      <div class="flex-row">
        <div class="option-btn ${currentBet.amount===1?'active':''}" onclick="selectAmount(1)">1 &bull; USDC</div>
        <div class="option-btn ${currentBet.amount===5?'active':''}" onclick="selectAmount(5)">5 &bull; USDC</div>
        <div class="option-btn ${currentBet.amount===10?'active':''}" onclick="selectAmount(10)">10 &bull; USDC</div>
      </div>

      <div class="readonly2"">
        🔵 How many seconds ahead you want to predict?</span>
      </div>
      <div class="flex-row">
        <div class="option-btn ${currentBet.time===10?'active':''}" onclick="selectTime(10)">10 seconds</div>
        <div class="option-btn ${currentBet.time===30?'active':''}" onclick="selectTime(30)">30 seconds</div>
        <div class="option-btn ${currentBet.time===60?'active':''}" onclick="selectTime(60)">60 seconds</div>
      </div>

      <div class="readonly2"">
        🔵 What's your prediction? HIGHER? LOWER?</span>
      </div>
      <div class="flex-row">

  <div class="option-btn-circle ${currentBet.direction==='HIGHER'?'active':''}" onclick="selectDirection('HIGHER')">
    <img src="logo/up_logo_small.png" alt="higher_logo" width="48" height="48" filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));>
  </div>
  <div class="option-btn-circle ${currentBet.direction==='LOWER'?'active':''}" onclick="selectDirection('LOWER')">
   <img src="logo/down_logo_small.png" alt="lower_logo" width="48" height="48" filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));>
  </div>

      </div>

<hr style="
  border:none;
  height:8px;
  background:transparent;
  margin:8px 0;
">
<hr>

      <div id="priceTitle" class="readonly3" style="text-align:center;">
        ${currentBet.asset} Live Price</span>
      </div>
      
      <div style="display:flex; align-items:center; gap:10px; margin:10px 0 6px 0;">
        <div class="readonly2" style="flex: 50%; text-align:left;" margin-left: 120px;>
         Your prediction marked price ∼
        </div>
        <input type="text" id="livePrice1" class="readonly_txt2" value="Loading..." readonly style="flex:1; text-align:right;" border-radius: 0px; margin-left: margin-right: 120px;>
      </div>

      <!-- COUNTDOWN + WARNING will be inserted here by JS when PREDICT is clicked -->
      <div id="predictionArea" style="display:none; text-align:center; margin:15px 0;">
        <input type="text" id="countdown" class="readonly_txt2" value="0" style="font-size:3.8rem;">
      </div>

      <input type="text" id="livePrice2" class="readonly_txt" value="Loading..." readonly style="display:none;">

<hr>

      <div class="readonly2"">
        🔵 Settle your • USDC bet.</span>
      </div>
      <button class="btn" id="settleBtn" onclick="settleAndPay()">settle ${currentBet.amount} &bull; USDC</button>
      
      <button id="predictBtn" class="btn_hide" onclick="startPrediction()" 
        const predictBtn = document.getElementById('predictBtn');
              style="opacity: 0.6; cursor: not-allowed;" disabled>
        predict
      </button>
    </div>
  `;

    // Disable Predict Button
  const predictBtn = document.getElementById('predictBtn');
  if (predictBtn) {
    predictBtn.disabled = true;
    predictBtn.style.pointerEvents = 'none';
    predictBtn.style.opacity = "0.6";
    predictBtn.style.cursor = "not-allowed";
  }

  startLivePriceUpdates();
  updateBalances();
  updatePriceTitle();
}

let livePriceInterval = null;
let isPredictionStarted = false;

function startLivePriceUpdates() {
  if (livePriceInterval) {
    clearInterval(livePriceInterval);
  }

  const updatePrices = async () => {
    const price = await getPrice(currentBet.asset);
    const pricefixed = hargawisfix; //await getPrice(currentBet.asset);
    const pricerun = await getPrice(currentBet.asset);

    const tb1 = document.getElementById('livePrice1');
    const tb2 = document.getElementById('livePrice2');

    if (tb1 && !isPredictionStarted) {
      tb1.value = price.toFixed(2);
      pricefixed = price.toFixed(2);
    }

    //hargawisfix = pricefixed;
	  hargaisehjalan = pricerun;
    //alert("hargaisehjalan1: " + hargaisehjalan + "hargawisfix1: " + hargawisfix);

    //alert("hargaisehjalan1: " + hargaisehjalan + "hargawisfix1: " + hargawisfix);
    //alert("pricefixed1: " + pricefixed + "pricerun1: " + pricerun);

      // Dynamic Color Logic
      if (pricerun > pricefixed) {
        tb2.style.background = "#22C55E";        // Green
      } else if (price2 < price1) {
        tb2.style.background = "#EF4444";        // Red
      } else {
        tb2.style.background = "#000000";        // Default greyish
      }

    if (tb2 && isPredictionStarted) {
      tb2.value = price.toFixed(2);
      pricerun = price.toFixed(2);

      //alert("pricefixed: " + pricefixed + "pricerun: " + pricerun);

      if (tb2 && isPredictionStarted) {
      tb2.value = price.toFixed(2);
      pricerun = price.toFixed(2);

      //const price1 = parseFloat(tb1.value) || 0;
      //const price2 = price;

      const price1 = pricefixed
      const price2 = pricerun;
      //alert("pricefixed1: " + pricefixed + "pricerun1: " + pricerun);

      // Dynamic Color Logic
      if (price2 > price1) {
        tb2.style.background = "#22C55E";        // Green
      } else if (price2 < price1) {
        tb2.style.background = "#EF4444";        // Red
      } else {
        tb2.style.background = "#000000";        // Default greyish
      }
    }

	  hargaisehjalan = pricerun;
    //alert("hargaisehjalan2: " + hargaisehjalan + "hargawisfix2: " + hargawisfix);

    }
  };

  updatePrices();                    // Immediate update
  livePriceInterval = setInterval(updatePrices, 1000); // 0.1 second
}

async function getPrice(asset) {
  try {
    let symbol;
    if (asset === 'BTC') symbol = 'BTCUSDT';
    else if (asset === 'ETH') symbol = 'ETHUSDT';
    else if (asset === 'SOL') symbol = 'SOLUSDT';

    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    const data = await res.json();

    if (data && data.price) {
      return parseFloat(data.price);
    } else {
      throw new Error("Invalid response");
    }
  } catch (e) {
    console.warn(`❌ Failed fetching ${asset} price from Binance.`, e);
    
    // Fallback prices
    if (asset === 'BTC') return 99999;
    if (asset === 'ETH') return 999;
    if (asset === 'SOL') return 9;
    return 0;
  }
}

// ==================== BET CONTROLS ====================
window.selectAmount = (amt) => { currentBet.amount = amt; showScreen2(); };
window.selectTime = (t) => { currentBet.time = t; showScreen2(); };
window.selectDirection = (dir) => { currentBet.direction = dir; showScreen2(); };

// ==================== PAYMENT & GAME FLOW ====================
async function settleAndPay() {
  if (!signer) return alert("❌ Wallet not connected.");

  const amount = currentBet.amount;
  const SYSTEM_WALLET = "0x9068d4a1edcea0e553525e8ca5edbe57dfe900b6";   // ← Make sure this is correct

  try {
    // Check balance first
    const balance = await provider.getBalance(userAddress);
    const required = ethers.parseUnits(amount.toString(), 18);

    if (balance < required) {
      alert(`❌ Insufficient • USDC!!!\n\nYou have ∼ ${ethers.formatUnits(balance, 18)} • USDC.`);
      return;
    }

    // Send payment
    const tx = await signer.sendTransaction({
      to: SYSTEM_WALLET,
      value: required
    });

    alert(`⏳ Sending ${amount} • USDC...\n\nTx ∼ ${tx.hash}.`);

    const receipt = await tx.wait();
    alert(`✅ Payment Successful!\n\n${amount} • USDC sent.`);

    // Disable controls and enable Predict button
    disableBetControls();

    startPrediction()

    const predictBtn = document.getElementById('predictBtn');
    if (predictBtn) {
      predictBtn.disabled = false;
      predictBtn.style.pointerEvents = 'auto';
      predictBtn.style.opacity = "1";
      predictBtn.style.cursor = "pointer";
    }

    // === UPDATE BALANCES AFTER PAYMENT ===
    await updateBalances();

  } catch (error) {
    console.error(error);
    if (error.code === 4001) {
      alert("❌ Transaction rejected by user.");
    } else {
      alert("❌ Payment failed ∼ " + (error.shortMessage || error.message) +".");
    }
  }
}

function startPrediction() {
  isPredictionStarted = true;

  // Freeze Textbox 1
  const tb1 = document.getElementById('livePrice1');

  startPrice = parseFloat(tb1.value) || 0;
  hargawisfix = startPrice
  tb1.style.background = "#ffffff00"; /*"#e0e0e0";*/

  // Disable Predict Button
  const predictBtn = document.getElementById('predictBtn');
  if (predictBtn) {
    predictBtn.disabled = true;
    predictBtn.style.pointerEvents = 'none';
    predictBtn.style.opacity = "0.6";
    predictBtn.style.cursor = "not-allowed";
  }

  // Show countdown between textbox 1 and 2
  document.getElementById('predictionArea').style.display = 'block';

  // Show textbox 2
  const tb2 = document.getElementById('livePrice2');
  tb2.style.display = 'block';

  disableBetControls();

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
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  const optionBtns2 = document.querySelectorAll('.option-btn-circle');
  optionBtns2.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  const optionBtns3 = document.querySelectorAll('.option-btn-circle2');
  optionBtns3.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  const settleBtn = document.getElementById('settleBtn');
  if (settleBtn) {
    settleBtn.disabled = true;
    settleBtn.style.pointerEvents = 'none';
    settleBtn.style.opacity = "0.6";
    settleBtn.style.cursor = "not-allowed";
  }
}

function disableAllControls() {
  // Disable buttons
  const buttons = document.querySelectorAll('.btn, .option-btn', option-btn-circle, option-btn-circle2);
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  // Disable price boxes except countdown
  document.getElementById('livePrice1').style.opacity = '0.7';
  document.getElementById('livePrice2').style.opacity = '1';
}

async function endGame() {
  endPrice = await getETHPrice();
  document.getElementById('livePrice2').value = hargaisehjalan; //endPrice.toFixed(2);

  //alert("hargaisehjalan: " + hargaisehjalan + "hargawisfix: " + hargawisfix);
  const isHigher = hargaisehjalan > hargawisfix //endPrice > startPrice;
  const userWon = (currentBet.direction === "HIGHER" && isHigher) || 
                  (currentBet.direction === "LOWER" && !isHigher);

  if (userWon) {
    await autoClaimReward();     // Automatic payout
  } else {
    alert("You LOSE. 😂");
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
  if (!userAddress) return alert("❌ Wallet not connected.");

  const loadingMsg = alert("⏳ Processing reward...");

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
      alert("❌ Claim failed: " + result.message + ".");
    }
  } catch (error) {
    console.error(error);
    alert("❌ Backend not found. Make sure backend is running.");
  }

  resetGame();
}

// ==================== DISCONNECT & REVOKE ====================
async function disconnectWallet() {
  if (!confirm("⚠️ Doing this will disconnect your wallet.\n\nContinue?")) return;
  userAddress = null;
  provider = null;
  signer = null;
  if (countdownInterval) clearInterval(countdownInterval);
  alert("✅ Wallet disconnected.");
  showScreen1();
}

async function revokeAllConnections() {
  if (!confirm("⚠️ Doing this will revoke your wallet connection from arcDicted.\n\nContinue?")) {
    return;
  }

  try {
    // Strong revocation
    if (window.ethereum) {
      // Revoke permissions
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      }).catch(() => {});

      // Disconnect
      await window.ethereum.request({
        method: 'eth_accounts'
      });
    }

    // Clear app state
    userAddress = null;
    provider = null;
    signer = null;

    if (countdownInterval) clearInterval(countdownInterval);
    if (livePriceInterval) clearInterval(livePriceInterval);
    if (balanceInterval) clearInterval(balanceInterval);

    alert("✅ Wallet revoked from arcDicted.");

    showScreen1();

  } catch (error) {
    console.error(error);
    // Fallback: Force reload
    location.reload();
  }
}

function resetGame() {
  // Keep the last chosen asset (don't reset it)
  const previousAsset = currentBet.asset || "BTC";

  // Reset only bet amount, time, and direction
  currentBet = { 
    asset: previousAsset,        // ← Keep last choice
    amount: 1, 
    time: 10, 
    direction: "HIGHER" 
  };
  
  isPredictionStarted = false;

  if (countdownInterval) clearInterval(countdownInterval);
  if (livePriceInterval) clearInterval(livePriceInterval);
  if (balanceInterval) clearInterval(balanceInterval);

  showScreen2();   // Refresh screen with preserved asset
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
    console.warn("❌ • USDC balance fetch failed. ", e);
  }
}

async function updateBalances() {
  // Update User Balance
  const userBal = await getUserBalance();
  const userEl = document.getElementById('userBalanceDisplay');
  if (userEl) userEl.innerHTML = `${userBal} &bull; USDC`;

  // Update System Balance
  const systemBal = await getSystemBalance();
  const systemEl = document.getElementById('systemBalanceDisplay');
  if (systemEl) systemEl.innerHTML = `${systemBal} &bull; USDC`;
}

async function autoClaimReward() {
  alert("⏳ Processing your reward...");

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
      alert(`🎉 ${result.message}.\n\nTx ∼ ${result.txHash}.`);
    } else {
      alert("❌ Claim failed ∼ " + result.message + ".");
    }
  } catch (e) {
    alert("❌ Backend not found.");
  }

  resetGame();
}

async function switchWallet() {
  if (!window.ethereum) return alert("❌ No wallet detected.");

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