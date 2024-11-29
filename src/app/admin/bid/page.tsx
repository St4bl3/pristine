// app/admin/bid/page.tsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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
        <Navbar />
        <div className="text-center mt-10">Loading...</div>
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
      <Navbar />
      <div className="container mx-auto px-4 lg:px-0 my-8 pt-20">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Admin - View Bids
        </h1>
        {Object.entries(groupedProducts).map(([category, auctionTypes]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {category} Category
            </h2>
            {Object.entries(auctionTypes).map(([auctionType, products]) => (
              <div key={auctionType} className="mb-4">
                <h3 className="text-xl font-medium mb-2">
                  {auctionType} Auctions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="text-lg font-bold">{product.name}</h4>
                        <p className="text-gray-600 mt-1">
                          Current Bid: ${product.currentBid.toFixed(2)}
                        </p>
                        <p className="text-gray-600">
                          Status: {product.status}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewBids(product)}
                        className="mt-4 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
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
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl overflow-y-auto max-h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  Bids for {selectedProduct.name}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-700 hover:text-gray-900 text-xl font-bold"
                >
                  &times;
                </button>
              </div>
              {bidsLoading ? (
                <div className="text-center">Loading bids...</div>
              ) : bids.length === 0 ? (
                <div className="text-center">No bids placed yet.</div>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2">Bidder ID</th>
                      <th className="px-4 py-2">Bid Amount</th>
                      <th className="px-4 py-2">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid) => (
                      <tr key={bid.id} className="border-t">
                        <td className="px-4 py-2">{bid.bidderId}</td>
                        <td className="px-4 py-2">
                          ${bid.bidAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
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
