router.post("/vault/deposit", async (req, res) => {

  try {

    const {
      amount,
      chain,
      keyHash,
      userAddress
    } = req.body;

    // save deposit metadata

    // bridge if needed

    // call ARC vault contract

    res.json({
      success: true
    });

  } catch (err) {

    res.json({
      success: false,
      message: err.message
    });

  }

});

router.post(
  "/vault/withdraw",
  async(req,res)=>{

    try {

      const {

        secret,

        amount,

        userAddress

      } = req.body;

      const keyHash =
        ethers.keccak256(
          ethers.toUtf8Bytes(
            secret
          )
        );

      const balance =
        await vault
          .getBalance(
            keyHash
          );

      if (
        balance <
        ethers.parseUnits(
          amount,
          6
        )
      ) {

        return res.json({

          success:false,

          message:
            "insufficient balance"

        });

      }

      const tx =
        await vault.withdraw(

          keyHash,

          ethers.parseUnits(
            amount,
            6
          ),

          userAddress

        );

      await tx.wait();

      res.json({

        success:true

      });

    } catch(err) {

      res.json({

        success:false,

        message:err.message

      });

    }

});