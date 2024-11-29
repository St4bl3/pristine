// app/api/admin/products/[id]/bids/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Explicitly define Params interface
interface Params {
  id: string;
}

// Explicitly typing the GET method with correct parameter handling
export async function GET(
  request: NextRequest,
  { params }: { params: Params } // Explicitly type `params`
) {
  const { id } = params; // Access the product id from the context

  try {
    // Fetch bids for the specific product using Prisma
    const bids = await prisma.bid.findMany({
      where: { productId: id },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}
