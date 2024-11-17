// src/app/api/product/status-update/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT() {
  const now = new Date();

  // Update expired auctions
  await prisma.product.updateMany({
    where: {
      auctionEndTime: { lt: now },
      status: "Active",
    },
    data: {
      status: "Expired",
    },
  });

  // Update sold products
  await prisma.product.updateMany({
    where: {
      auctionEndTime: { lt: now },
      status: "Active",
      bids: { some: {} },
    },
    data: {
      status: "Sold",
    },
  });

  return NextResponse.json({ message: "Product statuses updated" });
}
