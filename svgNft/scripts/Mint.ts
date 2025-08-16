import { network } from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

async function main(): Promise<void> {
  const contractAddress = "0x3013c4e9CcbE9A7AC47121D749835eDAa3335D46";

  const svgNFT = await ethers.getContractFactory("SvgNft");
  const contract = await svgNFT.attach(contractAddress);

  const timestamp = Date.now();
  const salt = ethers.keccak256(ethers.toUtf8Bytes(`SvgNft_${timestamp}`));

  console.log(" Deploying SvgNft contract...");
  const SvgNftFactory = await ethers.getContractFactory("SvgNft");
  const svgNft = await SvgNftFactory.deploy();
  await svgNft.waitForDeployment();

  //   const contractAddress = await svgNft.getAddress();
  console.log(" SvgNft deployed at:", contractAddress);
  console.log(" Deployment timestamp:", timestamp, "\n");

  const tx = await contract.mint({ value: ethers.parseEther("0.001") });
  await tx.wait();

  console.log("NFT minted! Hash:", tx.hash);
}

main().catch(console.error);
