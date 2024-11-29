// app/product/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BidList from "@/components/BidList";
import BidInput from "@/components/BidInput";

interface Bid {
  id: string;
  bidderId: string;
  bidAmount: number;
  timestamp: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  currentBid: number;
  bids: Bid[];
  auctionEndTime: string;
  auctionType: string;
  status: string;
  winnerId?: string | null;
}

export default function ProductPage() {
  const { user } = useUser();
  const params = useParams();
  const productId = params.id;
  console.log(user);
  const [product, setProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [auctionEnded, setAuctionEnded] = useState<boolean>(false);
  const [isAssigningWinner, setIsAssigningWinner] = useState<boolean>(false);

  // Function to fetch product data
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/product/${productId}`);
      setProduct(res.data);
      const remainingTime =
        new Date(res.data.auctionEndTime).getTime() - Date.now();
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
      if (remainingTime <= 0) {
        setAuctionEnded(true);
      }
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  // Initial fetch and set up polling every 3 seconds
  useEffect(() => {
    if (productId) {
      fetchProduct();
      const interval = setInterval(() => {
        fetchProduct();
      }, 3000); // 3 seconds

      return () => clearInterval(interval);
    }
  }, [productId]);

  // Timer for auction countdown
  useEffect(() => {
    if (!product) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          setAuctionEnded(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [product]);

  // Assign winner if auction has ended and winnerId is not set
  useEffect(() => {
    const assignWinner = async () => {
      if (
        auctionEnded &&
        product &&
        !product.winnerId &&
        product.status === "Active"
      ) {
        setIsAssigningWinner(true);
        try {
          const res = await axios.post(
            `/api/product/${productId}/assign-winner`
          );
          setProduct(res.data); // Update with the new winnerId and status
        } catch (error) {
          console.error("Failed to assign winner:", error);
        } finally {
          setIsAssigningWinner(false);
        }
      }
    };

    assignWinner();
  }, [auctionEnded, product, productId]);

  if (!product)
    return (
      <>
        <Navbar />
        <div className="text-center mt-10">Loading...</div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-8 px-4 lg:px-0 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={300}
              className="w-full h-96 object-cover rounded-md"
            />
            <h1 className="text-3xl font-bold mt-6">{product.name}</h1>
            <p className="text-gray-700 mt-4">{product.description}</p>
            <p className="text-lg mt-4">
              <span className="font-bold text-gray-800">Current Bid:</span> $
              {product.currentBid}
            </p>
            <p className="text-lg mt-4">
              <span className="font-bold text-gray-800">Auction Type:</span>{" "}
              {product.auctionType}
            </p>
            <p className="text-lg mt-4">
              <span className="font-bold text-gray-800">Time Left:</span>{" "}
              {auctionEnded
                ? "Auction Ended"
                : `${Math.floor(timeLeft / (60 * 60 * 1000))}h ${Math.floor(
                    (timeLeft / (60 * 1000)) % 60
                  )}m ${Math.floor((timeLeft / 1000) % 60)}s`}
            </p>
            {isAssigningWinner && (
              <p className="text-blue-600 mt-4">Assigning winner...</p>
            )}
            {auctionEnded && product.winnerId && (
              <p className="text-lg mt-4">
                <span className="font-bold text-green-600">
                  Winner Clerk ID:
                </span>{" "}
                {product.winnerId}
              </p>
            )}
            {!auctionEnded && (
              <div className="mt-6">
                <BidInput
                  productId={product.id}
                  currentBid={product.currentBid}
                  auctionEnded={auctionEnded}
                />
              </div>
            )}
            {auctionEnded &&
              product.auctionType === "SEALED" &&
              !product.winnerId && (
                <p className="text-gray-600 mt-4">
                  Bids are sealed. Awaiting auction results.
                </p>
              )}
          </div>
          {/* Right Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Bid History</h2>
            {product.auctionType === "SEALED" && product.status === "Active" ? (
              <p className="text-gray-600">
                Bids are sealed and not visible until auction ends.
              </p>
            ) : (
              <BidList bids={product.bids} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
