// app/api/bid/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { productId, bidAmount } = await request.json();

    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (
      !product ||
      product.auctionEndTime < new Date() ||
      product.status !== "Active"
    ) {
      return NextResponse.json(
        { error: "Auction has ended or product not found" },
        { status: 400 }
      );
    }

    if (product.auctionType === "STANDARD") {
      if (bidAmount <= product.currentBid) {
        return NextResponse.json(
          { error: "Bid must be higher than current bid" },
          { status: 400 }
        );
      }

      // Update product's current bid
      await prisma.product.update({
        where: { id: productId },
        data: { currentBid: bidAmount },
      });

      // Add the new bid
      await prisma.bid.create({
        data: {
          bidAmount,
          bidderId: userId, // Clerk user ID
          productId,
        },
      });

      return NextResponse.json({ message: "Bid placed successfully" });
    } else if (product.auctionType === "SEALED") {
      if (bidAmount < product.startingPrice) {
        return NextResponse.json(
          { error: "Bid must be at least the starting price" },
          { status: 400 }
        );
      }

      // For sealed auctions, just create the bid without updating currentBid
      await prisma.bid.create({
        data: {
          bidAmount,
          bidderId: userId, // Clerk user ID
          productId,
        },
      });

      return NextResponse.json({ message: "Bid placed successfully" });
    } else {
      return NextResponse.json(
        { error: "Invalid auction type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
