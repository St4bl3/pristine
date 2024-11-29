// app/api/product/status-update/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT() {
  const now = new Date();

  try {
    // Find products where auction has ended and status is still "Active"
    const expiredProducts = await prisma.product.findMany({
      where: {
        auctionEndTime: { lt: now },
        status: "Active",
      },
      include: { bids: true },
    });

    for (const product of expiredProducts) {
      let newStatus = "Expired";
      let winnerId: string | null = null;

      if (product.bids.length > 0) {
        if (product.auctionType === "STANDARD") {
          // Highest bid wins
          const highestBid = product.bids.reduce((prev, current) => {
            return prev.bidAmount > current.bidAmount ? prev : current;
          });

          newStatus = "Sold";
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
            newStatus = "Sold";
            winnerId = highestUniqueBid.bidderId;
          }
        }
      }

      await prisma.product.update({
        where: { id: product.id },
        data: {
          status: newStatus,
          winnerId: winnerId || null,
        },
      });
    }

    return NextResponse.json({ message: "Product statuses updated" });
  } catch (error) {
    console.error("Error updating product statuses:", error);
    return NextResponse.json(
      { error: "An error occurred while updating product statuses" },
      { status: 500 }
    );
  }
}
