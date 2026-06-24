import express from "express";
import { ethers } from "ethers";

const router = express.Router();

/*
TEST
https://your-backend/api/vault/test
*/
router.get("/vault/test", (req, res) => {

  res.json({
    success: true,
    message: "Vault route working"
  });

});

/*
DEPOSIT
*/
router.post("/vault/deposit", async (req, res) => {

  try {

    const {
      amount,
      chain,
      keyHash,
      userAddress
    } = req.body;

    console.log("Deposit request:", {
      amount,
      chain,
      keyHash,
      userAddress
    });

    /*
      TODO:
      bridge to ARC
      call vault contract
    */

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

/*
WITHDRAW
*/
router.post("/vault/withdraw", async (req, res) => {

  try {

    const {
      secret,
      amount,
      userAddress
    } = req.body;

    const keyHash =
      ethers.keccak256(
        ethers.toUtf8Bytes(secret)
      );

    console.log("Withdraw request:", {
      keyHash,
      amount,
      userAddress
    });

    /*
      TODO:
      check vault balance
      call withdraw contract
    */

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

export default router;