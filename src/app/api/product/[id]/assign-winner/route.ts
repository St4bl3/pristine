// app/api/product/[id]/assign-winner/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;

  try {
    // Fetch the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { bids: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if auction has ended and winnerId is not set
    if (
      product.auctionEndTime > new Date() ||
      product.status !== "Active" ||
      product.winnerId
    ) {
      return NextResponse.json(
        { error: "Cannot assign winner yet" },
        { status: 400 }
      );
    }

    if (product.bids.length === 0) {
      // No bids placed
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { status: "Expired" },
        include: { bids: true },
      });
      return NextResponse.json(updatedProduct);
    }

    // Determine the winner based on auction type
    let winnerId: string | null = null;

    if (product.auctionType === "STANDARD") {
      // Highest bid wins
      const highestBid = product.bids.reduce((prev, current) => {
        return prev.bidAmount > current.bidAmount ? prev : current;
      });
      winnerId = highestBid.bidderId;
    } else if (product.auctionType === "SEALED") {
      // Highest unique bid wins
      const bidCount: { [key: number]: number } = {};
      product.bids.forEach((bid) => {
        bidCount[bid.bidAmount] = (bidCount[bid.bidAmount] || 0) + 1;
      });

      const uniqueBids = product.bids.filter(
        (bid) => bidCount[bid.bidAmount] === 1
      );

      if (uniqueBids.length > 0) {
        const highestUniqueBid = uniqueBids.reduce((prev, current) => {
          return prev.bidAmount > current.bidAmount ? prev : current;
        });
        winnerId = highestUniqueBid.bidderId;
      }
    }

    if (winnerId) {
      // Update the product with winnerId and status
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          status: "Sold",
          winnerId: winnerId,
        },
        include: { bids: true },
      });
      return NextResponse.json(updatedProduct);
    } else {
      // No unique bids found
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { status: "Expired" },
        include: { bids: true },
      });
      return NextResponse.json(updatedProduct);
    }
  } catch (error) {
    console.error("Error assigning winner:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
