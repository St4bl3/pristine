import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  currentBid: number;
}

export default async function ChildrenPage() {
  const products: Product[] = await prisma.product.findMany({
    where: { category: "children" },
  });

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 lg:px-0 my-8 pt-20">
        {/* Adjusted padding to avoid navbar overlap */}
        <h1 className="text-4xl font-bold mb-6 text-center">
          Children&apos;s Collection
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Updated grid to show four cards per row */}
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
