
import { useEffect, useState } from "react";
import { getProducts } from "../data/api";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";

const tabs = [
  { name: "All", cats: null },
  { name: "Men", cats: ["mens-shirts", "mens-shoes", "mens-watches"] },
  { name: "Mobiles", cats: ["smartphones", "mobile-accessories"] },
  { name: "Gadgets", cats: ["laptops", "tablets"] },
  { name: "Sports", cats: ["sports-accessories"] },
];

export default function Home({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const cats = tabs[tab].cats;

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !cats || cats.includes(product.category);

    const search = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !search ||
      product.title.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      (product.brand || "").toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <Hero products={products} />

      <div className="flex gap-2 overflow-x-auto mb-4">
        {tabs.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setTab(i)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold border transition-colors ${
              tab === i
                ? "bg-[#7f5af0] border-[#7f5af0]"
                : "bg-white/10 border-white/15 text-white/70"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-3">
        {searchQuery.trim()
          ? `Search Results (${filteredProducts.length})`
          : "Deals of the Day"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-white/10 animate-pulse"
            />
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold">
              No Products Found
            </h3>
            <p className="text-white/60 mt-2">
              Try searching with another product name.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
