// src/app/api/products/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";

  const products = await prisma.product.findMany({
    where: { category },
  });

  return NextResponse.json(products);
}
