
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addToCart = useStore((s) => s.addToCart);
  const changeQty = useStore((s) => s.changeQty);
  const toggleWishlist = useStore((s) => s.toggleWishlist);

  const pid = Number(id);

  const qty = useStore(
    (s) => s.cart.find((item) => item.id === pid)?.qty || 0
  );

  const liked = useStore(
    (s) => s.wishlist.some((item) => item.id === pid)
  );

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setImage(0);

        const response = await fetch(
          `https://dummyjson.com/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto h-80 rounded-2xl bg-white/10 animate-pulse" />
    );
  }

  if (error || !product) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold">
          {error || "Product not found"}
        </h2>
        <Link to="/" className="inline-block mt-4 text-purple-400">
          Back to Home
        </Link>
      </div>
    );
  }

  const price = Math.round(product.price * 85);
  const mrp = Math.round(
    price / (1 - product.discountPercentage / 100)
  );

  const item = {
    id: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price,
  };

  const images = product.images?.length
    ? product.images
    : [product.thumbnail];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md p-5"
    >
      <div>
        <div className="rounded-xl bg-white/5 p-4">
          <img
            src={images[image] || product.thumbnail}
            alt={product.title}
            className="w-full h-80 object-contain"
          />
        </div>

        <div className="flex gap-3 mt-4 overflow-x-auto">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`${product.title} ${index + 1}`}
              onClick={() => setImage(index)}
              className={`w-16 h-16 object-contain rounded-lg border cursor-pointer ${
                image === index
                  ? "border-purple-500"
                  : "border-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-sm text-purple-400 uppercase">
          {product.category}
        </p>

        <h1 className="text-2xl font-bold mt-2">
          {product.title}
        </h1>

        <p className="text-white/60 text-sm mt-3">
          {product.description}
        </p>

        <div className="mt-4">
          <span className="bg-green-600 px-3 py-1 rounded text-sm">
            {Number(product.rating || 0).toFixed(1)} ★
          </span>
          <span className="text-white/60 text-sm ml-3">
            {product.availabilityStatus || "Available"}
          </span>
        </div>

        <div className="mt-5">
          <span className="text-3xl font-bold">
            ₹{price.toLocaleString("en-IN")}
          </span>

          <s className="text-white/50 ml-3">
            ₹{mrp.toLocaleString("en-IN")}
          </s>

          <span className="text-green-400 ml-2">
            {Math.round(product.discountPercentage)}% off
          </span>
        </div>

        <p className="text-sm text-green-400 mt-3">
          {product.shippingInformation || "Fast delivery available"}
        </p>

        <div className="flex gap-3 mt-7">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(item)}
              className="flex-1 bg-orange-500 text-black font-bold py-3 rounded-xl"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-5 bg-orange-500 text-black rounded-xl font-bold">
              <button onClick={() => changeQty(pid, -1)}>
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => changeQty(pid, 1)}>
                +
              </button>
            </div>
          )}

          <button
            onClick={() => toggleWishlist(item)}
            className="px-5 py-3 rounded-xl border border-white/20"
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        <Link
          to="/cart"
          className="mt-4 text-center border border-white/20 rounded-xl py-3"
        >
          View Cart
        </Link>
      </div>
    </motion.div>
  );
}
