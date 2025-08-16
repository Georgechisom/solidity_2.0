import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function removeLiquidity() {
  //token address
  const usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const Dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  // impersonator address
  const impersonateAccount_address =
    "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  //router address
  const Router_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const pool_address = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5";

  // contract instances
  const impersonate_address = await ethers.getContractAt(
    "IERC20",
    impersonateAccount_address
  );
  const usdc_contract = await ethers.getContractAt("IERC20", usdc_address);
  const dai_contract = await ethers.getContractAt("IERC20", Dai_address);
  const router_contract = await ethers.getContractAt(
    "IUniswapV2Router01",
    Router_address
  );
  const pool_contract = await ethers.getContractAt(
    "IUniswapV2Pair",
    pool_address
  );

  // hardhat to get acct
  await helpers.impersonateAccount(impersonateAccount_address);
  //   await helpers.setBalance(impersonateAccount_address, ethers.parseEther("5"));

  // get signer
  const signer = await ethers.getSigner(impersonateAccount_address);

  // get balance of all account
  const beforeUsdcImpersonatorBalance = await usdc_contract.balanceOf(
    impersonateAccount_address
  );
  const beforeDaiImpersonatorBalance = await dai_contract.balanceOf(
    impersonateAccount_address
  );
  const beforeUsdcImpersonatorPoolBalance = await usdc_contract.balanceOf(
    pool_address
  );
  const beforeDaiImpersonatorPoolBalance = await dai_contract.balanceOf(
    pool_address
  );
  const beforePoolBalance = await pool_contract.balanceOf(
    impersonateAccount_address
  );

  //console log balances
  console.log("########## Before Balances #############");
  console.log(
    "USDC Impersonator Balance:",
    ethers.formatEther(beforeUsdcImpersonatorBalance)
  );
  console.log(
    "DAI Impersonator Balance:",
    ethers.formatEther(beforeDaiImpersonatorBalance)
  );
  console.log(
    "USDC Impersonator Pool Balance:",
    ethers.formatEther(beforeUsdcImpersonatorPoolBalance)
  );
  console.log(
    "DAI Impersonator Pool Balance:",
    ethers.formatEther(beforeDaiImpersonatorPoolBalance)
  );
  console.log("Pool Balance:", ethers.formatEther(beforePoolBalance));

  // amount desired and slippage
  const amountUsdcDesired = await ethers.parseUnits("100000", 6);
  const amountDaiDesired = await ethers.parseUnits("1000000", 18);
  const amountUsdcMin = await ethers.parseUnits("95000", 6);
  const amountDaiMin = await ethers.parseUnits("95000", 18);
  const deadline = (await helpers.time.latest()) * 100;
}
