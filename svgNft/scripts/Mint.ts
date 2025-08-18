import { network } from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = await network.connect({
  network: "sepolia",
  chainType: "l1",
});

async function main(): Promise<void> {
  const contractAddress = " 0x24F3543A431855Bd4A95E8f6E5Bf3161466f91C0";

  const SvgNft = await ethers.getContractFactory("SvgNft");
  const contract = await SvgNft.attach(contractAddress);

  const tx = await contract.mint({ value: ethers.parseEther("0.001") });
  await tx.wait();

  console.log("NFT minted! Hash:", tx.hash);
}

main().catch(console.error);
