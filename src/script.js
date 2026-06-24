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

window.debugBet = async function (id = 1) {
  const contract = new ethers.Contract(
    BET_RECORDER_ADDRESS,
    BET_RECORDER_ABI,
    signer
  );

  const bet = await contract.getBet(id);

  const readableBet = {
    betId: Number(bet.betId),
    player: bet.player,
    asset: bet.asset,
    higher: bet.higher,
    amount: Number(bet.amount),
    startPrice: Number(bet.startPrice),
    duration: Number(bet.duration),
    timestamp: Number(bet.timestamp),
    settled: bet.settled,
    endPrice: Number(bet.endPrice),
    won: bet.won
  };

  console.log("BET:", readableBet);
};
// smart_contract

import { Buffer } from "buffer";

window.Buffer = Buffer;

import process from "process";

window.process = process;

import CONFIG from "@/config";
import "@/index.css";

import { ethers } from "ethers";
import { getArcAdapter } from "./arcAdapter.js";

let provider, signer, userAddress;

let arcAdapter;

let currentBet = { amount: 1, time: 10, direction: "HIGHER" };
let startPrice = 0;
let endPrice = 0;
let countdownInterval = null;

let hargawisfix = 0;
let hargawisfixtenanan = 0;
let hargaisehjalan = 0;

let selectedChain = CONFIG.defaultChain;
//let selectedChain = "arc-testnet";   // default
let jenengechain = "MBOH";

