const CONFIG = {
  enabledChains: {
    "arc-testnet": true,
    "base-sepolia": true,
    "base-mainnet": false,
    "eth-sepolia": true,
    "ink-sepolia": false,
    "arbitrum-sepolia": true
  },

  chains: {

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
    }
  },

  defaultChain: "arc-testnet"
};

export default CONFIG;