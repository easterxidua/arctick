require("dotenv").config();

const fs = require("fs");
const solc = require("solc");
const { ethers } = require("ethers");

const RPC_URL =
  "https://arc-testnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq";

const PRIVATE_KEY =
  process.env.SYSTEM_PRIVATE_KEY;

async function main() {

  const source =
    fs.readFileSync(
      "./contracts/BetRecorderV3.sol",
      "utf8"
    );

  const input = {
    language: "Solidity",
    sources: {
      "./contracts/BetRecorderV3.sol": {
        content: source
      }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode"
          ]
        }
      }
    }
  };

  const output =
    JSON.parse(
      solc.compile(
        JSON.stringify(input)
      )
    );

  const contract =
    output.contracts[
      "./contracts/BetRecorderV3.sol"
    ].BetRecorderV3;

  const abi =
    contract.abi;

console.log(
  JSON.stringify(
    contract.abi,
    null,
    2
  )
);

  const bytecode =
    contract.evm.bytecode.object;

  const provider =
    new ethers.JsonRpcProvider(
      RPC_URL
    );

  const wallet =
    new ethers.Wallet(
      PRIVATE_KEY,
      provider
    );

  console.log(
    "Deploying from:",
    wallet.address
  );

  const factory =
    new ethers.ContractFactory(
      abi,
      bytecode,
      wallet
    );

  const deployed =
    await factory.deploy();

  await deployed.waitForDeployment();

  console.log(
    "Contract Address:"
  );

  console.log(
    await deployed.getAddress()
  );

}

main().catch(console.error);