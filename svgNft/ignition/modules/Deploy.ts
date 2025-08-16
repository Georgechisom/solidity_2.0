import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SvgNftModule", (m) => {
  const svgNft = m.contract("SvgNft");

  return { svgNft };
});
