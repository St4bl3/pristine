// app/api/admin/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ProductInput {
  name: string;
  category: string;
  image: string;
  description: string;
  startingPrice: number;
  auctionType: "STANDARD" | "SEALED";
  auctionEndTime: string; // ISO string
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductInput = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.category ||
      !body.image ||
      !body.description ||
      !body.startingPrice ||
      !body.auctionType ||
      !body.auctionEndTime
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        category: body.category,
        image: body.image,
        description: body.description,
        startingPrice: body.startingPrice,
        currentBid: body.startingPrice,
        auctionType: body.auctionType,
        auctionEndTime: new Date(body.auctionEndTime),
        status: "Active",
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        bids: true,
      },
      orderBy: {
        auctionEndTime: "asc",
      },
    });
    console.log(request)

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
