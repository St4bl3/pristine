// src/components/ProductCard.tsx

import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    currentBid: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
        <p className="text-gray-600 mt-2">Current Bid: ${product.currentBid}</p>
        <Link href={`/product/${product.id}`}>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform duration-300">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
