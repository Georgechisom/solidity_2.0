import React, { useState, useEffect } from "react";
import {
  useWatchContractEvent,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import { Quadratic_Governance_Voting_Contract_Address } from "../config/Abi";

const UseCreateProposal = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const publicClient = usePublicClient();
  const { writeContract: createProposalWrite } = useWriteContract();

  console.log("viewProposals", proposals);

  // Fetch existing proposals on mount
  useEffect(() => {
    const fetchExistingProposals = async () => {
      try {
        setIsLoading(true);

        // Get total proposal count
        const proposalCount = await publicClient.readContract({
          address: import.meta.env
            .VITE_Quadratic_Governance_Voting_Contract_Address,
          abi: Quadratic_Governance_Voting_Contract_Address,
          functionName: "getProposalCount",
        });

        console.log("Proposal count:", proposalCount);

        const existingProposals = [];

        // Fetch each proposal
        for (let i = 0; i < Number(proposalCount); i++) {
          try {
            const proposal = await publicClient.readContract({
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

        setProposals(existingProposals);
        setIsInitialLoad(false);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching proposals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (publicClient) {
      fetchExistingProposals();
    }
  }, [publicClient]);

  // Listen for new proposals
  useWatchContractEvent({
    address: import.meta.env.VITE_Quadratic_Governance_Voting_Contract_Address,
    abi: Quadratic_Governance_Voting_Contract_Address,
    eventName: "ProposalCreated",
    onLogs(logs) {
      console.log("New proposal event:", logs);
      // Only add if it's not already in the list (to avoid duplicates)
      const newProposalId = Number(logs[0].args.proposalId);
      const exists = proposals.some((p) => p.id === newProposalId);

      if (!exists) {
        const newProposal = {
          id: newProposalId,
          description: logs[0].args.description,
          recipient: logs[0].args.recipient,
          amount: logs[0].args.amount.toString(),
          deadline: Number(logs[0].args.deadline),
          voteCount: 0,
          executed: false,
          isVoted: false,
        };
        setProposals((prev) => [...prev, newProposal]);
      }
    },
  });

  const createProposal = (description, recipient, amount, duration) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Creating proposal with:", {
        description,
        recipient,
        amount,
        duration,
      });
      createProposalWrite({
        address: import.meta.env
          .VITE_Quadratic_Governance_Voting_Contract_Address,
        abi: Quadratic_Governance_Voting_Contract_Address,
        functionName: "createProposal",
        args: [description, recipient, amount, duration],
      });
    } catch (err) {
      setError(err.message);
      console.error("Error creating proposal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { proposals, createProposal, isLoading, error, isInitialLoad };
};

export default UseCreateProposal;
