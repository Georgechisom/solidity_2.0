import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

console.log("walletConnect", import.meta.env.VITE_walletConnectAppId);

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    walletConnect({ projectId: import.meta.env.VITE_walletConnectAppId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(), // you can add more networks here as seen in the docs also remember to add them in import as well
  },
});
