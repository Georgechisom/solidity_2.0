import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shortAddress } from "../../lib/utils";

export function ProposalCard({
  id,
  description,
  amount,
  recipient,
  voteCount,
  deadline,
  executed,
  isVoted,
  handleVote,
}) {
  const descriptions = description;
  return (
    <Card className="w-full max-w-sm border-2 border-blue-700 shadow-lg shadow-blue-700">
      <CardHeader>
        <CardTitle className="font-bold text-blue-700">
          Proposal #{id}
        </CardTitle>
        <CardDescription>
          {descriptions ? description : "No Description"}
        </CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            <span className="font-semibold ">Recipient:</span>{" "}
            <span className="italic">{shortAddress(recipient, 4)}</span>
          </div>
          <div>
            <span className="font-semibold">Amount:</span>{" "}
            <span className="italic">{amount}</span>
          </div>
          <div>
            <span className="font-semibold">vote count:</span>{" "}
            <span className="italic">{voteCount}</span>
          </div>
          <div>
            <span className="font-semibold">Executed:</span>{" "}
            <span className="italic">{executed ? "True" : "False"}</span>
          </div>
          <div>
            <span className="font-semibold"> Deadline:</span>{" "}
            <span className="italic">{deadline}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          onClick={handleVote}
          disabled={isVoted}
          type="submit"
          className="w-full bg-blue-700 hover:border-2 hover:bg-white hover:border-blue-700 hover:text-blue-700"
        >
          Vote
        </Button>

        <div className="text-xs text-blue-700 font-semibold text-left">
          Dao Governance
        </div>
      </CardFooter>
    </Card>
  );
}
