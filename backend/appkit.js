import { AppKit } from "@circle-fin/app-kit";
import { ethers } from "ethers";
import { createEthersAdapterFromProvider }
  from "@circle-fin/adapter-ethers-v6";

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL
);

const wallet = new ethers.Wallet(
  process.env.SYSTEM_PRIVATE_KEY,
  provider
);

const adapter =
  await createEthersAdapterFromProvider({
    provider: wallet
  });

export const kit = new AppKit();

export { adapter };