const USDC_ABI = [
  "function transfer(address to, uint amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

//const BACKEND_URL = "https://arctick-production.up.railway.app";  // Change this when you deploy backend
const BACKEND_URL =
import.meta.env.VITE_BACKEND_URL;

const SYSTEM_WALLET_X = "0x9068d4a1edcea0e553525e8ca5edbe57dfe900b6"; 
const TREASURY_ADDRESS = "0x9068d4a1edcea0e553525e8ca5edbe57dfe900b6";

const VAULT_ADDRESS =
  import.meta.env.VITE_VAULT_ADDRESS;
const VAULT_ADDRESS_USDC =
  import.meta.env.VITE_VAULT_ADDRESS_USDC;

const VAULT_ABI = [
  "function deposit(address user,bytes32 keyHash,uint256 amount)",
  "function withdraw(address user,bytes32 keyHash,uint256 amount,address recipient)",
  "function getBalance(address user,bytes32 keyHash)view returns(uint256)"
];

async function getVaultContract() {

  const provider =
    new ethers.BrowserProvider(window.ethereum);

  const signer =
    await provider.getSigner();

  return new ethers.Contract(
    VAULT_ADDRESS,
    VAULT_ABI,
    signer
  );
}

// smart_contract
/*
async function recordBetOnChain() {

  try {

    if (!signer) {
      console.log(
        "No signer, skip recording"
      );
      return;
    }

    const contract =
      new ethers.Contract(
        BET_RECORDER_ADDRESS,
        BET_RECORDER_ABI,
        signer
      );

console.log(
  "Recording:",
  {
    asset: currentBet.asset,
    direction: currentBet.direction,
    amount: currentBet.amount,
    startPrice,
    hargawisfix
  }
);

const tx = await contract.recordBet(
  currentBet.asset,
  currentBet.direction === "HIGHER",
  currentBet.amount,
  Math.floor(hargawisfix * 100),   // IMPORTANT FIX
  currentBet.time
);

const receipt = await tx.wait();
console.log("TX:", receipt.hash);
console.log(receipt);

    console.log(
      "Recording bet..."
    );

const betId =
  await contract.nextBetId();

currentBet.betId =
  Number(betId) - 1;

console.log(
  "Bet ID:",
  currentBet.betId
);

    console.log(
      "Bet recorded:",
      tx.hash
    );

    const bet = await contract.getBet(1);

    console.log("XXXXXXXXX:", bet);

  console.log({
  betId: bet.betId,
  player: bet.player,
  asset: bet.asset,
  higher: bet.higher,
  amount: bet.amount,
  startPrice: bet.startPrice,
  duration: bet.duration,
  timestamp: bet.timestamp,
  settled: bet.settled,
  endPrice: bet.endPrice,
  won: bet.won
});

//const count =
//await contract.getBetCount();

//console.log(
  //"Total Bets:",
  //count.toString()
//);

currentBet.betId = Date.now();

  } catch (e) {

    console.error(
      "recordBetOnChain failed",
      e
    );

  }
}
*/

function generateSecretKey() {
  return ethers.hexlify(
    ethers.randomBytes(32)
  );
}

function getKeyHash(secretKey) {

  return ethers.keccak256(
    ethers.toUtf8Bytes(secretKey)
  );

}

function closeAllToasts() {
  document.querySelectorAll(".toast").forEach(toast => {
    toast.remove();
  });
}

function repositionToasts() {

  document
    .querySelectorAll(".toast")
    .forEach((toast, index) => {

      toast.style.top =
        `${20 + index * 60}px`;

    });
  let top = 20;

}

function showToast(
  message,
  duration = 3000,
  delay = 0
) {

  const toast = document.createElement("div");

  toast.innerHTML = `
    <div style="
      position:fixed;
      top:${20 + document.querySelectorAll('.toast').length * 60}px;
      background:rgba(0, 100, 200, 0.9);
      color:white;
      padding:12px 20px;
      border: 3px solid rgb(255, 255, 255, 0.8);
      border-radius:9999px;
      z-index:99999;
      display:flex;
      align-items:center;
      gap:10px;
      width:fit-content;
  width:max-content;
  max-width:90vw;
  white-space:nowrap;
  box-sizing:border-box;
      box-shadow:0 4px 12px rgba(0,0,0,0.4);
      transition: top 1s ease;
    ">
      <span>${message}</span>

      <span
        style="
          cursor:pointer;
          font-weight:bold;
        "
      >
        ✖
      </span>
    </div>
  `;

  const box = toast.firstElementChild;
  box.classList.add("toast");

  // ADD THIS HERE
const chainModal =
  document.getElementById("chainModal");

if (
  chainModal &&
  chainModal.style.display !== "none"
) {

  const content =
    chainModal.firstElementChild;

  const rect =
    content.getBoundingClientRect();

  box.style.left =
    `${rect.left + rect.width / 2}px`;

} else {

  box.style.left = "50%";

}

box.style.transform =
  "translateX(-50%)";
  // ADD THIS HERE

  setTimeout(() => {

document.body.appendChild(box);

repositionToasts();

setTimeout(close, duration);

}, delay);

const close = () => {

  if (box.parentNode) {

    box.remove();

    repositionToasts();

  }

};

  box.querySelector("span:last-child")
    .onclick = close;
}

function customAlert(message) {

  return new Promise((resolve) => {

    const modal = document.createElement("div");

    modal.style.cssText = `
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.6);
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:99999;
    `;

    modal.innerHTML = `
      <div
        style="
          background:white;
          padding:20px;
          border-radius:20px;
          width:300px;
          text-align:center;
          position:relative;
        "
      >

        <button
          id="customAlertClose"
          style="
            position:absolute;
            top:10px;
            right:10px;
            border:none;
            background:none;
            cursor:pointer;
            font-size:20px;
          "
        >
          ✖
        </button>

        <div style="margin-top:10px;">
          ${message}
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    modal.onclick = () => {
      modal.remove();
      resolve();
    };

    modal.firstElementChild.onclick = (e) => {
      e.stopPropagation();
    };

    document.getElementById(
      "customAlertClose"
    ).onclick = () => {

      modal.remove();
      resolve();

    };

  });

}

async function recordBetOnChain() {

  try {

    console.log(
      "Sending bet to backend..."
    );

    const response =
      await fetch(
        BACKEND_URL + "/api/record-bet",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

  player:
    userAddress,

        asset:
          currentBet.asset,

        higher:
          currentBet.direction === "HIGHER",

        amount:
          currentBet.amount,

        startPrice:
          Math.floor(hargawisfix * 100),

        duration:
          currentBet.time

          })
        }
      );

          console.log("Player:", userAddress);

    const result =
      await response.json();

    console.log(
      "Backend result:",
      result
    );

    currentBet.betId =
  Number(result.betId);

console.log(
  "Saved betId:",
  currentBet.betId
);

    if (!result.success) {

      console.error(
        result.message
      );

      return;
    }

    currentBet.txHash =
      result.txHash;

    console.log(
      "Bet recorded:",
      result.txHash
    );

  } catch (e) {

    console.error(
      "recordBetOnChain failed",
      e
    );

  }

}

async function settleBetBackend(
  betId,
  endPrice,
  won
) {

  console.log({
  betId: currentBet.betId,
  endPrice: hargawisfix,
  //won: userwon
});

  const response =
    await fetch(
      `${BACKEND_URL}/api/settle-bet`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          betId,
          endPrice,
          won
        })
      }
    );

  const result =
    await response.json();

  console.log(
    "Settlement:",
    result
  );

}

async function settleBetOnChain(
  endPrice,
  won
) {

  try {

    const contract =
      new ethers.Contract(
        BET_RECORDER_ADDRESS,
        BET_RECORDER_ABI,
        signer
      );

    const tx =
      await contract.settleBet(
        currentBet.betId,
        Math.floor(endPrice * 100),
        won
      );

      console.log("TX SENT:", tx.hash);
      
    await tx.wait();

    console.log(
      "Bet settled:",
      currentBet.betId
    );

  } catch (e) {

    console.error(
      "settleBetOnChain failed",
      e
    );

  }

}
// smart_contract

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
  //const price = await getETHPrice();
  //const el = document.getElementById(textboxId);
  //if (el) el.value = price.toFixed(2);
}

// ==================== CONNECT WALLET ====================
async function connectWallet() {
  if (!window.ethereum) return showToast(
    "❌ No EVM wallet detected.",
    3000,
    0
    );
    //alert("❌ No EVM wallet detected.");

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];

    //const chain = CONFIG.chains[CONFIG.defaultChain];
    const chain = CONFIG.chains[selectedChain];

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

    arcAdapter = await getArcAdapter();

    console.log("Arc Adapter:", arcAdapter);

    //alert(`✅ Wallet connected: ${userAddress.slice(0,6)}...${userAddress.slice(-4)}.`);
    showToast(
    `✅ Wallet connected: ${userAddress.slice(0,6)}...${userAddress.slice(-4)}`,
    3000,
    0
    );
    showScreen2();
  } catch (e) {
    console.error(e);
    //alert("❌ Fail to connect. Do try again.");
    showToast(
    "❌ Fail to connect. Do try again.",
    3000,
    0
    );
  }
}

// ==================== SCREENS ====================
function showScreen1() {
  document.getElementById('root').innerHTML = `
    <div class="container" style="display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:0px;background:transparent;padding:0px"; padding-top:40px>
      <img src="/logo/arc_mascot_title333_fit.png"
           alt="arcdicted_mascot" 
           style="margin-top:40px; margin-bottom:30px; max-width:480px; width:90%; height:auto;">
      
      <div style="display:flex;flex-direction:column;gap:0px;width:100%;max-width:320px;margin-top:0px">
        <button class="btn" onclick="connectWallet()" style="padding:22px 60px;font-size:1.8rem">
          connect
        </button>

        <button class="btn_rev" onclick="revokeAllConnections()" 
                style="padding:22px 60px;font-size:1.8rem;">
          revoke
        </button>

  <!-- <button -->
  <!-- class="btn_rev" -->
  <!-- onclick="showLeaderboard()" -->
  <!-- style="padding:22px 60px;font-size:1.8rem;" -->
  <!-- > -->
  <!-- leaderboard -->
  <!-- </button> -->

      </div>

      <div style="height:0px;"></div>

<!-- GitHub Icon - Centered at the very bottom -->
      <a href="https://github.com/kaduanganu/eth-predict-arc" 
         target="_blank"
         style="position:absolute; bottom:35px; left:50%; transform:translateX(-50%); 
                color:#555; text-decoration:none; font-size:0.9rem; 
                display:flex; align-items:center; gap:8px;">
      <img src="https://github.githubassets.com/favicons/favicon.png" 
              width="32" height="32" 
              style="vertical-align:middle; 
                     filter: brightness(0.9) saturate(2) hue-rotate(200deg);">
      </a>
    </div>
  `;
}

// Default asset
currentBet.asset = "BTC";   // Change default if needed

window.selectAsset = (asset) => {
  currentBet.asset = asset;
  showScreen2();   // This will restart everything cleanly
};

window.changeChain = async function(chainKey) {

  selectedChain = chainKey;

  const chain = CONFIG.chains[chainKey];

  try {

    // Add chain to wallet if needed
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: chain.chainId,
        chainName: chain.name,
        rpcUrls: [chain.rpcUrl],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18
        },
        blockExplorerUrls: [chain.explorer]
      }]
    });

    // Switch wallet to selected chain
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain.chainId }]
    });

    // Refresh ethers provider
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    jenengechain = chain.name;
    //alert(`✅ Switched to ${chain.name}.`);

    showScreen2();

  } catch (err) {
    console.error(err);
    //alert("❌ Chain switch failed.");
    showToast(
    "❌ Chain switch failed.",
    3000,
    0
    );
  }
};

// Dynamic price title
function updatePriceTitle() {
  const titleEl = document.getElementById('priceTitle');
  if (titleEl) {
    /*titleEl.textContent = `🔵 ${currentBet.asset}/USDT Live Price`;*/
    titleEl.innerHTML  = `${currentBet.asset} ● USDT Live Price`;
  }
}

function generateKey() {
  const now = new Date();

  const chars =
    'abcdefghijklmnopqrstuvwxyz0123456789';

  const randomChar = () =>
    chars[Math.floor(Math.random() * chars.length)];

  const seconds = String(now.getSeconds()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const millis = String(now.getMilliseconds()).padStart(3, '0');
  const year = String(now.getFullYear()).slice(-2);
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const timestamp =
    seconds +
    day +
    hours +
    month +
    millis +
    year +
    minutes;

  let key = randomChar();

  for (let i = 0; i < timestamp.length; i++) {
    key += timestamp[i];

    if ((i + 1) % 3 === 0 && i !== timestamp.length - 1) {
      key += randomChar();
    }
  }

  // ===== Remove 4 random positions =====
  let arr = key.split('');

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    arr.splice(randomIndex, 1);
  }

  return arr.join('');
}

async function depositUSDC() {

  try {

    if (!signer) {

      showToast(
        "❌ Wallet not connected.",
        3000,
        0
      );

      return;
    }

    const amount =
      document.getElementById(
        "livePrice111"
      ).value;

    const secret =
      document.getElementById(
        "livePrice111key"
      ).value;

    const keyHash =
      ethers.keccak256(
        ethers.toUtf8Bytes(secret)
      );

    const chainKey =
      selectedChain;

    const chainConfig =
      CONFIG.chains[chainKey];

    const usdc =
      new ethers.Contract(
        chainConfig.usdcAddress,
        USDC_ABI,
        signer
      );

    const amount6 =
      ethers.parseUnits(
        amount,
        6
      );

    //
    // CHECK BALANCE
    //

    const balance =
      await usdc.balanceOf(
        userAddress
      );

    if (balance < amount6) {

      showToast(
        "❌ Insufficient ● USDC.",
        3000,
        0
      );

      return;
    }

    //
    // SEND TO TREASURY
    //

    const tx =
      await usdc.transfer(
        TREASURY_ADDRESS,
        amount6
      );

    await tx.wait();

    //
    // TELL BACKEND
    //

    const response =
      await fetch(
        `${BACKEND_URL}/api/vault/deposit`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            amount,
            chain: chainKey,
            keyHash,
            userAddress
          })
        }
      );

    const result =
      await response.json();

    if (!result.success) {

      throw new Error(
        result.message
      );
    }

    //
    // BRIDGE ONLY IF NEEDED
    //

    if (
      chainKey !==
      "arc-testnet"
    ) {

      const bridgeResponse =
        await fetch(
          `${BACKEND_URL}/api/bridge-to-arc`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              amount,
              chain: chainKey
            })
          }
        );

      const bridgeResult =
        await bridgeResponse.json();

      if (
        bridgeResult.state ===
        "error"
      ) {

        throw new Error(
          "Bridge failed"
        );
      }
    }

    showToast(
      "✅ Deposit successful.",
      3000,
      1
    );

  } catch (err) {

    console.error(err);

    showToast(
      "❌ Deposit failed.",
      3000,
      0
    );

  }

}

window.depositUSDC = depositUSDC;

async function previewVault() {

  const secret =
    document.getElementById(
      "livePrice111keyWD"
    ).value;

  const keyHash =
    ethers.keccak256(
      ethers.toUtf8Bytes(secret)
    );

  const vault =
    await getVaultReadOnly();

  const balance =
    await vault.getBalance(
      keyHash
    );

  document.getElementById(
    "livePrice111WD"
  ).placeholder =
    ethers.formatUnits(
      balance,
      6
    );
}

window.previewVault = previewVault;

async function withdrawUSDC() {

  try {

    const amount =
      document.getElementById(
        "livePrice111WD"
      ).value;

    const secret =
      document.getElementById(
        "livePrice111keyWD"
      ).value;

    const response =
      await fetch(
        `${BACKEND_URL}/api/vault/withdraw`,
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            amount,

            secret,

            userAddress

          })

        }
      );

    const result =
      await response.json();

    if (!result.success) {

      throw new Error(
        result.message
      );

    }

    showToast(
      "✅ Withdraw complete",
      3000,
      1
    );

  } catch(err) {

    console.error(err);

    showToast(
      "❌ Withdraw failed",
      3000,
      0
    );

  }

}

window.withdrawUSDC = withdrawUSDC;

async function refreshVaultBalance() {

  const response =
    await fetch(
      `${API_URL}/api/vault-balance?address=${userAddress}`
    );

  const data =
    await response.json();

  document.getElementById(
    "systemBalanceDisplay"
  ).innerHTML =
    `${data.balance} ● USDC`;

}

async function showScreen2() {
  const shortAddress = userAddress ? `${userAddress.slice(0,6)}...${userAddress.slice(-4)}` : "";
  const userBal = await getUserBalance();
  const systemBal = await getSystemBalance();

  const chainLogo = {
  "arc-testnet": "/logo/arc_logo_small2_opaq2.png",
  "base-sepolia": "/logo/base_logo_small.png",
  "ink-sepolia": "/logo/ink_logo_small.png",
  "arbitrum-sepolia": "/logo/arb_logo_small.png",
  "eth-sepolia": "/logo/eth_logo_small.png",
  "avalanche-fuji": "/logo/avax_logo_small.png",
  "hyperevm-testnet": "/logo/hype_logo_small.png",
  "unichain-sepolia": "/logo/uni_logo_small_testnet.png"
  };

  const logoWidth = window.innerWidth <= 768 ? '80%' : '50%';

  const handleAmountInput = (e) => {
  let raw = e.target.value.replace(/\D/g, '');
  raw = raw.slice(0, 6);

  // actual value
  window.depositAmount = raw;

  // display value
  e.target.value = raw
    ? new Intl.NumberFormat('id-ID').format(raw)
    : '';
  };

  document.getElementById('root').innerHTML = `
    <div class="container">
      <div style="display:flex;justify-content:flex-start;gap:8px;align-items:center;margin-bottom:8px;">
        <div style="margin:0" class="readonly33">
         <img src="/logo/logo_judul_333_fit.png"
         style="width:${logoWidth}; height:auto; position: relative; top: 0px;"></div>
        <div onclick="showLeaderboard()" class="btn_smol_ns">
        🌟
        </div>

        <div onclick="disconnectWallet()" class="btn_smol">
          ${shortAddress}
        </div>
      </div>

      <div class="readonly2">
        🔵 choose your prefered chain.</span>
      </div>

<div
  style="
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    class="readonly33"
  "
>
      <div class="readonly2X" style="font-size:1.8rem;">
        ●</span>
      </div>
  <img
    src="${chainLogo[selectedChain]}"
    width="64"
    height=auto
  >
      <div class="readonly2" style="font-size:1.8rem;">
        ●</span>
      </div>
</div>

<div style="height:20px;"></div>





<div
  id="chainModal"
  style="
    display:none;
    position:fixed;
    inset:0;
    background:rgba(255, 255, 255, 0.9);
    z-index:8888;

    justify-content:center;
    align-items:flex-start;

    overflow-y:auto;
    padding-top:20px;
    padding-bottom:20px;
    box-sizing:border-box;
  "
>

  <div
    style="
      background:transparent;
      width:90vw;
      max-width:228px;
    "
  >

      <div class="readonly2" style="font-size:1.3rem; text-align:center;">
        🔵 pick a chain.</span>
      </div>

    <div class="flex-row" style="flex-direction: column;">

      <div
        class="option-btn-circle ${selectedChain==='arc-testnet' ? 'active' : ''}"
        onclick="changeChainAndClose('arc-testnet')"
      >
        <img src="/logo/arc_logo_small2_opaq2.png" width="32" style="position: relative; top: 1px;">
      </div>

      <div
        class="option-btn-circle ${selectedChain==='base-sepolia' ? 'active' : ''}"
        onclick="changeChainAndClose('base-sepolia')"
      >
        <img src="/logo/base_logo_small.png" width="32" style="position: relative; top: 1px;">
      </div>

      <div
        class="option-btn-circle-unsupported ${selectedChain==='eth-sepolia' ? 'active' : ''}"
        onclick="event.stopPropagation(); gekunsupported();"
      >
        <img src="/logo/eth_logo_small.png" width="32" style="position: relative; top: 1px;">
      </div>

      <div
        class="option-btn-circle ${selectedChain==='arbitrum-sepolia' ? 'active' : ''}"
        onclick="changeChainAndClose('arbitrum-sepolia')"
      >
        <img src="/logo/arb_logo_small.png" width="32" style="position: relative; top: 1px;">
      </div>

      <div
        class="option-btn-circle ${selectedChain==='unichain-sepolia' ? 'active' : ''}"
        onclick="changeChainAndClose('unichain-sepolia')"
      >
        <img src="/logo/uni_logo_small_testnet.png" width="32" style="position: relative; top: 1px;">
      </div>

      <div
        class="option-btn-circle ${selectedChain==='avalanche-fuji' ? 'active' : ''}"
        onclick="changeChainAndClose('avalanche-fuji')"
      >
        <img src="/logo/avax_logo_small.png" width="32" style="position: relative; top: 1px;">
      </div>

      <div
        class="option-btn-circle ${selectedChain==='hyperevm-testnet' ? 'active' : ''}"
        onclick="changeChainAndClose('hyperevm-testnet')"
      >
        <img src="/logo/hype_logo_small.png" width="32" style="position: relative; top: 1px;">
      </div>

      <div
        class="option-btn-circle ${selectedChain==='ink-sepolia' ? 'active' : ''}"
        onclick="changeChainAndClose('ink-sepolia')"
      >
        <img src="/logo/ink_logo_small.png" width="32" style="position: relative; top: 1px;">
      </div>
    </div>

<div style="height:8px;"></div>

<div class="flex-row" style="flex-direction: column;">
  <button
    class="btn_op_rev2"
    onclick="hideChainlist()"
    style = "font-size:1.3rem;"
  >
    back
  </button>
</div>

  </div>

</div>





<div class="flex-row">

  <div
    class="option-btn-circle ${selectedChain==='arc-testnet' ? 'active' : ''}"
    onclick="changeChain('arc-testnet')"
  >
    <img src="/logo/arc_logo_small2_opaq2.png"
         width="32"
         style="position: relative; top: 1px;">
  </div>

  <div
    class="option-btn-circle ${selectedChain==='base-sepolia' ? 'active' : ''}"
    onclick="changeChain('base-sepolia')"
  >
    <img src="/logo/base_logo_small.png"
         width="32"
         style="position: relative; top: 1px;">
  </div>

<button
    class="btn_op_rev2" style="font-size:1.1rem;"
    onclick="showChainlist()">
        all chains</span>
  </button>


</div>

<div style="height:20px;"></div>

<hr>

      <div class="readonly3" style="display:flex; justify-content:space-between; align-items:center;">
        ○ on vault • <span id="systemBalanceDisplay"> ${systemBal} ● USDC</span>
      </div>

      <div class="readonly3" style="display:flex; justify-content:space-between; align-items:center;">
        ○ on wallet • <span id="userBalanceDisplay"> ${userBal} ● USDC</span>
      </div>

<hr>

      <div id="livePrice111Deposit" class="readonly3" style="text-align:center;">
        deposit ● USDC</span>
      </div>
      
      <div style="display:flex; align-items:center; gap:10px; margin:10px 0 6px 0;">
        <div class="readonly3" style="flex: 50%; text-align:left;" margin-left: 120px;>
         ○ how many? •
        </div>
        <input type="text"
        inputmode="numeric"
        placeholder=""
        id="livePrice111" class="inputan" value="" style="flex:50%; text-align:center; border-radius: 0px; margin-left: margin-right: 120px;">

      </div>
      <div style="display:flex; align-items:center; gap:10px; margin:10px 0 6px 0;">
        <div class="readonly3" style="flex: 50%; text-align:left;" margin-left: 120px;>
         ○ click to copy the key •
        </div>
        <input type="text" id="livePrice111key" class="inputan_readonly" value="" style="flex:50%; text-align:center; border-radius: 0px; margin-left: margin-right: 120px;">
      </div>

<div style="height:20px;"></div>

<hr>

      <div id="livePrice111Withdraw" class="readonly3" style="text-align:center;">
        withdraw ● USDC</span>
      </div>
      
      <div style="display:flex; align-items:center; gap:10px; margin:10px 0 6px 0;">
        <div class="readonly3" style="flex: 50%; text-align:left;" margin-left: 120px;>
         ○ how many? •
        </div>
        <input type="text"
        inputmode="numeric"
        placeholder=""
        id="livePrice111WD" class="inputan" value="" style="flex:50%; text-align:center; border-radius: 0px; margin-left: margin-right: 120px;">

      </div>
      <div style="display:flex; align-items:center; gap:10px; margin:10px 0 6px 0;">
        <div class="readonly3" style="flex: 50%; text-align:left;" margin-left: 120px;>
         ○ paste the key •
        </div>
        <input type="text" id="livePrice111keyWD" class="inputan" value="" style="flex:50%; text-align:center; border-radius: 0px; margin-left: margin-right: 120px;">
      </div>

<div style="height:20px;"></div>

<hr>

<div style="height:20px;"></div>

  <div id="loadingScreen">
  <img src="/logo/usdc_logo.png" width="120">
  <div></div>
  </div>

  <button
    class="btn_red"
    style="flex:1;"
    onclick="depositUSDC();">
    <img src="/logo/down_logo_small_white.png" alt="higher_logo" width="48" height="48" filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
    style="position: relative; top: 1px;">

  </button>

    </div>
  `;

setupKeyInput();

const input = document.getElementById('livePrice111');
const input2 = document.getElementById('livePrice111WD');

function formatCurrencyInput(e) {
  let raw = e.target.value.replace(/\D/g, '');
  raw = raw.slice(0, 6);

  e.target.dataset.rawValue = raw;

  e.target.value = raw
    ? new Intl.NumberFormat('id-ID').format(raw)
    : '';
}

input?.addEventListener('input', formatCurrencyInput);
input2?.addEventListener('input', formatCurrencyInput);

function setupKeyInput() {
  const keyInput = document.getElementById('livePrice111key');

  if (!keyInput) return;

  keyInput.value = generateSecretKey();

  keyInput.onclick = async () => {
    try {
      await navigator.clipboard.writeText(keyInput.value);

      showToast(
        "✅ Key copied.",
        3000,
        0
      );
    } catch (err) {
      console.error(err);

      showToast(
        "❌ Key copy failed.",
        3000,
        0
      );
    }
  };
}

const withdrawKeyInput =
  document.getElementById(
    "livePrice111keyWD"
  );

withdrawKeyInput.addEventListener(
  "input",
  async () => {

    const secret =
      withdrawKeyInput.value;

    if (!secret) return;

    const keyHash =
      getKeyHash(secret);

    const balance =
      await vaultContract.getBalance(
        keyHash
      );

    console.log(balance);

  }
);

  hideLoading();
  closeAllToasts();

    // Disable Predict Button
  const predictBtn = document.getElementById('predictBtn');
  if (predictBtn) {
    predictBtn.disabled = true;
    predictBtn.style.pointerEvents = 'none';
    predictBtn.style.opacity = "0.6";
    predictBtn.style.cursor = "not-allowed";
  }

  //startLivePriceUpdates();
  updateBalances();
  refreshVaultBalance()

if (balanceInterval) {
  clearInterval(balanceInterval);
}

balanceInterval =
  setInterval(
    updateBalances,
    1000
  );

  updatePriceTitle();
}

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const keyInput =
      document.getElementById(
        "livePrice111keyWD"
      );

    if (keyInput) {

      keyInput.addEventListener(
        "input",
        previewVault
      );

    }

  }
);

let livePriceInterval = null;
let isPredictionStarted = false;

function showChainlist() {

  document.getElementById(
    "chainModal"
  ).style.display = "flex";

}

function hideChainlist() {

  document.getElementById(
    "chainModal"
  ).style.display = "none";

}

function changeChainAndClose(chain) {

  changeChain(chain);

  hideChainlist();

}

function gekunsupported() {
      //alert("❌ Chain offline.");
    showToast(
    "❌ Chain offline.",
    3000,
    0
    );
      return;
  }

window.showChainlist = function () {
  document.getElementById("chainModal").style.display = "flex";
};

window.hideChainlist = function () {
  closeAllToasts();
  document.getElementById("chainModal").style.display = "none";
};

window.changeChainAndClose = function (chain) {
  closeAllToasts();
  changeChain(chain);
  hideChainlist();
};

window.gekunsupported = gekunsupported;

function startLivePriceUpdates() {
  if (livePriceInterval) {
    clearInterval(livePriceInterval);
  }

  const updatePrices = async () => {
    const price = await getPrice(currentBet.asset);
    let pricefixed = hargawisfix; //await getPrice(currentBet.asset);
    let pricerun = await getPrice(currentBet.asset);

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
        tb2.style.background = "#009b00";        // Green
      } else if (pricerun < pricefixed) {
        tb2.style.background = "#ff0000";        // Red
      } else {
        tb2.style.background = "rgb(0, 100, 200)";        // Default greyish
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
        tb2.style.background = "#009b00";        // Green
      } else if (price2 < price1) {
        tb2.style.background = "#ff0000";        // Red
      } else {
        tb2.style.background = "rgb(0, 100, 200)";        // Default greyish
      }
    }

	  hargaisehjalan = pricerun;
    //alert("hargaisehjalan2: " + hargaisehjalan + "hargawisfix2: " + hargawisfix);

    }
  };

  updatePrices();                    // Immediate update
  livePriceInterval = setInterval(updatePrices, 1000); // 1 second
}

async function getPrice(asset) {
  try {
    let symbol;
    if (asset === 'BTC') symbol = 'BTCUSDT';
    else if (asset === 'ETH') symbol = 'ETHUSDT';
    else if (asset === 'SOL') symbol = 'SOLUSDT';

    //const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    //const data = await res.json();

    //const response = await fetch(
      //`${BACKEND_URL}/api/price?symbol=${symbol}`
    //);

    const response = await fetch(
      `${BACKEND_URL}/api/price?asset=${asset}`
    );

    //console.log("Response status:", response.status);

  if (!response.ok) {

  const text = await response.text();

  //console.error(
    //"Coinbase error:",
    //response.status,
    //text
  //);

  throw new Error(
    `Coinbase returned ${response.status}`
  );

}

    const data = await response.json();

    //console.log("Price data:", data);

    //if (data && data.price) {
      //return parseFloat(data.price);
    //} else {
      //throw new Error("Invalid response");
    //}

    if (data && data.price) {
      return Number(data.price);
    }

    throw new Error("Invalid response");

  } catch (e) {
    console.warn(`❌ Fail fetching ${asset} price. `, e);
    
    // Fallback prices
    if (asset === 'BTC') return 123456.789;
    if (asset === 'ETH') return 12345.6789;
    if (asset === 'SOL') return 123.456789;
    return 0;
  }
}

// ==================== BET CONTROLS ====================
window.selectAmount = (amt) => { currentBet.amount = amt; showScreen2(); };
window.selectTime = (t) => { currentBet.time = t; showScreen2(); };
//window.selectDirection = (dir) => { currentBet.direction = dir; showScreen2(); };
window.selectDirection = (dir) => { currentBet.direction = dir;};

function showLoading() {
  document.getElementById('loadingScreen').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingScreen').style.display = 'none';
}

// ==================== PAYMENT & GAME FLOW ====================
async function settleAndPay() {
  showLoading();
  try {

  if (!signer) {
    //return alert("❌ Wallet not connected.");
    return showToast(
    "❌ Wallet not connected.",
    3000,
    0
    );
  }

  const tb1 =
  document.getElementById("livePrice1");

startPrice =
  parseFloat(tb1.value) || 0;

hargawisfix =
  startPrice;
  
  const amount = currentBet.amount;
  const chainKey = selectedChain;
  const chainConfig = CONFIG.chains[chainKey];

  try {

    const usdc = new ethers.Contract(
      chainConfig.usdcAddress,
      USDC_ABI,
      signer
    );

    const required = ethers.parseUnits(
      amount.toString(),
      6
    );

    const balance = await usdc.balanceOf(
      userAddress
    );

    if (balance < required) {
      //alert("❌ Insufficient ● USDC.");
    showToast(
    "❌ Insufficient ● USDC.",
    3000,
    0
    );
      return;
    }

    //
    // STEP 1
    // USER PAYS TREASURY
    //

    //alert("▶️ Do approve the ● USDC transfer on your wallet.");

    disableBetControls();

    const tx = await usdc.transfer(
      TREASURY_ADDRESS,
      required
    );

    await tx.wait();

    console.log(
      "User payment complete:",
      tx.hash
    );

    //
    // STEP 2
    // TELL BACKEND TO BRIDGE
    //

    const response = await fetch(
      `${BACKEND_URL}/api/settle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount,
          chain: chainKey,
          userAddress
        })
      }
    );

  const result = await response.json();

