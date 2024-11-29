"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./ui/images-slider";

export function ImagesSliderDemo() {
  const images = ["/2.jpg", "/3.jpg", "9.webp"];
  return (
    <ImagesSlider className="w-screen h-screen" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center w-full h-full"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Pristine Fashion Auctions
        </motion.p>
        <motion.p className="text-lg md:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-2">
          Discover exclusive, high-end fashion collections in real-time
          auctions. Join the next generation of fashion bidding with Pristine’s
          secure, blockchain-powered platform.
        </motion.p>
      </motion.div>
    </ImagesSlider>
  );
}
