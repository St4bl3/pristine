// app/admin/page.tsx

"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import axios from "axios";
import { useState } from "react";

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
  const [auctionType, setAuctionType] = useState<"STANDARD" | "SEALED">("STANDARD");
  const [auctionEndTime, setAuctionEndTime] = useState<string>("");

  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [editImage, setEditImage] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editStartingPrice, setEditStartingPrice] = useState<number>(0);
  const [editAuctionType, setEditAuctionType] = useState<"STANDARD" | "SEALED">("STANDARD");
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
    setEditAuctionEndTime(new Date(product.auctionEndTime).toISOString().slice(0,16)); // For input type datetime-local
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
        <Navbar />
        <div className="text-center mt-10">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 lg:px-0 my-8 pt-20">
        <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>
        {/* Create Product Form */}
        <div className="bg-white p-6 shadow-md rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Auction Type</label>
              <select
                value={auctionType}
                onChange={(e) => setAuctionType(e.target.value as "STANDARD" | "SEALED")}
                required
                className="w-full border px-3 py-2 rounded-md"
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
                className="w-full border px-3 py-2 rounded-md"
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
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Auction End Time</label>
              <input
                type="datetime-local"
                value={auctionEndTime}
                onChange={(e) => setAuctionEndTime(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Existing Products</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Auction Type</th>
                <th className="px-4 py-2">Current Bid</th>
                <th className="px-4 py-2">Auction End Time</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Winner</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.auctionType}</td>
                  <td className="px-4 py-2">${product.currentBid.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {new Date(product.auctionEndTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{product.status}</td>
                  <td className="px-4 py-2">{product.winnerId || "N/A"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2 hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Product Modal */}
        {editProductId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Edit Product</h2>
                <button
                  onClick={() => setEditProductId(null)}
                  className="text-gray-700 hover:text-gray-900 text-xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Image URL</label>
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Auction Type</label>
                  <select
                    value={editAuctionType}
                    onChange={(e) => setEditAuctionType(e.target.value as "STANDARD" | "SEALED")}
                    required
                    className="w-full border px-3 py-2 rounded-md"
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
                    className="w-full border px-3 py-2 rounded-md"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700">Starting Price</label>
                  <input
                    type="number"
                    value={editStartingPrice}
                    onChange={(e) => setEditStartingPrice(Number(e.target.value))}
                    required
                    min={0}
                    step={0.01}
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Auction End Time</label>
                  <input
                    type="datetime-local"
                    value={editAuctionEndTime}
                    onChange={(e) => setEditAuctionEndTime(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditProductId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
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