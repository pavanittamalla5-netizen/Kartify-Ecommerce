const categories = [
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "sports-accessories",
];

export async function getProducts() {
  const results = await Promise.all(
    categories.map((c) =>
      fetch(`https://dummyjson.com/products/category/${c}`)
        .then((r) => r.json())
        .then((d) => d.products)
    )
  );
  return results.flat();
}