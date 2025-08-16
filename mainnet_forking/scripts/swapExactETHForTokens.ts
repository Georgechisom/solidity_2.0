import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const AssetHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
  const impersonatedSigner = await ethers.getSigner(AssetHolder);

  //USDC contract Address
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  const USDC = await ethers.getContractAt("IERC20", USDCAddress);

  const usdcBal = await USDC.balanceOf(AssetHolder);

  console.log(
    "################### Initial Balance Info ###########################"
  );
  console.log(
    "User Initial USDC Balance:",
    ethers.formatUnits(usdcBal.toString(), 6)
  );

  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const Router = await ethers.getContractAt("IUniSwap", UNIRouter);

  const amountIn = ethers.parseUnits("1", 18);
  const amountOutMin = ethers.parseUnits("0.5", 18);
  const path = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH address
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI address
  ];

  const [signer] = await ethers.getSigners();

  const to = impersonatedSigner.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const tx = await Router.connect(impersonatedSigner).swapExactETHForTokens(
    amountOutMin,
    path,
    to,
    deadline
  );

  console.log(
    "################### Final Balance Info ###########################"
  );

  console.log("Swap transaction:", tx);

  const usdcBalAfter = await USDC.balanceOf(AssetHolder);

  console.log("usdc balance", ethers.formatUnits(usdcBalAfter.toString(), 6));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
