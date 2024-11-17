import Pusher from "pusher";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const pusher = new Pusher({
  appId: "your-app-id",
  key: "your-pusher-key",
  secret: "your-pusher-secret",
  cluster: "your-cluster",
  useTLS: true,
});

export async function POST(request: Request) {
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

  // Add the new bid
  const newBid = await prisma.bid.create({
    data: {
      bidAmount,
      bidderId: "currentUserId", // Replace with actual user ID from authentication
      productId,
    },
  });

  // Trigger Pusher event
  pusher.trigger(`product-${productId}`, "bid-placed", {
    currentBid: bidAmount,
    newBid: {
      id: newBid.id,
      bidderId: newBid.bidderId,
      bidAmount: newBid.bidAmount,
      timestamp: newBid.timestamp,
    },
  });

  return NextResponse.json({ message: "Bid placed successfully" });
}