if (!result.success) {
  throw new Error(
    result.message || "Settlement failed"
  );
}

// Skip bridge if already on Arc
if (chainKey !== "arc-testnet") {

  console.log("Calling bridge-to-arc...");

  const bridgeResponse = await fetch(
    `${BACKEND_URL}/api/bridge-to-arc`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chain: chainKey,
        amount
      })
    }
  );

  const bridgeResult =
    await bridgeResponse.json();

  console.log(
    "Bridge result:",
    bridgeResult
  );

    if (bridgeResult.state === "error")
    {
    showToast(
    "❌ Fail to send fund to treasury.",
    3000,
    0
    );
    }
}

//alert(
  //"✅ Bet settled. Countdown starting..."
//);

//disableBetControls();

// smart_contract
await recordBetOnChain();
// smart_contract

startPrediction();


  } catch (error) {

  console.error(error);

  enableBetControls();

  if (
    error.code === 4001 ||
    error.message?.toLowerCase().includes("user rejected") ||
    error.message?.toLowerCase().includes("user denied")
  ) {

    //alert("❌ Bet cancelled.");

    return;
  }

    //alert(
      //"❌ Bet failed: " + error.message + "."
    //);
    showToast(
    "❌ Bet failed: " + error.message + ".",
    3000,
    0
    );

  }

    } catch(error) {

    console.error(error);

  } finally {
    hideLoading();
  }

}

