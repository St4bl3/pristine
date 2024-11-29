// app/api/products/[category]/[auctionType]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; auctionType: string } }
) {
  const { category, auctionType } = params;

  // Validate auctionType
  const validAuctionTypes = ["STANDARD", "SEALED"];
  const auctionTypeUpper = auctionType.toUpperCase();
  if (!validAuctionTypes.includes(auctionTypeUpper)) {
    return NextResponse.json(
      { error: "Invalid auction type" },
      { status: 400 }
    );
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        category: category.toLowerCase(),
        auctionType: auctionTypeUpper as "STANDARD" | "SEALED", // Prisma enums need exact type
      },
      include: {
        bids: {
          orderBy: { bidAmount: "desc" },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching products" },
      { status: 500 }
    );
  }
}
