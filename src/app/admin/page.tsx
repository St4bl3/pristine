// app/admin/page.tsx

"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import axios from "axios";
import { useState } from "react";
import Navbar2 from "@/components/navbaradmin";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  auctionType: "STANDARD" | "SEALED";
  auctionEndTime: string;
  status: string;
  winnerId?: string | null;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const allowedUserId = "user_2nwADPhoWPyUlKJqOHxWoo0nday";

  useEffect(() => {
    if (isLoaded && (!user || user.id !== allowedUserId)) {
      router.push("/"); // Redirect to home or unauthorized page
    }
  }, [user, isLoaded, router]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form states
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [auctionType, setAuctionType] = useState<"STANDARD" | "SEALED">(
    "STANDARD"
  );
  const [auctionEndTime, setAuctionEndTime] = useState<string>("");

  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [editImage, setEditImage] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editStartingPrice, setEditStartingPrice] = useState<number>(0);
  const [editAuctionType, setEditAuctionType] = useState<"STANDARD" | "SEALED">(
    "STANDARD"
  );
  const [editAuctionEndTime, setEditAuctionEndTime] = useState<string>("");

  useEffect(() => {
    if (user && user.id === allowedUserId) {
      fetchProducts();
    }
  }, [user]);

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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/products", {
        name,
        category,
        image,
        description,
        startingPrice,
        auctionType,
        auctionEndTime,
      });
      setProducts([...products, res.data]);
      // Reset form
      setName("");
      setCategory("");
      setImage("");
      setDescription("");
      setStartingPrice(0);
      setAuctionType("STANDARD");
      setAuctionEndTime("");
      alert("Product created successfully");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditProductId(product.id);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditImage(product.image);
    setEditDescription(product.description);
    setEditStartingPrice(product.startingPrice);
    setEditAuctionType(product.auctionType);
    setEditAuctionEndTime(
      new Date(product.auctionEndTime).toISOString().slice(0, 16)
    ); // For input type datetime-local
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductId) return;
    try {
      const res = await axios.put(`/api/admin/products/${editProductId}`, {
        name: editName,
        category: editCategory,
        image: editImage,
        description: editDescription,
        startingPrice: editStartingPrice,
        auctionType: editAuctionType,
        auctionEndTime: editAuctionEndTime,
      });
      setProducts(
        products.map((product) =>
          product.id === editProductId ? res.data : product
        )
      );
      // Reset edit form
      setEditProductId(null);
      setEditName("");
      setEditCategory("");
      setEditImage("");
      setEditDescription("");
      setEditStartingPrice(0);
      setEditAuctionType("STANDARD");
      setEditAuctionEndTime("");
      alert("Product updated successfully");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product");
    }
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

  return (
    <div>
      <Navbar2 />
      <div className="container mx-auto px-4 lg:px-0 my-8 pt-20">
        <h1 className="text-4xl font-bold mb-6 text-center text-accent1">
          Admin Dashboard
        </h1>
        {/* Create Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-accent1">
            Create New Product
          </h2>
          <form
            onSubmit={handleCreateProduct}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700">Auction Type</label>
              <select
                value={auctionType}
                onChange={(e) =>
                  setAuctionType(e.target.value as "STANDARD" | "SEALED")
                }
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
              >
                <option value="STANDARD">Standard</option>
                <option value="SEALED">Sealed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
                rows={4}
                placeholder="Enter product description..."
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700">Starting Price</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                required
                min={0}
                step={0.01}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700">Auction End Time</label>
              <input
                type="datetime-local"
                value={auctionEndTime}
                onChange={(e) => setAuctionEndTime(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
              />
            </div>
            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                className="bg-accent1 text-white px-6 py-2 rounded-md hover:bg-accent2 transition-colors duration-300"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-accent1">
            Existing Products
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700">
                    Auction Type
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700">
                    Current Bid
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700">
                    Auction End Time
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-gray-700">Winner</th>
                  <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.category}</td>
                    <td className="px-4 py-2">{product.auctionType}</td>
                    <td className="px-4 py-2">
                      ${product.currentBid.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(product.auctionEndTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{product.status}</td>
                    <td className="px-4 py-2">{product.winnerId || "N/A"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-accent1 text-white px-3 py-1 rounded-md mr-2 hover:bg-accent2 transition-colors duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Product Modal */}
        {editProductId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-accent1">
                  Edit Product
                </h2>
                <button
                  onClick={() => setEditProductId(null)}
                  className="text-gray-700 hover:text-gray-900 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form
                onSubmit={handleUpdateProduct}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Image URL</label>
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Auction Type</label>
                  <select
                    value={editAuctionType}
                    onChange={(e) =>
                      setEditAuctionType(
                        e.target.value as "STANDARD" | "SEALED"
                      )
                    }
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="SEALED">Sealed</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
                    rows={4}
                    placeholder="Enter product description..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700">Starting Price</label>
                  <input
                    type="number"
                    value={editStartingPrice}
                    onChange={(e) =>
                      setEditStartingPrice(Number(e.target.value))
                    }
                    required
                    min={0}
                    step={0.01}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    Auction End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editAuctionEndTime}
                    onChange={(e) => setEditAuctionEndTime(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent1 transition-colors duration-200"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditProductId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-accent1 text-white px-4 py-2 rounded-md hover:bg-accent2 transition-colors duration-300"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
