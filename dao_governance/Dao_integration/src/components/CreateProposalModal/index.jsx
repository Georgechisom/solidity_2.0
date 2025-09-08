import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "../DataTimePicker";
import { parseEther } from "ethers";
import UseCreateProposal from "../../hooks/UseCreateProposal";

export function CreateProposalModal() {
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState();

  const { createProposal } = UseCreateProposal();

  const handleCreateProposal = () => {
    if (description && recipient && amount && deadline) {
      createProposal(
        description,
        recipient,
        parseEther(amount),
        deadline.valueOf() - Math.floor(Date.now() / 1000)
      );
      // Reset form
      setDescription("");
      setRecipient("");
      setAmount("");
      setDeadline(null);
    }
  };

  console.log("createProposals", createProposal);

  return (
    <di>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-blue-700 border-2 border-blue-700 font-semibold"
            >
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-2 border-blue-700 shadow-md shadow-blue-700">
            <DialogHeader>
              <DialogTitle className="text-blue-700 font-bold ">
                Create Proposal
              </DialogTitle>
              <hr className="border-b-[1.5px] border-blue-700 mt-2 mb-4" />
              <DialogDescription className="text-blue-700 font-bold italic">
                Create a new proposal once all requirements are reached
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label
                  htmlFor="name-1"
                  className="text-blue-700 font-bold mt-2"
                >
                  Proposal Name
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={description}
                  placeholder="Describe Proposal"
                  className="border-2 border-blue-700 text-blue-700"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1" className="text-blue-700 font-bold">
                  Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  value={amount}
                  placeholder="Enter Amount"
                  className="border-2 border-blue-700 text-blue-700"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1" className="text-blue-700 font-bold">
                  Recipient
                </Label>
                <Input
                  id="recipient"
                  name="recipient"
                  value={recipient}
                  placeholder="0x..ff23"
                  className="border-2 border-blue-700 text-blue-700"
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1" className="text-blue-700 font-bold">
                  Deadline
                </Label>
                <DateTimePicker date={deadline} setDate={setDeadline} />
              </div>
            </div>
            <DialogFooter className="gap-4 md:gap-40 my-4 w-full">
              <Button
                type="submit"
                className="bg-green-700 text-white font-semibold w-full my-1"
                onClick={handleCreateProposal}
              >
                create proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </di>
  );
}