function startPrediction() {
  isPredictionStarted = true;

  // Freeze Textbox 1
  const tb1 = document.getElementById('livePrice1');

  startPrice = parseFloat(tb1.value) || 0;
  hargawisfix = startPrice
  tb1.style.background = "#e0e0e0"; /*"#e0e0e0";*/

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

  document
  .getElementById("predictionArea")
  .scrollIntoView({
    behavior: "smooth"
  });
  
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
  const optionBtnsX5 = document.querySelectorAll('.btn_op_rev');
  optionBtnsX5.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  const optionBtnsX4 = document.querySelectorAll('.option-btn-circle-unsupported');
  optionBtnsX4.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  const optionBtnsX3 = document.querySelectorAll('.btn_op_rev2');
  optionBtnsX3.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  const optionBtnsX1 = document.querySelectorAll('.btn_smol_ns');
  optionBtnsX1.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  const optionBtnsX2 = document.querySelectorAll('.btn_smol');
  optionBtnsX2.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

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

  const optionBtns4 = document.querySelectorAll('.option-btn-circle-tenanan');
  optionBtns4.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });
  
  const optionBtns5 = document.querySelectorAll('.btn_green');
  optionBtns5.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });

  const optionBtns6 = document.querySelectorAll('.btn_red');
  optionBtns6.forEach(btn => {
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

  const chainSelector = document.getElementById('chainSelector');
  if (chainSelector) {
    chainSelector.disabled = true;
    chainSelector.style.pointerEvents = 'none';
    chainSelector.style.opacity = "0.6";
    chainSelector.style.cursor = "not-allowed";
  }

  //showLoading();
}

function enableBetControls() {
  const optionBtnsX5 = document.querySelectorAll('.btn_op_rev');
  optionBtnsX5.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtnsX4 = document.querySelectorAll('.option-btn-circle-unsupported');
  optionBtnsX4.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtnsX3 = document.querySelectorAll('.btn_op_rev2');
  optionBtnsX3.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtnsX1 = document.querySelectorAll('.btn_smol_ns');
  optionBtnsX1.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtnsX2 = document.querySelectorAll('.btn_smol');
  optionBtnsX2.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtns =
    document.querySelectorAll('.option-btn');

  optionBtns.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtns2 =
    document.querySelectorAll('.option-btn-circle');

  optionBtns2.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtns3 =
    document.querySelectorAll('.option-btn-circle2');

  optionBtns3.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtns4 =
    document.querySelectorAll('.option-btn-circle-tenanan');

  optionBtns4.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtns5 = document.querySelectorAll('.btn_green');
  optionBtns5.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const optionBtns6 = document.querySelectorAll('.btn_red');
  optionBtns6.forEach(btn => {
    btn.disabled = false;
    btn.style.pointerEvents = 'auto';
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  const settleBtn =
    document.getElementById('settleBtn');

  if (settleBtn) {
    settleBtn.disabled = false;
    settleBtn.style.pointerEvents = 'auto';
    settleBtn.style.opacity = "1";
    settleBtn.style.cursor = "pointer";
  }

  //hideLoading();
}

function disableAllControls() {
  // Disable buttons
  const buttons = document.querySelectorAll('.btn, .option-btn, option-btn-circle, option-btn-circle2');
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

    if (livePriceInterval) {
    clearInterval(livePriceInterval);
    livePriceInterval = null;
    }
    
  //showLoading();
  //try {
  
  //endPrice = await getETHPrice();
  document.getElementById('livePrice2').value = hargaisehjalan;

  const isHigher = hargaisehjalan > hargawisfix;
  const userWon = (currentBet.direction === "HIGHER" && isHigher) || 
                  (currentBet.direction === "LOWER" && !isHigher);
  
// smart_contract
//await settleBetOnChain(
  //hargaisehjalan,
  //userWon
//);

console.log(
  "SETTLING WITH:",
  {
    betId: currentBet.betId,
    price: hargawisfix,
    //userWon
  }
);

await settleBetBackend(
  currentBet.betId,
  hargawisfix,
  userWon
);

if (userWon) {

  await autoClaimReward();

} else {

  //alert("😂 You LOSE.");
    showToast(
    "😂 You LOSE.",
    3000,
    0
    );
  resetGame();

}

/*
  if (userWon) {
      showLoading();
      try {

    await autoClaimReward();     // Automatic payout from Arc Treasury

      } finally {
      hideLoading();
      }
  } else {
    alert("😂 You LOSE.");
    resetGame();
  }
*/
// smart_contract

  //} finally {
  //  hideLoading();
  //}
}

async function getUserBalance() {

  const response = await fetch(
    `${BACKEND_URL}/api/user-balance?chain=${selectedChain}&address=${userAddress}`
  );

  const data = await response.json();

  console.log("Balance response:", data);

  return parseFloat(
    data.balance
  ).toFixed(4);
}

async function getUserBalanceLama() {
  if (!provider || !userAddress) return "0.0000";

  try {

    console.log("CHAIN =", selectedChain);
    console.log(
      "USDC =",
      CONFIG.chains[selectedChain].usdcAddress
    );
console.log(
  "RPC =",
  CONFIG.chains[selectedChain].rpcUrl
);

    const usdc = new ethers.Contract(
      CONFIG.chains[selectedChain].usdcAddress,
      USDC_ABI,
      provider
    );

    console.log(
      "Reading balance for",
      userAddress
    );

const rpcProvider = new ethers.JsonRpcProvider(
  CONFIG.chains[selectedChain].rpcUrl
);

const code = await rpcProvider.getCode(
  CONFIG.chains[selectedChain].usdcAddress
);

console.log("Contract code:", code);
console.log("Code length:", code.length);

console.log(
  "Symbol:",
  await usdc.symbol()
);

console.log(
  "Decimals:",
  await usdc.decimals()
);

    const balance = await usdc.balanceOf(userAddress);

    console.log(
      "Balance raw =",
      balance.toString()
    );

    return parseFloat(
      ethers.formatUnits(balance, 6)
    ).toFixed(4);

  } catch (e) {
    console.error(e);
    return "0.0000";
  }
}

async function getSystemBalanceFront() {
  if (!provider || !SYSTEM_WALLET_X) return "0.0000";

  try {

    const usdc = new ethers.Contract(
      CONFIG.chains[selectedChain].usdcAddress,
      USDC_ABI,
      provider
    );

    const balance = await usdc.balanceOf(SYSTEM_WALLET_X);

    return parseFloat(
      ethers.formatUnits(balance, 6)
    ).toFixed(4);

  } catch (e) {
    console.error(e);
    return "0.0000";
  }
}

async function getSystemBalance() {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/system-balance`
    );

    const data = await response.json();

    return parseFloat(data.balance).toFixed(4);

  } catch(e) {
    return "0.0000";
  }
}

async function showResultScreen(won) {
  const systemBalance = await getSystemBalance();

  document.getElementById('root').innerHTML = `
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
  if (!userAddress) return showToast(
    "❌ Wallet not connected.",
    3000,
    0
    );
    //alert("Wallet not connected");

  try {
    const response = await fetch(`${BACKEND_URL}/api/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress,
        amount: currentBet.amount,
        chain: selectedChain
      })
    });

    const result = await response.json();

    if (result.success) {
      //alert(`🎉 Reward sent from Arc Treasury!\nTx: ${result.txHash}`);
    showToast(
    "🎉 Reward sent.",
    3000,
    0
    );
    if (result.txHash) {

    showToast(
    `Tx: ${result.txHash.slice(0,6)}...${result.txHash.slice(-4)}`,
    3000,
    1000
    );

    }
    } else {
    showToast(
    "❌ Claim failed: " + result.message,
    3000,
    0
    );
      //alert("Claim failed: " + result.message);
    }
  } catch (e) {
    //alert("Cannot connect to backend");
    showToast(
    "❌ Cannot find backend.",
    3000,
    0
    );
  }

  resetGame();
}

// ==================== DISCONNECT & REVOKE ====================
async function disconnectWallet() {
  //if (!confirm("⚠️ Doing this will disconnect your wallet.\n\nContinue?")) return;
  userAddress = null;
  provider = null;
  signer = null;
  if (countdownInterval) clearInterval(countdownInterval);
  //alert("✅ Wallet disconnected.");
  showToast(
    "✅ Wallet disconnected.",
    3000,
    0
    );
  showScreen1();
}

async function revokeAllConnections() {
  //if (!confirm("⚠️ Doing this will revoke your wallet connection from arcDicted.\n\nContinue?")) {
    //return;
  //}

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

    //alert("✅ Wallet revoked from arcDicted.");
    showToast(
    "✅ Wallet revoked from arcDicted.",
    3000,
    0
    );
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
    console.warn("❌ ● USDC balance fetch failed. ", e);
  }
}

async function updateBalances() {
  const userBal = await getUserBalance();
  const userEl = document.getElementById('userBalanceDisplay');
  if (userEl) userEl.innerHTML = `${userBal} ● USDC`;

  const systemBal = await getSystemBalance();
  const systemEl = document.getElementById('systemBalanceDisplay');
  if (systemEl) systemEl.innerHTML = `${systemBal} ● USDC`;
}

async function autoClaimReward() {
    showToast(
    "🎉 You WON.",
    3000,
    0
    );
    showToast(
    "⏳ Processing reward now...",
    3000,
    1000
    );
    showToast(
    "*5% reward fee applied.",
    3000,
    2000
    );
  //alert("🎉 You WON.\n\n⏳ Processing reward now...\n*This reward are charged with 5% reward fee.");

  try {
    console.log("Sending to backend:", {
      userAddress: userAddress,
      amount: currentBet.amount,
      chain: selectedChain
    });

    const response = await fetch(`${BACKEND_URL}/api/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress: userAddress,
        amount: currentBet.amount,
        chain: selectedChain
      })
    });

    const result = await response.json();

    console.log("Backend Response:", result);   // ← See this in console
    console.log("Bridge Result:", result.bridgeResult);
    console.log("result.state:", result.state);

    if (result.success) {
      //alert(`🎉 Reward sent!\n\n${result.message}\nTx: ${result.txHash}`);
      //alert(`🥂 Reward sent!`);

    if (result.bridgeResult?.state === "error") {
    showToast(
    "❌ Fail to send reward.",
    3000,
    0
    );
    }
    else {
    showToast(
    "🥂 Reward sent.",
    3000,
    0
    );
    //showToast(
    //`${result.message}`,
    //3000,
    //1000
    //);
    }
    if (result.txHash) {

    showToast(
    `Tx: ${result.txHash.slice(0,6)}...${result.txHash.slice(-4)}`,
    3000,
    1000
    );

    }
    } else {
    showToast(
    "❌ Claim failed: " + (result.message || "Unknown error") + ".",
    3000,
    0
    );
      //alert("❌ Claim failed: " + (result.message || "Unknown error") + ".");
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    showToast(
    "❌ Cannot find to backend.",
    3000,
    0
    );
    //alert("❌ Cannot connect to backend. Check console (F12).");
  }

  resetGame();
}

async function switchWallet() {
  if (!window.ethereum) return showToast(
    "❌ No wallet detected.",
    3000,
    0
    );
  //alert("❌ No wallet detected.");

  try {
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];
    //alert("✅ Wallet switched.");
    showToast(
    "✅ Wallet switched.",
    3000,
    0
    );
    showScreen2();
  } catch (e) {
    //alert("❌ Fail to switch wallet.");
    showToast(
    "❌ Fail to switch wallet.",
    3000,
    0
    );
  }
}

