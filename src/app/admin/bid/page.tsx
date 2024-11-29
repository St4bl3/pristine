// app/admin/bid/page.tsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/footer";
import Navbar2 from "@/components/navbaradmin";

interface Product {
  id: string;
  name: string;
  category: string;
  auctionType: "STANDARD" | "SEALED";
  currentBid: number;
  status: string;
}

interface Bid {
  id: string;
  bidAmount: number;
  bidderId: string;
  timestamp: string;
}

export default function AdminBidPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/admin/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleViewBids = async (product: Product) => {
    setSelectedProduct(product);
    setBidsLoading(true);
    try {
      const res = await axios.get(`/api/admin/products/${product.id}/bids`);
      setBids(res.data);
    } catch (error) {
      console.error("Failed to fetch bids:", error);
      alert("Failed to fetch bids");
    } finally {
      setBidsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setBids([]);
  };

  if (loading) {
    return (
      <div>
        <Navbar2 />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Group products by category and auction type
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = {};
    }
    if (!acc[product.category][product.auctionType]) {
      acc[product.category][product.auctionType] = [];
    }
    acc[product.category][product.auctionType].push(product);
    return acc;
  }, {} as { [category: string]: { [auctionType: string]: Product[] } });

  return (
    <div>
      <Navbar2 />
      <div className="container mx-auto px-4 lg:px-0 my-8 pt-20">
        <h1 className="text-4xl font-bold mb-6 text-center text-accent1">
          Admin - View Bids
        </h1>
        {Object.entries(groupedProducts).map(([category, auctionTypes]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 capitalize text-accent1">
              {category} Category
            </h2>
            {Object.entries(auctionTypes).map(([auctionType, products]) => (
              <div key={auctionType} className="mb-4">
                <h3 className="text-xl font-medium mb-2 text-accent2">
                  {auctionType} Auctions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          {product.name}
                        </h4>
                        <p className="text-gray-600 mt-2">
                          Current Bid: ${product.currentBid.toFixed(2)}
                        </p>
                        <p className="text-gray-600">
                          Status: {product.status}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewBids(product)}
                        className="mt-4 bg-accent1 text-white px-4 py-2 rounded-md hover:bg-accent2 transition-colors duration-300"
                      >
                        View Bids
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Bids Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-accent1">
                  Bids for {selectedProduct.name}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-700 hover:text-gray-900 text-3xl font-bold"
                >
                  &times;
                </button>
              </div>
              {bidsLoading ? (
                <div className="text-center text-gray-500">Loading bids...</div>
              ) : bids.length === 0 ? (
                <div className="text-center text-gray-500">
                  No bids placed yet.
                </div>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left text-gray-700">
                        Bidder ID
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Bid Amount
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid) => (
                      <tr key={bid.id} className="border-t">
                        <td className="px-4 py-2 text-gray-700">
                          {bid.bidderId}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          ${bid.bidAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-gray-500">
                          {new Date(bid.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
