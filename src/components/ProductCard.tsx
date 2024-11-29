// components/ProductCard.tsx

import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    currentBid: number;
    auctionType: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Image
        src={product.image}
        alt={product.name}
        width={500}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-800">{product.name}</h2>
        <p className="text-gray-600 mt-2">
          <span className="font-medium text-accent1">Current Bid:</span> $
          {product.currentBid}
        </p>
        <p className="text-gray-600 mt-1">
          <span className="font-medium text-accent1">Auction Type:</span>{" "}
          {product.auctionType}
        </p>
        <Link href={`/product/${product.id}`}>
          <button className="mt-4 w-full bg-accent1 text-white py-2 rounded-md hover:bg-accent2 transition-colors duration-300">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
