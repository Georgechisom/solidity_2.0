import React from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CreateProposalModal } from "../CreateProposalModal";
import { useAccount } from "wagmi";
import { isAddressEqual } from "viem";

const AppLayout = ({ children, chairPersonAddress }) => {
  const { address } = useAccount();

  return (
    <div className="w-full h-full overflow-hidden ">
      <nav className="w-full h-24 shadow-lg shadow-blue-300 px-4 border-b-2 border-blue-700">
        <div className="w-full flex flex-col md:flex-row justify-between items-center py-4 text-blue-700 font-bold">
          <div>Logo</div>
          <div>nav links</div>
          <div className="flex flex-row gap-2 items-center">
            <ConnectButton />
            {address &&
              chairPersonAddress &&
              isAddressEqual(chairPersonAddress, address) && (
                <CreateProposalModal />
              )}
          </div>
        </div>
      </nav>
      <main className="min-h-[calc(100vh-10rem)] my-3 mx-2 md:mx-10 gap-2">
        {children}
      </main>
      <footer className="w-full h-20 shadow-lg shadow-blue-300 py-3 px-4 border-blue-700 border-t-2 ">
        <div className="flex flex-row justify-center items-center py-3 text-blue-700 font-bold">
          &copy; copyright {new Date().getFullYear()} winsome code
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
