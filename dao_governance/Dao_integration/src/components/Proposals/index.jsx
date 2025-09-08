import React, { useState } from "react";
import { ProposalCard } from "../ProposalCard";
import { usePublicClient } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UseChairPerson from "../../hooks/UseChairPerson";
import UseCreateProposal from "../../hooks/UseCreateProposal";

// const proposals = [
//   {
//     id: 1,
//     description: "Fund new project development",
//     amount: "1000000000000000000",
//     recipient: "0x1234567890abcdef1234567890abcdef12345678",
//     voteCount: 15,
//     deadline: 1719878400,
//     executed: false,
//     isVoted: false,
//   },
//   {
//     id: 2,
//     description: "Upgrade smart contract",
//     amount: "2500000000000000000",
//     recipient: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
//     voteCount: 22,
//     deadline: 1719964800,
//     executed: false,
//     isVoted: true,
//   },
//   {
//     id: 3,
//     description: "Sponsor hackathon event",
//     amount: "500000000000000000",
//     recipient: "0x1111111111111111111111111111111111111111",
//     voteCount: 10,
//     deadline: 1720051200,
//     executed: true,
//     isVoted: false,
//   },
//   {
//     id: 4,
//     description: "Community rewards distribution",
//     amount: "750000000000000000",
//     recipient: "0x2222222222222222222222222222222222222222",
//     voteCount: 18,
//     deadline: 1720137600,
//     executed: false,
//     isVoted: true,
//   },
//   {
//     id: 5,
//     description: "Bug bounty payout",
//     amount: "300000000000000000",
//     recipient: "0x3333333333333333333333333333333333333333",
//     voteCount: 8,
//     deadline: 1720224000,
//     executed: true,
//     isVoted: false,
//   },
//   {
//     id: 6,
//     description: "DAO marketing campaign",
//     amount: "1200000000000000000",
//     recipient: "0x4444444444444444444444444444444444444444",
//     voteCount: 20,
//     deadline: 1720310400,
//     executed: false,
//     isVoted: false,
//   },
//   {
//     id: 7,
//     description: "Legal consultation fees",
//     amount: "900000000000000000",
//     recipient: "0x5555555555555555555555555555555555555555",
//     voteCount: 12,
//     deadline: 1720396800,
//     executed: false,
//     isVoted: true,
//   },
//   {
//     id: 8,
//     description: "Infrastructure upgrade",
//     amount: "2000000000000000000",
//     recipient: "0x6666666666666666666666666666666666666666",
//     voteCount: 25,
//     deadline: 1720483200,
//     executed: false,
//     isVoted: false,
//   },
//   {
//     id: 9,
//     description: "Research grant",
//     amount: "800000000000000000",
//     recipient: "0x7777777777777777777777777777777777777777",
//     voteCount: 14,
//     deadline: 1720569600,
//     executed: true,
//     isVoted: true,
//   },
//   {
//     id: 10,
//     description: "Open source contribution reward",
//     amount: "600000000000000000",
//     recipient: "0x8888888888888888888888888888888888888888",
//     voteCount: 16,
//     deadline: 1720656000,
//     executed: true,
//     isVoted: false,
//   },
// ];

export function Proposals() {
  const [active, setActive] = useState(true);
  const [inActive, setInActive] = useState(false);

  const { proposals, isInitialLoad, isLoading, error } = UseCreateProposal();
  const client = usePublicClient();
  const chairPerson = UseChairPerson();

  console.log("client", client);
  console.log("chairPerson", chairPerson);
  console.log("myproposals", proposals);

  function handleActive() {
    setActive(true);
    setInActive(false);
  }
  function handleInActive() {
    setActive(false);
    setInActive(true);
  }

  if (error) {
    return <div>Error loading proposals: {error}</div>;
  }

  if (isInitialLoad || isLoading) {
    return <div>Loading proposals...</div>;
  }

  const activeProposals = proposals.filter(
    (proposal) => !proposal.executed && proposal.deadline * 1000 < Date.now()
  );
  const inActiveProposals = proposals.filter(
    (proposal) => proposal.executed || proposal.deadline * 1000 >= Date.now()
  );

  return (
    <div>
      <div className="flex w-full flex-col gap-6">
        <Tabs defaultValue="active">
          <TabsList className="flex gap-4 mb-2">
            <TabsTrigger
              onClick={handleActive}
              value="active"
              className={
                active
                  ? "text-blue-700 border-2 border-blue-700 shadow-lg shadow-blue-700 cursor-pointer"
                  : "border-[1px] border-black text-black cursor-pointer"
              }
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              onClick={handleInActive}
              value="inactive"
              className={
                inActive
                  ? "text-red-700 border-2 border-red-700 shadow-lg shadow-red-700 cursor-pointer"
                  : "border-[1px] border-black text-black cursor-pointer"
              }
            >
              InActive
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="active"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-3 my-5 mx-5 md:mx-0"
          >
            {activeProposals.length === 0 ? (
              <span>No active Proposals</span>
            ) : (
              activeProposals.map((p) => (
                <ProposalCard key={p.id} {...p} handleVote={() => {}} />
              ))
            )}
          </TabsContent>
          <TabsContent
            value="inactive"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-5 my-5 mx-5 md:mx-0 hover:animate-pulse"
          >
            {inActiveProposals.length === 0 ? (
              <span>No Inactive Proposals</span>
            ) : (
              inActiveProposals.map((p) => (
                <ProposalCard
                  key={p.id}
                  {...p}
                  className="gap-2"
                  handleVote={() => {}}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Proposals;
