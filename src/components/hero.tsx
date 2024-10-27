"use client";
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-[#6c69eb] to-[#B100FF] text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Pristine Fashion Auctions
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-[#8e00cc] text-center">
        Discover exclusive, high-end fashion collections in real-time auctions.
        Join the next generation of fashion bidding with Pristine’s secure,
        blockchain-powered platform.
      </p>
    </BackgroundLines>
  );
}
