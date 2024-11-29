// app/api/admin/products/[id]/bids/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define Params interface
interface Params {
  id: string;
}

// Define RouteContext interface, including params and searchParams
interface RouteContext {
  params: Params;
  searchParams: URLSearchParams;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = context.params;

  // Validate that 'id' is present
  if (!id) {
    return NextResponse.json(
      { error: "Product ID is missing." },
      { status: 400 }
    );
  }

  try {
    // Fetch bids for the specific product using Prisma
    const bids = await prisma.bid.findMany({
      where: { productId: id },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(bids); // Return the fetched bids as JSON
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}
