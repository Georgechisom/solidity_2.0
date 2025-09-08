import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAddress } from "viem";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const shortAddress = (address, length) => {
  if (!isAddress) return "Invalid Address";

  return `${address.slice(0, length + 1)}...${address.slice(
    address.length - length
  )}`;
};
