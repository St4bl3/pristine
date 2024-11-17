import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure this imports the correct Prisma instance

export async function GET(
  request: Request,
  context: { params: { id: string } } // Explicit typing for `context`
) {
  try {
    const { id } = context.params; // Extract the `id` from `params`

    // Fetch the product with the given ID
    const product = await prisma.product.findUnique({
      where: { id },
      include: { bids: true }, // Include related bids
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
