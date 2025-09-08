import React, { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { Quadratic_Governance_Voting_Contract_Address } from "../config/Abi";

const UseChairPerson = () => {
  const [chairPerson, setChairPerson] = useState();
  const [balance, setBalance] = useState();
  const [proposalCount, setProposalCount] = useState();
  const [realProposal, setReadProposal] = useState();

  const publicClient = usePublicClient();

  // const result1 = useReadContract({
  //   address: import.meta.env.VITE_Quadratic_Governance_Voting_Contract_Address,
  //   abi: Quadratic_Governance_Voting_Contract_Address,
  //   functionName: "quorum",
  // });

  // const targetObject = result1;
  // const handler = {};
  // const proxy = new Proxy(targetObject, handler);

  // console.log("proxy:", targetObject.data);

  // const changer = Number(targetObject.data);

  console.log("proxy1:", chairPerson);

  useEffect(() => {
    (async () => {
      const result = await publicClient.readContract({
        address: import.meta.env
          .VITE_Quadratic_Governance_Voting_Contract_Address,
        abi: Quadratic_Governance_Voting_Contract_Address,
        functionName: "chairperson",
      });

      setChairPerson(result);

      const balance = await publicClient.getBalance({
        address: import.meta.env
          .VITE_Quadratic_Governance_Voting_Contract_Address,
        abi: Quadratic_Governance_Voting_Contract_Address,
      });

      setBalance(balance);

      const proposalCount = await publicClient.readContract({
        address: import.meta.env
          .VITE_Quadratic_Governance_Voting_Contract_Address,
        abi: Quadratic_Governance_Voting_Contract_Address,
        functionName: "getProposalCount",
      });

      console.log("Proposal count:", proposalCount);

      setProposalCount(proposalCount);

      const existingProposals = [];

      for (let i = 0; i < Number(proposalCount); i++) {
        try {
          const proposal = await publicClient.writeContract({
            address: import.meta.env
              .VITE_Quadratic_Governance_Voting_Contract_Address,
            abi: Quadratic_Governance_Voting_Contract_Address,
            functionName: "createProposal",
            args: [i],
          });

          console.log(`Proposal ${i}:`, proposal);

          existingProposals.push({
            id: i,
            description: proposal.description,
            recipient: proposal.recipient,
            amount: proposal.amount.toString(),
            deadline: Number(proposal.deadline),
            voteCount: Number(proposal.voteCount),
            executed: proposal.executed,
            isVoted: false,
          });
        } catch (err) {
          console.error(`Error fetching proposal ${i}:`, err);
        }
      }

      setReadProposal(existingProposals);
    })();
  }, [publicClient]);

  console.log("existingProposals:", realProposal);

  return useMemo(
    () => ({ chairPerson, balance, proposalCount, realProposal }),
    [chairPerson, balance, proposalCount, realProposal]
  );
};

export default UseChairPerson;
