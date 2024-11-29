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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const placeBid = async () => {
    if (!user) {
      setError("You must be signed in to place a bid.");
      return;
    }

    if (bidAmount < currentBid + 1) {
      setError(`Bid must be at least $${currentBid + 1}`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post("/api/bid", {
        productId,
        bidAmount,
      });
      setSuccess("Bid placed successfully!");
      setBidAmount(bidAmount + 1); // Increment bid amount for next bid
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <p className="text-gray-700 mb-4">
        <span className="font-medium text-accent1">Your Clerk ID:</span>{" "}
        {user?.id}
      </p>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="flex-1 w-full sm:mr-4">
          <label htmlFor="bidAmount" className="sr-only">
            Bid Amount
          </label>
          <input
            type="number"
            id="bidAmount"
            value={bidAmount}
            min={currentBid + 1}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            disabled={auctionEnded || loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
            placeholder={`Enter at least $${currentBid + 1}`}
          />
        </div>
        <button
          onClick={placeBid}
          disabled={auctionEnded || loading}
          className={`mt-4 sm:mt-0 w-full sm:w-auto px-6 py-2 rounded-md text-white font-semibold transition-transform duration-200 ${
            auctionEnded || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-accent1 hover:bg-accent2 transform hover:scale-105"
          }`}
        >
          {loading ? "Placing..." : "Place Bid"}
        </button>
      </div>
      {/* Feedback Messages */}
      {error && (
        <p className="mt-4 text-red-500 text-sm">
          <span className="font-medium">Error:</span> {error}
        </p>
      )}
      {success && (
        <p className="mt-4 text-green-500 text-sm">
          <span className="font-medium">Success:</span> {success}
        </p>
      )}
      {/* Auction Ended Message */}
      {auctionEnded && (
        <p className="mt-4 text-gray-500 text-sm">
          Auctions have ended. Bidding is closed.
        </p>
      )}
    </div>
  );
}
