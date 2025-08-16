import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SwapPermit Test", function () {
  async function deployedSwapPermit() {
    const SwapPermitContract = await hre.ethers.getContractFactory(
      "swapPermit"
    );

    const [owner, relayer, recipient] = await hre.ethers.getSigners();

    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const AMOUNT_IN = hre.ethers.parseEther("100"); // 100 DAI
    const DEADLINE = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now

    const swapPermitContract = await SwapPermitContract.deploy();

    // Get token contracts
    const dai = await hre.ethers.getContractAt("IERC20Permit", DAI_ADDRESS);
    const usdc = await hre.ethers.getContractAt("IERC20Permit", USDC_ADDRESS);

    // Setup DAI for testing
    const whaleAddress = "0x28c6c06298d514db089934071355e5743bf21d60";
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [whaleAddress],
    });
    const whale = await hre.ethers.getSigner(whaleAddress);
    await dai.connect(whale).transfer(owner.address, AMOUNT_IN);

    return {
      swapPermitContract,
      dai,
      usdc,
      owner,
      relayer,
      recipient,
      DAI_ADDRESS,
      USDC_ADDRESS,
      AMOUNT_IN,
      DEADLINE,
    };
  }

  describe("Basic Swap", function () {
    it("should allow owner to create a swap", async function () {
      const {
        swapPermitContract,
        dai,
        owner,
        recipient,
        DAI_ADDRESS,
        USDC_ADDRESS,
        AMOUNT_IN,
        DEADLINE,
      } = await loadFixture(deployedSwapPermit);

      // Check initial DAI balance
      const initialBalance = await dai.balanceOf(owner.address);
      expect(initialBalance).to.equal(AMOUNT_IN);

      // Create permit signature
      const domain = {
        name: await dai.name(),
        version: "1",
        chainId: (await hre.ethers.provider.getNetwork()).chainId,
        verifyingContract: DAI_ADDRESS,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        owner: owner.address,
        spender: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap router
        value: AMOUNT_IN,
        nonce: await dai.nonces(owner.address),
        deadline: DEADLINE,
      };

      const signature = await owner.signTypedData(domain, types, message);
      const { v, r, s } = hre.ethers.Signature.from(signature);

      // Execute swap
      const path = [DAI_ADDRESS, USDC_ADDRESS];
      await swapPermitContract.connect(owner).swapWithPermit(
        owner.address,
        DAI_ADDRESS,
        AMOUNT_IN,
        DEADLINE,
        v,
        r,
        s,
        AMOUNT_IN,
        0, // min amount out
        path,
        recipient.address,
        DEADLINE
      );

      // Verify swap happened (recipient should have USDC)
      const usdcBalance = await dai.balanceOf(recipient.address);
      expect(usdcBalance).to.be.gt(0);
    });
  });

  describe("Relayer Swap", function () {
    it("should allow relayer to execute swap for owner", async function () {
      const {
        swapPermitContract,
        dai,
        usdc,
        owner,
        relayer,
        recipient,
        DAI_ADDRESS,
        USDC_ADDRESS,
        AMOUNT_IN,
        DEADLINE,
      } = await loadFixture(deployedSwapPermit);

      // Create permit signature (signed by owner)
      const domain = {
        name: await dai.name(),
        version: "1",
        chainId: (await hre.ethers.provider.getNetwork()).chainId,
        verifyingContract: DAI_ADDRESS,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        owner: owner.address,
        spender: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        value: AMOUNT_IN,
        nonce: await dai.nonces(owner.address),
        deadline: DEADLINE,
      };

      const signature = await owner.signTypedData(domain, types, message);
      const { v, r, s } = hre.ethers.Signature.from(signature);

      // Relayer executes the swap
      const path = [DAI_ADDRESS, USDC_ADDRESS];
      await swapPermitContract
        .connect(relayer)
        .swapWithPermit(
          owner.address,
          DAI_ADDRESS,
          AMOUNT_IN,
          DEADLINE,
          v,
          r,
          s,
          AMOUNT_IN,
          0,
          path,
          recipient.address,
          DEADLINE
        );

      // Check that recipient got USDC
      const usdcBalance = await usdc.balanceOf(recipient.address);
      expect(usdcBalance).to.be.gt(0);
    });
  });

  describe("Error Cases", function () {
    it("should fail with expired deadline", async function () {
      const {
        swapPermitContract,
        dai,
        owner,
        recipient,
        DAI_ADDRESS,
        USDC_ADDRESS,
        AMOUNT_IN,
      } = await loadFixture(deployedSwapPermit);

      const expiredDeadline = Math.floor(Date.now() / 1000) - 60; // 1 minute ago

      // Create signature with expired deadline
      const domain = {
        name: await dai.name(),
        version: "1",
        chainId: (await hre.ethers.provider.getNetwork()).chainId,
        verifyingContract: DAI_ADDRESS,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        owner: owner.address,
        spender: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        value: AMOUNT_IN,
        nonce: await dai.nonces(owner.address),
        deadline: expiredDeadline,
      };

      const signature = await owner.signTypedData(domain, types, message);
      const { v, r, s } = hre.ethers.Signature.from(signature);

      const path = [DAI_ADDRESS, USDC_ADDRESS];

      // Should fail with expired deadline
      await expect(
        swapPermitContract
          .connect(owner)
          .swapWithPermit(
            owner.address,
            DAI_ADDRESS,
            AMOUNT_IN,
            expiredDeadline,
            v,
            r,
            s,
            AMOUNT_IN,
            0,
            path,
            recipient.address,
            expiredDeadline
          )
      ).to.be.revertedWithCustomError(swapPermitContract, "DeadlineExpired");
    });

    it("should fail with insufficient amount", async function () {
      const {
        swapPermitContract,
        dai,
        owner,
        recipient,
        DAI_ADDRESS,
        USDC_ADDRESS,
        AMOUNT_IN,
        DEADLINE,
      } = await loadFixture(deployedSwapPermit);

      const smallAmount = hre.ethers.parseEther("50"); // Only permit 50 DAI

      // Create signature for smaller amount
      const domain = {
        name: await dai.name(),
        version: "1",
        chainId: (await hre.ethers.provider.getNetwork()).chainId,
        verifyingContract: DAI_ADDRESS,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        owner: owner.address,
        spender: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        value: smallAmount, // Only permit 50 DAI
        nonce: await dai.nonces(owner.address),
        deadline: DEADLINE,
      };

      const signature = await owner.signTypedData(domain, types, message);
      const { v, r, s } = hre.ethers.Signature.from(signature);

      const path = [DAI_ADDRESS, USDC_ADDRESS];

      // Try to swap more than permitted amount
      await expect(
        swapPermitContract.connect(owner).swapWithPermit(
          owner.address,
          DAI_ADDRESS,
          smallAmount,
          DEADLINE,
          v,
          r,
          s,
          AMOUNT_IN, // Try to swap 100 DAI but only 50 permitted
          0,
          path,
          recipient.address,
          DEADLINE
        )
      ).to.be.revertedWithCustomError(swapPermitContract, "InsufficientAmount");
    });
  });
});
