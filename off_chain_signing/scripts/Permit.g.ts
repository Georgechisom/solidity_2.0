import { ethers } from "hardhat";

async function main() {
  const SwapPermit = await ethers.getContractFactory("swapPermit");

  const swapPermit = await SwapPermit.deploy();
  await swapPermit.waitForDeployment();

  const address: string = await swapPermit.getAddress();
  console.log("swapPermit deployed to:", address);

  const impersonateAccount_address =
    "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
  const signer = await ethers.getSigner(impersonateAccount_address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
