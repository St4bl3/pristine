"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BidList from "@/components/BidList";
import BidInput from "@/components/BidInput";
import { useState, useEffect } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import Image from "next/image";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    currentBid: number;
    bids: {
      id: string;
      bidderId: string;
      bidAmount: number;
      timestamp: string;
    }[];
    auctionEndTime: string;
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    params.then((resolved) => setResolvedParams(resolved));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/${resolvedParams.id}`);
        setProduct(res.data);
        const remainingTime =
          new Date(res.data.auctionEndTime).getTime() - Date.now();
        setTimeLeft(remainingTime > 0 ? remainingTime : 0);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchProduct();

    const pusher = new Pusher("your-pusher-key", {
      cluster: "your-cluster",
    });

    const channel = pusher.subscribe(`product-${resolvedParams.id}`);
    channel.bind(
      "bid-placed",
      (data: {
        currentBid: number;
        newBid: {
          id: string;
          bidderId: string;
          bidAmount: number;
          timestamp: string;
        };
      }) => {
        setProduct((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentBid: data.currentBid,
            bids: [
              {
                id: data.newBid.id,
                bidderId: data.newBid.bidderId,
                bidAmount: data.newBid.bidAmount,
                timestamp: data.newBid.timestamp,
              },
              ...prev.bids,
            ],
          };
        });
      }
    );

    return () => {
      pusher.unsubscribe(`product-${resolvedParams.id}`);
    };
  }, [resolvedParams]);

  useEffect(() => {
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
  }, []);

  if (!resolvedParams || !product)
    return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto my-8 px-4 lg:px-0 pt-24">
        {/* Adjusted padding to avoid navbar overlap */}
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
              <span className="font-bold text-gray-800">Time Left:</span>{" "}
              {auctionEnded
                ? "Auction Ended"
                : `${Math.floor(timeLeft / (60 * 60 * 1000))}h ${
                    Math.floor(timeLeft / (60 * 1000)) % 60
                  }m ${Math.floor(timeLeft / 1000) % 60}s`}
            </p>
            <div className="mt-6">
              <BidInput
                productId={product.id}
                currentBid={product.currentBid}
                auctionEnded={auctionEnded}
              />
            </div>
          </div>
          {/* Right Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Bid History</h2>
            <BidList bids={product.bids} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