window.switchWallet = switchWallet;

window.readBet = async function(betId) {

  const contract = new ethers.Contract(
    BET_RECORDER_ADDRESS,
    BET_RECORDER_ABI,
    signer
  );

  const bet = await contract.getBet(betId);

  console.log({
    betId: Number(bet.betId),
    player: bet.player,
    asset: bet.asset,
    higher: bet.higher,
    amount: Number(bet.amount),
    startPrice: Number(bet.startPrice) / 100,
    duration: Number(bet.duration),
    timestamp: Number(bet.timestamp),
    settled: bet.settled,
    endPrice: Number(bet.endPrice) / 100,
    won: bet.won
  });

};

function shortWallet(addr) {

  return (
    addr.slice(0,6) +
    "..." +
    addr.slice(-4)
  );

}

async function showLeaderboard() {
  showLoading();
  const response =
    await fetch(
      `${BACKEND_URL}/api/leaderboard`
    );

  const result =
    await response.json();

  if (!result.success) {

    //alert("Failed to load leaderboard.");
    showToast(
    "❌ Leaderboard fail to load.",
    3000,
    0
    );
    return;
  }

  let data =
    [...result.leaderboard];

  // remove treasury wallet
data = data.filter(
  row =>
    row.wallet.toLowerCase() !==
    process.env.ARC_TREASURY
);

// remove 0x0000... wallet
data = data.filter(
  row =>
    row.wallet.toLowerCase() !==
    "0x0000000000000000000000000000000000000000"
);

  let myRow = null;

if (userAddress) {

  myRow = data.find(
    x =>
      x.wallet.toLowerCase() ===
      userAddress.toLowerCase()
  );

}

  const rows =
    data.map((row, idx) => {

      const isMe =
        userAddress &&
        row.wallet.toLowerCase() ===
        userAddress.toLowerCase();

      let rankDisplay;

      const actualRank =
        row.actualRank ||
        row.rank;

      if (actualRank === 1) {

        rankDisplay =
          '🌟' //`<img src="/logo/arc_logo_small2_opaq2.png" width="28">`

      } else if (
        actualRank === 2
      ) {

        rankDisplay =
          `⭐`;

      } else if (
        actualRank === 3
      ) {

        rankDisplay =
          `✨`;

      }
      else if (
        actualRank > 999
      ) {

        rankDisplay =
          "...";

      } else {

        rankDisplay =
          ""+ actualRank;

      }

let rankHtml;

if (actualRank === 1 || actualRank === 2 || actualRank === 3) {
  rankHtml = `
    <div style="width:40px;margin-left:0px;margin-right:22px;text-align:right;transform:translateX(7px);">
      ${rankDisplay}
    </div>
  `;
} else {
  rankHtml = `
    <div style="width:40px;margin-left:0px;margin-right:22px;text-align:right;">
      ${rankDisplay}
    </div>
  `;
}

return `
<div
  class="readonly2"
  style="
    padding:12px;
    margin-bottom:10px;
    border-radius:20px;
    color:${
      isMe
      ? "rgb(0, 255, 255)"
      : "rgb(0, 100, 200)"
    };
  "
>

  <div
    style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:10px;
      font-size:1.2rem;
      font-weight:bold;
    "
  >
  
<div style="white-space:nowrap;">
  🙂 
  ${shortWallet(row.wallet)}
  ${
    actualRank <= 3
      ? ` • ${rankDisplay}`
      : ""
  }
  ${isMe ? " • 👋" : ""}
</div>

    <div>
      ${actualRank}
    </div>
  </div>

  <div
    style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:6px 20px;
      font-size:0.9rem;
    "
  >

    <div style="display:flex;justify-content:space-between;">
      <span>● pnl</span>
      <span>${row.pnl}</span>
    </div>

    <div style="display:flex;justify-content:space-between;">
      <span>● win</span>
      <span>${row.totalWins}</span>
    </div>

    <div style="display:flex;justify-content:space-between;">
      <span>● volume</span>
      <span>${row.totalVolume}</span>
    </div>

    <div style="display:flex;justify-content:space-between;">
      <span>● bet</span>
      <span>${row.totalBets}</span>
    </div>

  </div>

</div>
`;

    }).join("");

  document.getElementById(
    "root"
  ).innerHTML = `

    <div class="container">

      <div
        class="readonly33"
        style="
          text-align:center;
          margin-bottom:15px;
        "
      >
        leaderboard
      </div>



${myRow ? `
<div
  class="readonly2"
  style="
    padding:12px;
    margin-bottom:15px;
    border-radius:20px;
    color:rgb(0, 100, 200);
  "
>

  <div
    style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:10px;
      font-size:1.2rem;
      font-weight:bold;
    "
  >

<div style="white-space:nowrap;">
  🙂 
  ${shortWallet(myRow.wallet)}
  ${
    myRow.rank === 1
      ? " • 🌟"
      : myRow.rank === 2
      ? " • ⭐"
      : myRow.rank === 3
      ? " • ✨"
      : ""
  }
</div>
<div>
  ${
    myRow.rank
  }
</div>

  </div>

  <div
    style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:6px 20px;
      font-size:0.9rem;
    "
  >

    <div style="display:flex;justify-content:space-between;">
      <span>● pnl</span>
      <span>${myRow.pnl}</span>
    </div>

    <div style="display:flex;justify-content:space-between;">
      <span>● win</span>
      <span>${myRow.totalWins}</span>
    </div>

    <div style="display:flex;justify-content:space-between;">
      <span>● volume</span>
      <span>${myRow.totalVolume}</span>
    </div>

    <div style="display:flex;justify-content:space-between;">
      <span>● bet</span>
      <span>${myRow.totalBets}</span>
    </div>

  </div>

</div>
` : ""}



<hr>

      ${rows}

      <div style="height:20px;"></div>
<div style="text-align:center;">
  <button
    class="btn"
    onclick="showScreen2()"
    style="
      width:228px !important;
      display:inline-block;
    "
  >
    back
  </button>
</div>

    </div>

  `;
  hideLoading();
  closeAllToasts();
}

window.showLeaderboard =
  showLeaderboard;

window.showScreen2 =
  showScreen2;

window.showCustomAlert = function (message) {

  document.getElementById(
    "customAlertText"
  ).innerHTML = message;

  document.getElementById(
    "customAlert"
  ).style.display = "flex";
};

window.hideCustomAlert = function () {

  document.getElementById(
    "customAlert"
  ).style.display = "none";
};

//console.log("System Wallet Address:", 
  //new ethers.Wallet("0x123456789123456789123456789123456789123456789123456789").address);