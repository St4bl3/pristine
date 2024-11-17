import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap the params promise explicitly
    const { id } = await context.params;

    // Fetch the product and its bids
    const product = await prisma.product.findUnique({
      where: { id },
      include: { bids: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the product" },
      { status: 500 }
    );
  }
}
