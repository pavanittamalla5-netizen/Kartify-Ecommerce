import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    title: "Big Billion Sale",
    text: "Up to 70% off on mobiles",
    bg: "linear-gradient(120deg, #7F5AF0, #2CB67D)",
    cats: ["smartphones", "mobile-accessories"],
  },
  {
    title: "Fashion Fest",
    text: "Min 50% off on men's wear",
    bg: "linear-gradient(120deg, #FF8906, #7F5AF0)",
    cats: ["mens-shirts", "mens-shoes", "mens-watches"],
  },
  {
    title: "Gadget Days",
    text: "Laptops and tablets at best prices",
    bg: "linear-gradient(120deg, #2CB67D, #16162E)",
    cats: ["laptops", "tablets"],
  },
];

export default function Hero({ products = [] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, []);

  const s = slides[i];
  const imgs = products.filter((p) => s.cats.includes(p.category)).slice(0, 3);

  return (
    <div className="relative h-40 md:h-56 rounded-2xl overflow-hidden mb-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-between px-6"
          style={{ background: s.bg }}
        >
          <div>
            <h2 className="text-xl md:text-4xl font-bold">{s.title}</h2>
            <p className="mt-1 text-sm md:text-base text-white/90">{s.text}</p>
          </div>
          <div className="flex">
            {imgs.map((p, k) => (
              <motion.img
                key={p.id}
                src={p.thumbnail}
                alt={p.title}
                className="h-20 md:h-44 -ml-5 first:ml-0 drop-shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: k * 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}