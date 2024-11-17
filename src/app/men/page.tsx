import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";

export default async function MenPage() {
  const products = await prisma.product.findMany({
    where: { category: "men" },
  });

  return (
    <div>
      <Navbar />
      {/* Add top padding to prevent overlap */}
      <div className="container mx-auto px-4 lg:px-0 my-8 pt-24">
        {/* Adjusted pt-24 for navbar height */}
        <h1 className="text-4xl font-bold mb-6 text-center">
          Men&apos;s Collection
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
