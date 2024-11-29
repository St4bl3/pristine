// components/BidInput.tsx

"use client";

import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface BidInputProps {
  productId: string;
  currentBid: number;
  auctionEnded: boolean;
}

export default function BidInput({
  productId,
  currentBid,
  auctionEnded,
}: BidInputProps) {
  const { user } = useUser();
  const [bidAmount, setBidAmount] = useState<number>(currentBid + 1);
  const [loading, setLoading] = useState<boolean>(false);

  const placeBid = async () => {
    if (!user) {
      alert("You must be signed in to place a bid.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/bid", {
        productId,
        bidAmount,
      });
      alert("Bid placed successfully");
      setBidAmount(bidAmount + 1); // Increment bid amount for next bid
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.error);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-2">Your Clerk ID: {user?.id}</p>
      <div className="flex items-center">
        <input
          type="number"
          value={bidAmount}
          min={currentBid + 1}
          onChange={(e) => setBidAmount(Number(e.target.value))}
          disabled={auctionEnded || loading}
          className="border px-2 py-1 flex-1"
        />
        <button
          onClick={placeBid}
          disabled={auctionEnded || loading}
          className={`ml-2 px-4 py-2 rounded ${
            auctionEnded || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white transition-transform duration-300`}
        >
          {loading ? "Placing..." : "Place Bid"}
        </button>
      </div>
    </div>
  );
}
