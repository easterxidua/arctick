const CONFIG = {
  enabledChains: {
    "arc-testnet": true
  },

  chains: {
    "arc-testnet": {
      chainId: "0x4cef52",
      rpcUrl: "https://rpc.testnet.arc.network",
      name: "ARC Testnet",
      explorer: "https://testnet.arcscan.app"
    }
  },

  defaultChain: "arc-testnet"
};

export default CONFIG;