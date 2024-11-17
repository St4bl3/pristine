// src/app/api/bid/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, bidAmount } = await request.json();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (
    !product ||
    product.auctionEndTime < new Date() ||
    product.status !== "Active"
  ) {
    return NextResponse.json({ error: "Auction has ended" }, { status: 400 });
  }

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

  // Add bid to product's bids
  await prisma.bid.create({
    data: {
      bidAmount,
      bidderId: userId,
      productId,
    },
  });

  // Add to ledger
  await prisma.ledger.create({
    data: {
      productId,
      bidderId: userId,
      bidAmount,
    },
  });

  return NextResponse.json({ message: "Bid placed successfully" });
}
