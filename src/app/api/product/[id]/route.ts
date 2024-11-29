// app/api/product/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap the params promise explicitly
    const { id } = await context.params;

    // Fetch the product without bids initially
    const product = await prisma.product.findUnique({
      where: { id },
      include: {},
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let bids: Array<{ id: string; bidAmount: number; productId: string }> = [];

    if (product.auctionType === "STANDARD") {
      // Include bids for standard auctions
      bids = await prisma.bid.findMany({
        where: { productId: product.id },
        orderBy: { bidAmount: "desc" },
      });
    } else if (product.auctionType === "SEALED") {
      if (product.status !== "Active") {
        // Include bids only after auction ends
        bids = await prisma.bid.findMany({
          where: { productId: product.id },
          orderBy: { bidAmount: "desc" },
        });
      }
      // Else, do not include bids
    }

    const responseProduct = {
      ...product,
      bids,
    };

    return NextResponse.json(responseProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the product" },
      { status: 500 }
    );
  }
}
