// src/components/BidInput.tsx

import { useState } from "react";
import axios from "axios";

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
  const [bidAmount, setBidAmount] = useState(currentBid + 1);

  const placeBid = async () => {
    try {
      await axios.post("/api/bid", {
        productId,
        bidAmount,
      });
      alert("Bid placed successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.error);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <input
        type="number"
        value={bidAmount}
        min={currentBid + 1}
        onChange={(e) => setBidAmount(Number(e.target.value))}
        disabled={auctionEnded}
        className="border px-2 py-1"
      />
      <button
        onClick={placeBid}
        disabled={auctionEnded}
        className="ml-2 bg-green-500 text-white px-4 py-2"
      >
        Place Bid
      </button>
    </div>
  );
}
